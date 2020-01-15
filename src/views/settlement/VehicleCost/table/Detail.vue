<template>
  <div>
    <a-card class="card" title="路用车使用费结算单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="结算日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="供应商">{{ dataObj.supplier_name }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 明细 -->
    <a-card class="card" title="明细">
      <a-table
        bordered
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        class="line-table"
        :scroll="{ x: 2400 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            :maxlength="128"
            :read-only="col === 'contract_code'"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnTitle[i]"
            @click="() => {
              col !== 'contract_code' ? '' : showTable(record)
            }"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectDetailData[col]"
              :key="item.dic_enum_name"
              :value="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :placeholder="columnTitle[i]"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-range-picker
            v-decorator="['range-time-picker']"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :key="col"
            :value="text"
            v-else-if="record.editable && rangePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0"
            :max="col === 'amount' ? 999999999 : 999999999.99"
            :placeholder="columnTitle[i]"
            :step="col === 'price' ? 0.01 : 1"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
      </a-table>
    </a-card>

    <!-- file upload and approval record-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <a-table
          :columns="attachColumns"
          :dataSource="fileList"
          :pagination="false"
          :loading="memberLoading"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <template slot="apitalMaterial" slot-scope="text, record">
            <span>
              <a @click="download(record)">
                <a-icon type="cloud-download" />
              </a>
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div class="approval" v-if="activeTabKey === 'approval'">
        <a-table :columns="approvalColumns" :dataSource="approvalList" :pagination="false" rowKey="id"/>
        <br />
      </div>
    </a-card>

    <a-card :bordered="false" v-if="this.recording.type !== 'read'" title="审批意见">
      <a-textarea
        :maxlength="1000"
        placeholder="请输入审批意见, 1000字以内"
        @change="txtChange"
        :value="noted"
      />
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button
        v-if="this.recording.type!=='read'&& refusebile"
        type="primary"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <a-button
        v-if="this.recording.type!=='read'&& refusebile"
        type="primary"
        @click="approve"
        :loading="submitLoading"
      >通过</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { STable } from '@/components'
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  getDeviceList,
  handleApitalMaterial,
  getSerialNumber,
  getAmount,
  handleRefuse,
  handleApprove
  // getMaterialType
} from '@/api/settlement/VehicleCost'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules, queryAllContract, getdictionary, handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item

const selectDetailData = {

}

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    DetailList,
    DetailListItem,
    FooterToolBar
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  data () {
    return {
      approvalList: [],
      isrequired: false,
      sizeable: true,
      queryParam: {},
      customFilterColumn: {},
      newDataKey: '',
      // 点验单数据
      visible_name: false,
      loadTable: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryAllContract(Object.assign(parameter, this.queryParam, { menu_id: 61, scope_code: this.$store.state.menu_key || this.$store.state.user.first_key })).then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          this.contractData = res

          return (
            res.result || {
              pageSize: res.responsePageInfo.pageSize,
              pageNo: res.responsePageInfo.pageNum,
              totalPage: res.responsePageInfo.pages,
              totalCount: res.responsePageInfo.total,
              data: res.responsePageInfo.list
            }
          )
        })
      },

      tabList: [
        {
          key: 'attach',
          tab: '附件上传'
        },
        {
          key: 'approval',
          tab: '审批记录'
        }
      ],
      noted: '',
      queryPurchase: [],
      queryMaterialType: [],
      selectedRowKeys: [],
      selectedRows: [],
      serialable: false,

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      activeTabKey: 'attach',
      fileList: [],
      selectData: {
        recyclable: [
          {
            dic_enum_name: '是',
            dic_enum_id: 1
          },
          {
            dic_enum_name: '否',
            dic_enum_id: 2
          }
        ]
      },
      columnTitle: [
        '合同编号',
        '路用车名称',
        '规格型号',
        '不含税单价',
        '数量',
        '结算起始时间',
        '结算终止时间',
        '结算天数',
        '税率',
        '税额',
        '结算金额（不含税）',
        '结算金额（含税）',
        '合同开累金额（不含税）',
        '合同开累金额（含税）',
        '备注'
      ],
      selectFields: [
        'tax_rate',
      ],
      serial_number: '',
      inputFields: [
        'contract_code',
        // 'vehicle_name',
        // 'specifications',
        'remark'
      ],
      rangePickerFields: [],
      datePickerFields: [
        'settlement_start_time1',
        'settlement_end_time1',
      ],
      numberFields: [
        // 'unit_price_excluding_tax',
        'amount',
        // 'settlement_days',
        // 'total_tax_amount',
        // 'amount_without_tax',
        // 'settlement_amount_tax',
        // 'contract_add_amount_without_tax',
        // 'contract_add_amount',
      ],
      dataObj: {},
      selectDetailData: selectDetailData,
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      form: this.$form.createForm(this),
      id: 0,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          width: '61px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_code',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'contract_code' }
        },
        {
          title: '路用车名称',
          dataIndex: 'vehicle_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'vehicle_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'specifications',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'specifications' }
        },
        {
          title: '不含税单价',
          dataIndex: 'unit_price_excluding_tax',
          align: 'right',
          scopedSlots: { customRender: 'unit_price_excluding_tax' }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'right',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '结算起始时间',
          dataIndex: 'settlement_start_time1',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'settlement_start_time1' }
        },
        {
          title: '结算终止时间',
          dataIndex: 'settlement_end_time1',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'settlement_end_time1' }
        },
        {
          title: '结算天数',
          dataIndex: 'settlement_days',
          align: 'right',
          scopedSlots: { customRender: 'settlement_days' }
        },
        {
          title: '税率',
          dataIndex: 'tax_rate',
          align: 'right',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额',
          dataIndex: 'total_tax_amount',
          align: 'right',
          scopedSlots: { customRender: 'total_tax_amount' }
        },
        {
          title: '结算金额（不含税）',
          dataIndex: 'amount_without_tax',
          align: 'right',
          scopedSlots: { customRender: 'amount_without_tax' }
        },
        {
          title: '结算金额（含税）',
          dataIndex: 'settlement_amount_tax',
          align: 'right',
          scopedSlots: { customRender: 'settlement_amount_tax' }
        },
        {
          title: '合同开累金额（不含税）',
          dataIndex: 'contract_add_amount_without_tax',
          align: 'right',
          scopedSlots: { customRender: 'contract_add_amount_without_tax' }
        },
        {
          title: '合同开累金额（含税）',
          dataIndex: 'contract_add_amount',
          align: 'right',
          scopedSlots: { customRender: 'contract_add_amount' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      detailFields: [
        'contract_code',
        'vehicle_name',
        'specifications',
        'unit_price_excluding_tax',
        'amount',
        'settlement_start_time1',
        'settlement_end_time1',
        'settlement_days',
        'tax_rate',
        'total_tax_amount',
        'amount_without_tax',
        'settlement_amount_tax',
        'contract_add_amount_without_tax',
        'contract_add_amount',
        'remark'
      ],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'file_name',
          key: 'attachname'
        },
        {
          title: '附件大小',
          dataIndex: 'file_size',
          key: 'size'
        },
        {
          title: '上传人',
          dataIndex: 'upload_user_name',
          key: 'upload_user_name'
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'apitalMaterial' }
        }
      ],
      approvalColumns: [
        {
          title: '审批人',
          dataIndex: 'user_name',
          key: 'user_name'
        },
        {
          title: '审批状态',
          dataIndex: 'dic_enum_name',
          key: 'dic_enum_name'
        },
        {
          title: '审批意见',
          dataIndex: 'noted',
          key: 'noted'
        },
        {
          title: '审批环节',
          dataIndex: 'activity_inst_name',
          key: 'activity_inst_name'
        },
        {
          title: '审批岗位',
          dataIndex: 'user_position_name',
          key: 'user_position_name'
        },
        {
          title: '审批时间',
          dataIndex: 'approval_time',
          key: 'approval_time'
        }
      ],
      sumObj: {},
      errors: []
    }
  },
  computed: {
    fields () {
      const field = {}

      this.contract_data.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field
    },
    contract_data () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_code',
          scopedSlots: {
            customRender: 'contract_code'
          }
        },
        {
          title: '路用车',
          dataIndex: 'vehicle_name',
          scopedSlots: {
            customRender: 'vehicle_name'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          scopedSlots: {
            customRender: 'spec'
          }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'price',
          width: '150px',
          scopedSlots: {
            customRender: 'price'
          }
        }
      ]
    },
    date () {
      return moment()
    },
    uploadUrl () {
      return uploadUrl
    },
    formStatus () {
      return formStatus
    },
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/settlement/vehicleCost') {
        this.isrequired = true
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isrequired = true
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),

    handleGoBack () {
      this.$emit('onGoBack')
    },
    // 通过
    approve () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定通过当前审批?`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          that.submitLoading = true
          return handleApprove({
            creator_org_id: that.$store.state.menu_key,
            id: that.recording.id,
            menu_id: 61,
            process_inst_id: that.recording.process_inst_id,
            noted: that.noted
          }).then(res => {
            that.submitLoading = false
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.handleGoBack() // 返回列表页
            }
          })
        },
        onCancel () {
          that.submitLoading = false
        }
      })
    },

    // 拒绝
    refuse () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定打回当前审批?`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          that.saveLoading = true
          return handleRefuse({
            creator_org_id: that.$store.state.menu_key,
            id: that.recording.id,
            menu_id: 61,
            process_inst_id: that.recording.process_inst_id,
            noted: that.noted
          }).then(res => {
            that.saveLoading = false
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.handleGoBack() // 返回列表页
            }
          })
        },
        onCancel () {
          that.saveLoading = false
        }
      })
    },

    txtChange (e) {
      this.noted = e.target.value
    },

    loadEditInfo (data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      getdictionary({ pageNum: 1, pageSize: 13, dic_type_id: 1006 }).then(res => {
        this.selectDetailData['tax_rate'] = res.responseList
      })
      if (data.id) {
        this.serialable = true

        getDeviceList({ id: data.id, menu_id: 61 }).then(res => {
          this.dataObj = res.responseObject
          this.detailData = res.responseObject.details.map((d, i) => {
            d.key = d.id
            d.order_number = i + 1
            d.settlement_start_time1 = d.settlement_start_time
            d.settlement_end_time1 = d.settlement_end_time
            return d
          })

          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 61, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }

          this.fileList = res.responseObject.files.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size
            attachment.username = attachment.upload_user_name

            return attachment
          })
        })
      }
    },

    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        if (!x[attr]) x[attr] = 0
        if (x.order_number !== '合计') {
          num += parseInt((x[attr] || 0) * 100)
        }
      })
      return num / 100
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 61,
        type: 0,
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
          }
        ]
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 提示框
    noSelect (title) {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: title || '请选择至少一条记录'
      })

      setTimeout(() => {
        modal.destroy()
      }, secondsToGo * 1000)
    },
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
