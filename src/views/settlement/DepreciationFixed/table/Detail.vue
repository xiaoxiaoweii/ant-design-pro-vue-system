<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card
      class="card"
      title="设备明细"
      :bordered="false"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
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
    <!-- <a-card
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
            </span>
          </template>
        </a-table>
      </div> -->
      <!-- 审批记录 -->
      <!-- <div
        class="approval"
        v-if="activeTabKey === 'approval'"
      >
        <a-table
          :columns="approvalColumns"
          :dataSource="[]"
          :pagination="false"
        />
        <br />
      </div>
    </a-card> -->

    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
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
import {
  getDeviceList,
  handleDepreciationFixed,
  getSerialNumber,
} from '@/api/settlement/depreciationFixed'
import { uploadUrl, getAttachments, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
import DetailList from '@/components/tools/DetailList'
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
        // {
        //   key: 'approval',
        //   tab: '审批记录'
        // }
      ],
      dataObj: {},
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
          title: '序号',
          dataIndex: 'order_number',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '功率（kw）',
          dataIndex: 'power',
          align: 'right',
          width: '120px',
          scopedSlots: { customRender: 'power' }
        },
        {
          title: '管理号码',
          dataIndex: 'management_code',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'management_code' }
        },
        {
          title: '原值（元）',
          dataIndex: 'original_value',
          align: 'right',
          width: '120px',
          scopedSlots: { customRender: 'original_value' }
        },
        {
          title: '净值',
          dataIndex: 'net_value',
          align: 'right',
          width: '120px',
          scopedSlots: { customRender: 'net_value' }
        },
        {
          title: '当月折旧金额（元）',
          dataIndex: 'depreciation_amount',
          align: 'right',
          width: '180px',
          scopedSlots: { customRender: 'depreciation_amount' }
        },
        {
          title: '本项目累计折旧',
          dataIndex: 'accumulative_depreciation',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'accumulative_depreciation' }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'manufacturer' }
        },
        {
          title: '出厂日期',
          dataIndex: 'production_date',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'production_date' }
        },
        {
          title: '技术状态',
          dataIndex: 'technical_state',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'technical_state' }
        },
        {
          title: '闲置/在用',
          dataIndex: 'idle_inuse',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'idle_inuse' }
        },
        {
          title: '使用单位（工作地点）',
          dataIndex: 'use_org',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'use_org' }
        },
        {
          title: '调入时间',
          dataIndex: 'tuning_in_date',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'tuning_in_date' }
        },
        {
          title: '来源项目',
          dataIndex: 'source_project',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'source_project' }
        },
        {
          title: '计划调出时间',
          dataIndex: 'planned_out_date',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'planned_out_date' }
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   fixed: 'right',
        //   width: '90px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'depreciationFixed' }
        // }
      ],
      detailFields: [
        'equip_name',
        'spec',
        'power',
        'management_code',
        'original_value',
        'net_value',
        'depreciation_amount',
        'accumulative_depreciation',
        'manufacturer',
        'production_date',
        'technical_state',
        'idle_inuse',
        'use_org',
        'tuning_in_date',
        'source_project',
        'planned_out_date'
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
      return modules.purchase
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
        getDeviceList({ id: data.id, menu_id: 56, scope_code: this.$store.state.menu_key ||this.$store.state.user.first_key }).then(res => {
          this.dataObj = res.responseObject
          this.detailData = res.responseObject.details.map((d, i) => {
            d.editable = false
            d.isNew = false
            // d.planned_date = moment(d.planned_date)
            d.key = d.id
            d.order_number = i + 1

            return d
          })
        })

        // getAttachments({ module: modules.purchase, id_in_module: data.id }).then(res => {
        //   this.fileList = res.responseList.map(attachment => {
        //     attachment.uid = attachment.id.toString()
        //     attachment.status = 'done'
        //     attachment.url = ''
        //     attachment.key = attachment.id.toString()
        //     attachment.name = attachment.file_name
        //     attachment.size = attachment.file_size
        //     attachment.username = attachment.upload_user_name
        //     return attachment
        //   })
        // })
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
    handleChange (value, key, column) {
      const newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value

        if (['estimated_price', 'number'].includes(column)) {
          target.amount = (target.estimated_price * target.number).toFixed(2)
          if (isNaN(target.amount)) target.amount = 0

          this.form.setFieldsValue({
            total_amount: newData.reduce((total, d) => {
              return total + Number(d.amount)
            }, 0)
          })
        }

        if (column === 'name') {
          const equipment = this.selectEquData.filter(equ => equ.id === value)[0]
          target.spec = equipment.equSpecs
          target.model = equipment.equModel
          target.equipment_code = equipment.equCode
        }
        this.detailData = newData
      }
    },
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

              return handlePurchase(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(res => {
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
        file.module = modules.purchase
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
