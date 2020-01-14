<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <detail-list>
        <detail-list-item term="单据编号">{{ recording.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.creator_org_name }}</detail-list-item>
        <detail-list-item term="编制人">{{ recording.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.create_date }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card
      class="card"
      title="工程明细"
      :bordered="false"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        :scroll="{ x: 2000 }"
        bordered
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text"
        >
          <template>{{ text }}</template>
        </template>
      </a-table>
      <div v-if="detailData.length > 1">
        <a-table
          :columns="columnsSum"
          :dataSource="getSum"
          :pagination="false"
          :loading="memberLoading"
          :showHeader="false"
          rowKey="all_total"
          :scroll="{ x: 2000 }"
          bordered
        >
          <template v-for="(col, i) in detailFields" 
          :slot="col" 
          slot-scope="text">
            <template>{{ text }}</template>
          </template>
        </a-table>
      </div>
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
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >打回</a-button>
      &nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >通过</a-button>
      &nbsp;
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
import { handlePurchase, submitRequire,queryone,queryTaxRate,getSerialNumber} from '@/api/computation/actualCost'
import {uploadUrl,modules,model,getAttachments, downloadAttachment, delAttachment, formStatus} from'@/api/computation/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

const selectData = {
  'unit': [
    {
      dic_enum_name: '台'
    },
    {
      dic_enum_name: '车'
    },
    {
      dic_enum_name: '船'
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
          title: '单位工程名称',
          dataIndex: 'project_name',
          key: 'project_name',
          width: '200px',
          align: 'center'
        },
        {
          title: '分包商名称',
          dataIndex: 'subcontractor_name',
          key: 'subcontractor_name',
          width: '150px',
          align: 'center'
        },
       
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          key: 'equip_name',
          width: '150px',
          align: 'center'
        },
        {
          title: '规格型号',
          dataIndex: 'specifications',
          key: 'specifications',
          width: '150px',
          align: 'center'
        },
        {
          title: '管理号码',
          dataIndex: 'manage_number',
          key: 'manage_number',
          width: '150px',
          align: 'center'
  
        },
        {
          title: '设备来源',
          dataIndex: 'equip_source',
          key: 'equip_source',
          width: '150px',
          align: 'center'
        },
        {
          title: '是否扣款',
          dataIndex: 'is_deduction',
          key: 'is_deduction',
          width: '150px',
          align: 'center'
        },
        {
          title: '时间范围',
          dataIndex: 'time',
          key: 'time',
          width: '250px',
          align: 'center'
  
        },
        {
          title: '使用时长（工作量）',
          dataIndex: 'use_time',
          key: 'use_time',
          width: '150px',
          align: 'center'
  
        },
        {
          title: '综合单价',
          dataIndex: 'comprehensive_price',
          key: 'comprehensive_price',
          width: '150px',
          align: 'center'
        },
        {
          title: '小计',
          dataIndex: 'subtotal',
          key: 'subtotal',
          width: '150px',
          align: 'center'
        }
      ],
      detailFields: ['time' ,'manage_number', 'project_name', 'subcontractor_name', 'equip_name', 'specifications', 'equip_source', 'is_deduction', 'use_time', 'comprehensive_price', 'subtotal'],
      sumData:[{
        all_total: '实际设备成本合计',
        subcontractor_name1: '',
        equip_name1: '',
        specifications1: '',
        manage_number1: '',
        equip_source1: '',
        is_deduction1: '',
        price1: '',
        use_time1: '',
        comprehensive_price1: '',
        subtotal1: '',
        editable: true,
        isNew: true,
      }],
      columnsSum: [
       {
          title: '单位工程名称',
          dataIndex: 'all_total',
          key: 'all_total',
          width: '200px',
          align: 'center'
        },
        {
          title: '分包商名称',
          dataIndex: 'subcontractor_name1',
          key: 'subcontractor_name1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'subcontractor_name1' }
        },
       
        {
          title: '设备名称',
          dataIndex: 'equip_name1',
          key: 'equip_name1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'equip_name1' }
        },
        {
          title: '规格型号',
          dataIndex: 'specifications1',
          key: 'specifications1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'specifications1' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_number1',
          key: 'manage_number1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'manage_number1' }
  
        },
        {
          title: '设备来源',
          dataIndex: 'equip_source1',
          key: 'equip_source1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'equip_source1' }
        },
        {
          title: '是否扣款',
          dataIndex: 'is_deduction1',
          key: 'is_deduction1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'is_deduction1' }
        },
        {
          title: '时间范围',
          dataIndex: 'price1',
          key: 'price1',
          width: '250px',
          align: 'center',
          scopedSlots: { customRender: 'price1' }
  
        },
        {
          title: '使用时长（工作量）',
          dataIndex: 'use_time1',
          key: 'use_time1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'use_time1' }
  
        },
        {
          title: '综合单价',
          dataIndex: 'comprehensive_price1',
          key: 'comprehensive_price1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'comprehensive_price1' }
  
        },
        {
          title: '小计',
          dataIndex: 'subtotal1',
          key: 'subtotal1',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'subtotal1' }
        }                                                
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
    },
    getSum () {
      let count = 0
      for (let item of this.detailData) {
        count += item.subtotal*1
      }
      // console.log(count)
      this.sumData[0].subtotal1 = count.toFixed(2)
      return this.sumData
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
        queryone ({ id: data.id, menu_id: 11 }).then(res => {
          this.detailData = res.responseObject.detail.map(d => {
            d.subtotal = d.subtotal.toString()
            d.time = [ ]
            d.time[0] = d.start_date
            d.time[1] = '~'
            d.time[2] = d.end_date
            // console.log('time', d.time)
            d.editable = false
            d.isNew = false
            // d.planned_date = moment(d.planned_date)
            d.key = d.id

            return d
          })
        })

        getAttachments({ module: modules.purchase, id_in_module: data.id }).then(res => {
          this.fileList = res.responseList.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.file_size = attachment.file_size.toString()
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
        no: length + 1,
        project_name: '',
        subcontractor_name: '',
        equip_name: '',
        specifications: '',
        manage_number: '',
        equip_source: '',
        is_deduction: '',
        time: null,
        use_time: '',
        comprehensive_price: '',
        subtotal: '',
        editable: true,
        isNew: true
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

        // if (['quantity', 'price'].includes(column)) {
        //   target.deduction_amount= (target.quantity *target.price).toFixed(2)
        // }
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

    // 保存或提交
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
              values.details.map(x => {
                x.end_date = x.time[1].format('YYYY-MM-DD')
                x.start_date = x.time[0].format('YYYY-MM-DD')
                return x
              })
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
