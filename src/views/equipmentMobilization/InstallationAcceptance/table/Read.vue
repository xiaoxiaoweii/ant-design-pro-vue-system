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
        <detail-list-item term="验收单位">{{ recording.check_org }}</detail-list-item>
        <detail-list-item term="合同编号">{{ recording.contract_no }}</detail-list-item>
        <detail-list-item term="安装单位">{{ recording.install_org }}</detail-list-item>
        <detail-list-item term="含税合同金额">{{ recording.fee_with_tax }}</detail-list-item>
        <detail-list-item term="管理号码">{{ recording.manage_code }}</detail-list-item>
        <detail-list-item term="设备名称">{{ recording.equip_name}}</detail-list-item>
         <detail-list-item term="合同编号">{{ recording.contract_no }}</detail-list-item>
        <detail-list-item term="规格型号">{{ recording.spec }}</detail-list-item>
        <detail-list-item term="验收日期">{{ recording.check_date }}</detail-list-item>
        <detail-list-item term="安装单位人员">{{ recording.install_person }}</detail-list-item>
        <detail-list-item term="验收单位人员">{{ recording.check_person}}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card
      class="card"
      title="验收内容"
      :bordered="false"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
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
      <div>
        <a-table
          :columns="columnsSum"
          :dataSource="sumData"
          :pagination="false"
          :loading="memberLoading"
          :showHeader="false"
          rowKey="all_total"
        >
          <template v-for="(col, i) in sumFields" :slot="col" slot-scope="text">
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
import { getDeviceList, handlePurchase, submitRequire, queryone, getQueryResult} from '@/api/equipmentMobilization/InstallationAcceptance'
import {uploadUrl, modules, model,getAttachments, downloadAttachment, delAttachment, formStatus} from'@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

const selectData = {
  'equipment_unit': [
    {
      title: '台',
      value: '台'
    },
    {
      title: '车',
      value: '车'
    },
    {
      title: '船',
      value: '船'
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
      detail_Data: [
        {
          'check_code': '001',
          code: '1',
          check_item: '发动机',
          content: '声响，排烟情况',
          result: '符合要求'
        },
        {
          'check_code': '00101',
          code: '2',
          check_item: '发动机',
          content: '主机情况',
          result: '符合要求'
        },
        {
          'check_code': '00102',
          code: '3',
          check_item: '发动机',
          content: ' 跑、冒、滴、漏情况',
          result: '符合要求'
        },
        {
          'check_code': '00103',
          code: '4',
          check_item: '发动机',
          content: ' 清洁、润滑及其它',
          result: '符合要求'
        },
        {
          'check_code': '002',
          code: '5',
          check_item: '底盘',
          content: '整体情况',
          result: '符合要求'
        },
        {
          'check_code': '00201',
          code: '6',
          check_item: '底盘',
          content: '调整紧固、声响情况',
          result: '符合要求'
        },
        {
          'check_code': '00202',
          code: '7',
          check_item: '底盘',
          content: ' 跑、冒、滴、漏情况',
          result: '符合要求'
        },
        {
          'check_code': '00203',
          code: '8',
          check_item: '底盘',
          content: ' 清洁、润滑及其它',
          result: '符合要求'
        }
      ],
      columns: [
        // {
        //   title: '序号',
        //   dataIndex: 'code',
        //   key: 'code',
        //   scopedSlots: { customRender: 'code' }
        // },
        {
          title: '类别',
          dataIndex: 'check_item',
          key: 'check_item',
          width: '200px',
          // scopedSlots: { customRender: 'check_item' }
        },
        {
          title: '验收内容',
          dataIndex: 'content',
          key: 'content',
          // scopedSlots: { customRender: 'content' }
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          // scopedSlots: { customRender: 'result' }
        }
      ],
      detailFields: ['code', 'check_item', 'content', 'result'],
      sumData: [{
        all_total: '验收总结论',
        check_result: '',
        content1: '结论描述',
        result1: '',
        editable: true,
        isNew: true
      } ],
      columnsSum: [
        {
          title: '序号',
          dataIndex: 'all_total',
          key: 'all_total',
          align: 'center',
          scopedSlots: { customRender: 'all_total' }
        },
        {
          title: '类别',
          dataIndex: 'check_result',
          key: 'check_result',
          // width: '200px',
          scopedSlots: { customRender: 'check_result' }
        },
        {
          title: '验收内容',
          dataIndex: 'content1',
          key: 'content1',
          align: 'center',
          scopedSlots: { customRender: 'content1' }
        },
        {
          title: '验收结果',
          dataIndex: 'check_remarks',
          key: 'check_remarks',
          // width:'300px',
          scopedSlots: { customRender: 'check_remarks' }
        }
      ],
      sumFields: ['all_total', 'check_result', 'content1', 'check_remarks'],
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
      this.detailData = this.detail_Data.map((d, i) => {
        d.key = i
        // d.code = d.code
        // d.check_item = d.check_item
        // d.content = d.content
        // d.result = d.result
        d.editable = true
        d.isNew = true
        return d
      })
      if (data.id) {
        queryone ({ id: data.id, menu_id: 1 }).then(res => {
          this.detailData = res.responseObject.detail.map(d => {
            d.editable = false
            d.isNew = false
            // d.planned_date = moment(d.planned_date)
            d.key = d.id

            return d
          })
          this.sumData[0]['check_result'] = res.responseObject.check_result
          this.sumData[0]['check_remarks'] = res.responseObject.check_remarks
        })

        getAttachments({ module: modules.purchase, id_in_module: data.id }).then(res => {
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
        code: length + 1,
        check_item: '',
        content: '',
        result: '',
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

        // if (['estimated_price', 'number'].includes(column)) {
        //   target.amount = (target.estimated_price * target.number).toFixed(2)
        //   if (isNaN(target.amount)) target.amount = 0

        //   this.form.setFieldsValue({
        //     total_amount: newData.reduce((total, d) => {
        //       return total + Number(d.amount)
        //     }, 0)
        //   })
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
