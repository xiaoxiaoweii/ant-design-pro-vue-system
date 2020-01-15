<template>
  <div>
    <a-card class="card" title="租赁设备结算管理" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
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
        :scroll="{ x: 2400 }"
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
  getHistory,
  getLedger,
  getSupplier,
  getAmount,
  handleRefuse,
  handleApprove
  // getMaterialType
} from '@/api/settlement/settlementLeased'
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
      approvalList: [],
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
      activeTabKey: 'attach',
      fileList: [],

      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,

      form: this.$form.createForm(this),

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
          scopedSlots: { customRender: 'contract_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          align: 'center',
          scopedSlots: { customRender: 'manage_code' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '结算起始时间',
          dataIndex: 'settlement_start_time1',
          align: 'center',
          scopedSlots: { customRender: 'settlement_start_time1' }
        },
        {
          title: '结算截止时间',
          dataIndex: 'settlement_end_time1',
          align: 'center',
          scopedSlots: { customRender: 'settlement_end_time1' }
        },
        {
          title: '租赁方式',
          dataIndex: 'rent_type',
          align: 'center',
          scopedSlots: { customRender: 'rent_type' }
        },
        {
          title: '计费方式',
          dataIndex: 'fee_type',
          align: 'center',
          scopedSlots: { customRender: 'fee_type' }
        },
        {
          title: '不含税单价',
          dataIndex: 'unit_price_excluding_tax',
          align: 'right',
          scopedSlots: { customRender: 'unit_price_excluding_tax' }
        },
        {
          title: '含税单价',
          dataIndex: 'rent_price_monthly',
          align: 'right',
          scopedSlots: { customRender: 'rent_price_monthly' }
        },
        {
          title: '租期/工作量',
          dataIndex: 'planned_quantity',
          align: 'right',
          scopedSlots: { customRender: 'planned_quantity' }
        },
        {
          title: '税率（%）',
          dataIndex: 'tax_rate',
          align: 'right',
          scopedSlots: { customRender: 'tax_rate' }
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
          title: '结算金额(不含税)',
          dataIndex: 'settlement_amount_excluding_tax',
          align: 'right',
          scopedSlots: { customRender: 'settlement_amount_excluding_tax' }
        },
        {
          title: '结算金额（含税）',
          dataIndex: 'settlement_amount',
          align: 'right',
          scopedSlots: { customRender: 'settlement_amount' }
        },
        {
          title: '开累结算金额（不含税）',
          dataIndex: 'contract_add_amount_without_tax',
          align: 'right',
          scopedSlots: { customRender: 'contract_add_amount_without_tax' }
        },
        {
          title: '开累结算金额（含税）',
          dataIndex: 'contract_add_amount',
          align: 'right',
          scopedSlots: { customRender: 'contract_add_amount' }
        },
        // {
        //   title: '操作',
        //   key: 'action',
        //   width: '90px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'apitalMaterial' }
        // }
      ],
      detailFields: [
        'contract_code',
        'equip_name',
        'manage_code',
        'spec',
        'settlement_start_time1',
        'settlement_end_time1',
        'rent_type',
        'fee_type',
        'rent_price_monthly',
        'planned_quantity',
        'tax_rate',
        'other_fees',
        'other_fees_cost',
        'deductions_money',
        'deductions_money_cost',
        'settlement_amount_excluding_tax',
        'settlement_amount',
        'contract_add_amount_without_tax',
        'contract_add_amount'
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
            menu_id: 58,
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
            menu_id: 58,
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

      if (data.id) {
        getDeviceList({ id: data.id, menu_id: 58 }).then(res => {
          this.dataObj = res.responseObject
          this.detailData = res.responseObject.details.map((d, i) => {
            d.editable = true
            d.isNew = true
            d.key = d.id
            d.order_number = i + 1
            d.settlement_start_time && (d.settlement_start_time1 = d.settlement_start_time)
            d.settlement_end_time && (d.settlement_end_time1 = d.settlement_end_time)
            d.unit_price_excluding_tax = parseInt(d.rent_price_monthly * 100 / (d.tax_rate * 1 + 100) * 100) / 100
            getAmount({ contract_code: d.contract_code }).then(res => {
              console.log(res)
              d.sumObj = res.responseObject
            })

            return d
          })

          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 58, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }

          if (this.detailData.length) this.detailData.push({
            key: '0',
            order_number: '合计',
            editable: false,
            isNew: true
          })
          const arr = ['rent_price_monthly', 'unit_price_excluding_tax', 'planned_quantity', 'other_fees', 'deductions_money', 'settlement_amount_excluding_tax', 'settlement_amount', 'contract_add_amount_without_tax', 'contract_add_amount']
          arr.map(x => {
            this.detailData.forEach(d => {
              if (d.order_number === '合计') {
                d[x] = this.data_sum(x)
              }
            })
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

    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        if (x.order_number !== '合计') {
          num += parseInt((x[attr] || 0) * 100)
        }
      })
      return num / 100
    },

    handleChange (value, key, column) {
      let newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value

        if (['quantity', 'price', 'amortization_period', 'months_amortized'].includes(column)) {
          // if (target.price) {
          if (target.amortization_period && target.months_amortized) {
            target.months_amortized = target.amortization_period > target.months_amortized ? target.months_amortized : target.amortization_period
          }

          if (!target.quantity) {
            target.quantity = ''
            target.original_value = ''
            target.net_value = ''
            target.amortized_amount = ''
            target.month_amortized_amount = ''
          }

          if (!target.amortization_period) {
            target.amortization_period = ''
            target.month_amortized_amount = ''
            target.amortized_amount = ''
          }

          if (!target.months_amortized) {
            target.months_amortized = ''
            target.amortized_amount = ''
            target.net_value = ''
          }

          if (target.quantity && target.quantity) {
            // 原值
            target.original_value = parseInt(target.price * target.quantity * 100) / 100
          }

          if (target.price && target.quantity && target.amortization_period) {
            // 本月摊销金额
            target.month_amortized_amount = parseInt(target.price * target.quantity / target.amortization_period * 100) / 100
          }

          if (target.price && target.quantity && target.amortization_period && target.months_amortized) {
            // 已摊销金额
            target.amortized_amount = parseInt(target.price * target.quantity / target.amortization_period * target.months_amortized * 100) / 100

            // 净值
            target.net_value = parseInt((target.price * target.quantity - target.amortized_amount) * 100) / 100
          }

          const arr = ['amortization_period', 'price', 'quantity', 'original_value', 'month_amortized_amount', 'months_amortized', 'amortized_amount', 'net_value']
          arr.map(x => {
            newData.forEach(d => {
              if (d.order_number === '合计') {
                d[x] = this.data_sum(x)
              }
            })
          })
          // }
        }
        this.detailData = newData
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 58,
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

    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
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
