<template>
  <div>
    <a-card class="card" title="设备运转记录表" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6" v-if="serialable">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  {
                    initialValue: this.recording.serial_number
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上传单位" v-bind="formItemLayout" default-value="0">
              <a-select
                placeholder="请选择上传单位"
                v-decorator="[
                  'upload_org_name',
                  {
                    rules: [{ required: true, message: '请选择上传单位' }]
                  }
                ]"
              >
                <a-select-option value="财务部">财务部</a-select-option>
                <a-select-option value="采购部">采购部</a-select-option>
                <a-select-option value="业务部">业务部</a-select-option>
                <a-select-option value="营销部">营销部</a-select-option>
                <a-select-option value="工程部">工程部</a-select-option>
                <a-select-option value="合同部">合同部</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上传人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'upload_user_name',
                  {
                    initialValue: nickname(),
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上传日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                style="width: 100%"
                v-decorator="[
                  'upload_date',
                  { initialValue: date }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="文档名称" v-bind="formItemLayout" default-value="0">
              <a-input
                placeholder="请输入文档名称"
                v-decorator="[
                  'doc_name',
                  {
                    rules: [{ required: true, message: '请输入文档名称' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="发文机构" v-bind="formItemLayout">
              <a-input
                placeholder="请输入发文机构"
                v-decorator="[
                  'issuer',
                  {
                    rules: [{ required: true, message: '请输入发文机构' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="发布日期" v-bind="formItemLayout">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'issue_date',
                  {
                    initialValue: date,
                    rules: [{ required: true, message: '请选择日期' }],
                  } ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="实施日期" v-bind="formItemLayout">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'avail_date',
                  {
                    initialValue: date,
                    rules: [{ required: true, message: '请选择日期' }],
                  } ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="文档类型" v-bind="formItemLayout">
              <a-select
                v-decorator="[
                  'doc_type',
                  {
                    rules: [{ required: true, message: '请选择文档类型' }],
                  }
                ]"
                placeholder="请选择文档类型"
              >
                <a-select-option
                  v-for="item in querytypeList"
                  :key="item.dic_enum_id"
                >{{ item.dic_enum_name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
        <a-upload-dragger
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'003'}"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽进行文件上传</p>
        </a-upload-dragger>
        <br />
        <a-table
          v-if="fileList.length > 0"
          :columns="attachColumns"
          :dataSource="fileList"
          :pagination="false"
          :loading="memberLoading"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <template slot="operation" slot-scope="text, record">
            <span>
              <a @click="download(record)">
                <a-icon type="cloud-download" />
              </a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="removeAttachment(record)">
                <a>
                  <a-icon type="delete" />
                </a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div class="approval" v-if="activeTabKey === 'approval'">
        <a-table :columns="approvalColumns" :dataSource="[]" :pagination="false" />
        <br />
        <a-card :bordered="false" title="工作流进度">
          <a-steps :direction="isMobile() && 'vertical' || 'horizontal'" :current="2" progressDot>
            <a-step title="开始"></a-step>
            <a-step title="部门初审"></a-step>
            <a-step title="财务复核"></a-step>
            <a-step title="完成"></a-step>
          </a-steps>
        </a-card>
      </div>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
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
              <a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />
              <div class>{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">
            <a-icon type="exclamation-circle" />
            {{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >保存</a-button>&nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >提交</a-button>&nbsp;
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
  getDeviceList,
  getSerialNumber,
  editDatabase,
  submitDatabase,
  querytypeDatabase,
  handleDatabase
} from '@/api/database/database'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
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
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
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
      serial_number: '',
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
      errors: [],
      querytypeList: [],
      selectList: {}

    }
  },
  computed: {
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
  async mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
    const { responseList: res } = await querytypeDatabase()
    this.querytypeList = res
    if (this.recording.id) {
      const { responseList: result } = await editDatabase({ id: this.recording.id })
      this.selectList = result[0]
    }
  },
  methods: {
    ...mapGetters(['nickname']),
    start () {
      this.loading = true
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleGoBack () {
      this.$emit('onGoBack')
    },

    loadEditInfo (data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        this.serialable = true

        getDeviceList({ id: data.id }).then(res => {
          this.fileList = res.responseObject.file.map(attachment => {
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

        const formData = pick(data, [
          'upload_org_name',
          'upload_user_name',
          'upload_date',
          'doc_name',
          'doc_type',
          'issuer',
          'issue_date',
          'avail_date',
          'serial_number'
        ])
        formData.issue_date = moment(data.issue_date)
        formData.avail_date = moment(data.avail_date)
        formData.upload_date = moment(data.upload_date)
        form.setFieldsValue(formData)
      }
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

    // 附件下载
    download (record) {
      downloadAttachment({
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

    // 附件删除
    removeAttachment (record) {
      delAttachment({
        filePath: record.file_path,
        fileName: record.file_name,
        id: record.id
      }).then(res => {
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
      const {
        form: { validateFields }
      } = this
      const that = this

      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk () {
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList

              if (that.recording) {
                values.flag = 2
              } else {
                // 联动参数
                values.flag = 1
              }
              values.files.map(x => {
                x.module = '003'
                return x
              })
              values.status_description = '已保存'
              values.upload_date = values.upload_date.format('YYYY-MM-DD')
              values.issue_date = values.issue_date.format('YYYY-MM-DD')
              values.avail_date = values.avail_date.format('YYYY-MM-DD')
              return handleDatabase(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(
                res => {
                  type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)

                  if (res.status === '0') {
                    that.$notification['success']({
                      message: '提示',
                      description: res.msg
                    })
                    that.handleGoBack() // 返回列表页
                  }
                }
              )
            },
            onCancel () {}
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

      fileList = fileList.map(file => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        file.module = modules.operation
        file.file_size = file.size
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'

        return file
      })

      this.fileList = fileList
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

/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
</style>
