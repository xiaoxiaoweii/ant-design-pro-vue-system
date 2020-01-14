<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <detail-list>
        <detail-list-item term="单据流水">{{ recording.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.compile_company }}</detail-list-item>
        <detail-list-item term="编制人">{{ recording.compile_person }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.compile_date }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card
      class="card"
      title="明细"
      :bordered="false"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="id"
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text"
        >
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
      <div
        class="attachment"
        v-if="activeTabKey === 'attach'"
      >
        <a-table
          :columns="attachColumns"
          :dataSource="fileList"
          :pagination="false"
          :loading="memberLoading"
        >
          <span
            slot="serial"
            slot-scope="text, record, index"
          >{{ index + 1 }}</span>
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <span>
              <a @click="download(record)">
                <a-icon type="cloud-download" /></a>
              <!-- <a-divider type="vertical" />
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="removeAttachment(record)"
              >
                <a>
                  <a-icon type="delete" /></a>
              </a-popconfirm> -->
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div
        class="approval"
        v-if="activeTabKey === 'approval'"
      >
        <a-table
          :columns="approvalColumns"
          :dataSource="[]"
          :pagination="false"
        />
        <br />
        <a-card
          :bordered="false"
          title="工作流进度"
        >
          <a-steps
            :direction="isMobile() && 'vertical' || 'horizontal'"
            :current="2"
            progressDot
          >
            <a-step title="开始">
            </a-step>
            <a-step title="部门初审">
            </a-step>
            <a-step title="财务复核">
            </a-step>
            <a-step title="完成">
            </a-step>
          </a-steps>
        </a-card>
        <br />
      </div>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <span class="popover-wrapper">
        <a-popover
          title="表单校验信息"
          overlayClassName="antd-pro-pages-forms-style-errorPopover"
          trigger="click"
          :getPopupContainer="trigger => trigger.parentNode"
        >
          <template slot="content">
            <li
              v-for="item in errors"
              :key="item.key"
              @click="scrollToField(item.key)"
              class="antd-pro-pages-forms-style-errorListItem"
            >
              <a-icon
                type="cross-circle-o"
                class="antd-pro-pages-forms-style-errorIcon"
              />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span
            class="antd-pro-pages-forms-style-errorIcon"
            v-if="errors.length > 0"
          >
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button
        type="primary"
        @click="handleGoBack"
        :loading="loading"
      >返回</a-button>
    </footer-tool-bar>
  </div>
</template>
<script>
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import DetailList from '@/components/tools/DetailList'
import {getDeviceList,handlePayment} from '@/api/settlement/ExternalPayment'
import { uploadUrl, getAttachments, downloadAttachment, delAttachment, formStatus, modules, getEquList } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

const selectData = {
  'catogery': [
    {
      title: '购买',
      value: 1
    },
    {
      title: '租赁',
      value: 2
    }
  ]
}

export default {
  name: 'TableRead',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    DetailList,
    DetailListItem
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  data () {
    return {
      remark: '',
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
      selectData: selectData,
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      id: 0,

      // details table
      detailData: [],
      columns: [
        {
          title: '业务类型',
          dataIndex: 'business_type',
          key: 'business_type'
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name'  
        },
        {
          title: '合同编号',
          dataIndex: 'contract_number',
          key: 'contract_number'
        },
        {
          title: '合同名称',
          dataIndex: 'contract_name',
          key: 'contract_name'
        },
        {
          title: '收款账户名称',
          dataIndex: 'payment_account_name',
          key: 'payment_account_name'
        },
        {
          title: '收款账号',
          dataIndex: 'receiver_account',
          key: 'receiver_account'
        },
        {
          title: '开户行',
          dataIndex: 'opening_bank',
          key: 'opening_bank'
        },
        {
          title: '资金计划流水号',
          dataIndex: 'funding_plan_serial',
          key: 'funding_plan_serial'
        },
        {
          title: '本次申请金额(元)',
          dataIndex: 'applications_amount',
          key: 'applications_amount'
        },
        {
          title: '开累支付金额(元)',
          dataIndex: 'payment_amount',
          key: 'payment_amount'
        },
        {
          title:'累计计价金额(元)',
          dataIndex:'accumulated_valuation_amount',
          key:'accumulated_valuation_amount'  
        },
        {
          title:'结算金额含税(元)',
          dataIndex:'settlement_amount_tax',
          key:'settlement_amount_tax'   
        },
        {
          title:'付款比例',
          dataIndex:'payment_ratio',
          key:'payment_ratio'  
        },
        {
          title:'备注',
          dataIndex:'remark',
          key:'remark'  
        }
      ],
      detailFields: [
       'business_type',
       'supplier_name',
       'contract_number',
       'contract_name',
       'payment_account_name',
       'receiver_account',
       'opening_bank',
       'funding_plan_serial',
       'applications_amount',
       'payment_amount',
       'accumulated_valuation_amount',
       'settlement_amount_tax',
       'payment_ratio',
       'remark'  
      ],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'name',
          key: 'attachname'
        },
        {
          title: '附件大小',
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: '上传人',
          dataIndex: 'username',
          key: 'username'
        },
        // {
        //   title: '备注',
        //   dataIndex: 'remark',
        //   key: 'attachremark'
        // },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      approvalColumns: [
        {
          title: '审批人',
          dataIndex: 'user',
          key: 'approvaluser'
        },
        {
          title: '审批意见',
          dataIndex: 'suggest',
          key: 'approvalsuggest'
        },
        {
          title: '审批人签名',
          dataIndex: 'signature',
          key: 'signature'
        },
        {
          title: '审批时间',
          dataIndex: 'date',
          key: 'approvaldate'
        }
      ],
      errors: []
    }
  },
  computed: {
    mod () {
      return modules.externalPayment
    },
    date () {
      return moment()
    },
    uploadUrl () {
      return uploadUrl
    },
    formStatus () {
      return formStatus
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

    handleGetInfo () {

    },
    loadEditInfo (data) {
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        getDeviceList({ id: data.id }).then(res => {
          this.detailData = res.responseObject.detail.map(d => {
            d.editable = false
            d.isNew = false
            // d.planned_date = moment(d.planned_date)
            d.key = d.id

            return d
          })
        })

        getAttachments({ module: modules.externalPayment, id_in_module: data.id }).then(res => {
          this.fileList = res.responseList.map(attachment => {
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
    newDevice () {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        order_number: length + 1,
        name: '',
        editable: true,
        isNew: true,
        catogery: 1,
        spec: '',
        model: '',
        estimated_price: '',
        number: '',
        amount: '',
        planned_date: null,
        remark: '',
        equipment_code: 'w12',
        unit: '台'
      })
    },
    remove (key) {
      const newData = this.detailData.filter(item => item.key !== key)
      this.detailData = newData
    },
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    // handleChange (value, key, column) {
    //   const newData = [...this.detailData]
    //   const target = newData.filter(item => key === item.key)[0]
    //   if (target) {
    //     target[column] = value

    //     if (['estimated_price', 'number'].includes(column)) {
    //       target.amount = (target.estimated_price * target.number).toFixed(2)
    //       if (isNaN(target.amount)) target.amount = 0

    //       this.form.setFieldsValue({
    //         total_amount: newData.reduce((total, d) => {
    //           return total + Number(d.amount)
    //         }, 0)
    //       })
    //     }

    //     if (column === 'name') {
    //       const equipment = this.selectEquData.filter(equ => equ.id === value)[0]
    //       target.spec = equipment.equSpecs
    //       target.model = equipment.equModel
    //       target.equipment_code = equipment.equCode
    //     }
    //     this.detailData = newData
    //   }
    // },
    handleSearch (value) {
      getEquList({ equName: value }).then(res => {
        this.selectEquData = res.responseList.map(d => {
          d.title = d.equName
          d.value = d.id
          return d
        })
      })
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment (record) {
      const data = {
        filePath: record.file_path,
        fileName: record.file_name
      }

      if (record.id) data.id = record.id
      delAttachment(data).then(res => {
        if (res.status === '0') {
          const newData = this.fileList.filter(item => item.key !== record.key)
          this.fileList = newData
          this.$notification['success']({
            message: '提示',
            description: res.msg
          })
        }
      })
    },

    // 购置单保存或提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this

      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          // console.log('Received values of form: ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk () {
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList

              if (that.recording) {
                values.id = that.recording.id
                values.remark = that.recording.remark
                values.creator_user_id = that.recording.creator_user_id
                values.creator_org_code = that.recording.creator_org_code
                values.creator_org_name = that.recording.creator_org_name
                values.flag = 2
              } else {
                // 联动参数
                values.remark = '备注'
                values.creator_user_id = '123'
                values.creator_org_code = '1111'
                values.creator_org_name = '财务部'
                values.flag = 1
              }
              values.create_date = values.create_date.format('YYYY-MM-DD')

              return handlePayment(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(res => {
                type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)

                if (res.status === '0') {
                  that.$notification['success']({
                    message: '提示',
                    description: res.msg
                  })
                  that.handleGoBack() // 返回列表页
                }
              })
            },
            onCancel () { }
          })
        }
      })
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 文件上传
    fileChange (info) {
      let fileList = [...info.fileList]

      fileList = fileList.map((file) => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        file.module = modules.externalPayment
        file.file_size = file.size
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'

        return file
      })

      this.fileList = fileList
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
