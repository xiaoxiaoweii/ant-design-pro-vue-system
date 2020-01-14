<template>
  <div>
    <a-card class="card" title="安拆运输结算单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="结算日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="供应商">{{ dataObj.supplier_name }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 明细 -->
    <a-card class="card" title="明细" :bordered="false">
      <a-table
        bordered
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        class="line-table"
        :scroll="{ x: 2300 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
          <template>{{ text }}</template>
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
        <br />
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
        <a-table
          :columns="approvalColumns"
          :dataSource="approvalList"
          :pagination="false"
          rowKey="id"
        />
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
        @click="refuse"
        type="primary"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <a-button
        v-if="this.recording.type!=='read'&& refusebile"
        @click="approve"
        type="primary"
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
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  queryAllContract
} from '@/api/equipmentMobilization/upload'
import { STable } from '@/components'
import {
  getDeviceList,
  handleApitalMaterial,
  getSerialNumber,
  getAmount,
  handleRefuse,
  handleApprove
  // getSchedule,
  // getPurchase,
  // getMaterialType
} from '@/api/settlement/demolitionStatement'
import { downloadAttachment, delAttachment, modules, handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
const FileSaver = require('file-saver')

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
      noted: '',
      refusebile: true,
      dataObj: {},

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
      selectedRowKeys: [],
      selectedRows: [],
      serialable: false,

      activeTabKey: 'attach',
      fileList: [],

      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,

      form: this.$form.createForm(this),
      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          width: '60px',
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
          title: '结算项目名称',
          dataIndex: 'settlement_project_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'settlement_project_name' }
        },
        {
          title: '内容描述',
          dataIndex: 'content_description',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'content_description' }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'price',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'right',
          width: '180px',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '税率',
          dataIndex: 'tax_rate',
          align: 'right',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额',
          dataIndex: 'tax_amount',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'tax_amount' }
        },
        {
          title: '其他费用',
          dataIndex: 'other_fees',
          align: 'right',
          scopedSlots: { customRender: 'other_fees' }
        },
        {
          title: '其他费用说明',
          dataIndex: 'other_fees_cost',
          align: 'center',
          scopedSlots: { customRender: 'other_fees_cost' }
        },
        {
          title: '扣款金额',
          dataIndex: 'deductions_money',
          align: 'right',
          scopedSlots: { customRender: 'deductions_money' }
        },
        {
          title: '扣款金额说明',
          dataIndex: 'deductions_money_cost',
          align: 'center',
          scopedSlots: { customRender: 'deductions_money_cost' }
        },
        {
          title: '结算金额（不含税）',
          dataIndex: 'settlement_amount_excluding_tax',
          align: 'right',
          width: '120px',
          scopedSlots: { customRender: 'settlement_amount_excluding_tax' }
        },
        {
          title: '结算金额（含税）',
          dataIndex: 'settlement_amount_tax',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'settlement_amount_tax' }
        },
        {
          title: '开累金额（不含税）',
          dataIndex: 'contract_add_amount_without_tax',
          align: 'right',
          width: '200px',
          scopedSlots: { customRender: 'contract_add_amount_without_tax' }
        },
        {
          title: '开累金额（含税）',
          dataIndex: 'contract_add_amount',
          align: 'right',
          width: '200px',
          scopedSlots: { customRender: 'contract_add_amount' }
        },
        {
          title: '验收情况',
          dataIndex: 'check_state',
          align: 'center',
          scopedSlots: { customRender: 'check_state' }
        }
      ],
      detailFields: [
        'contract_code',
        'settlement_project_name',
        'content_description',
        'price',
        'amount',
        'tax_rate',
        'tax_amount',
        'settlement_amount_excluding_tax',
        'settlement_amount_tax',
        'contract_add_amount_without_tax',
        'contract_add_amount',
        'check_state'
      ],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'file_name',
          key: 'file_name'
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
      errors: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),

    txtChange (e) {
      this.noted = e.target.value
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
            menu_id: 60,
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
            menu_id: 60,
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
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        num += parseInt(x[attr] * 100)
      })
      return num / 100
    },

    handleGoBack () {
      this.$emit('onGoBack')
    },

    loadEditInfo (data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        this.serialable = true

        getDeviceList({ id: data.id, menu_id: 60 }).then(res => {
          this.dataObj = res.responseObject
          this.detailData = res.responseObject.details.map((d, i) => {
            d.editable = true
            d.isNew = true
            // d.issue_time = (d.issue_time == null ? null : moment(d.issue_time))
            d.key = d.id
            d.order_number = i + 1

            return d
          })

          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 60, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }

          if (this.detailData.length) this.detailData.push({
            key: '0',
            order_number: '合计',
            editable: false,
            isNew: true,
            contract_code: '',
            settlement_project_name: '',
            content_description: '',
            price: this.data_sum('price'),
            amount: this.data_sum('amount'),
            other_fees: this.data_sum('other_fees'),
            deductions_money: this.data_sum('deductions_money'),
            // tax_rate: '6',
            tax_amount: this.data_sum('tax_amount'),
            settlement_amount_excluding_tax: this.data_sum('settlement_amount_excluding_tax'),
            settlement_amount_tax: this.data_sum('settlement_amount_tax'),
            contract_add_amount_without_tax: this.data_sum('contract_add_amount_without_tax'),
            contract_add_amount: this.data_sum('contract_add_amount'),
            check_state: ''
          })

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

    // 附件下载
    download (record) {
      downloadAttachment({
        type: 0,
        menu_id: 60,
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
    }
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
