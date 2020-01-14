<template>
  <div>
    <!-- 基本信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="管理号码"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="管理号码"
                v-decorator="[
                  'manage_code',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="设备名称"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="设备名称"
                v-decorator="[
                  'equip_name',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="检查日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[
                  'check_time'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="检查人"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="检查人"
                v-decorator="[
                  'check_user_name',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item class='label'
              label="整改内容"
              :labelCol="{
                xs: { span: 24},
                sm: { span: 2}
              }"
              :wrapperCol="{
                xs: { span: 24},
                sm: { span: 16}
              }"
            >
              <a-textarea
                placeholder="请输入内容"
                v-decorator="[
                  'check_content',
                  {
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              />
            </a-form-item>
            
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="确认人"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="确认人"
                v-decorator="[
                  'confirm_user_name',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="确认日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[
                  'confirm_time'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="制定人"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="制定人"
                v-decorator="[
                  'draft_user_name',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="制定日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[
                  'draft_time'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item
              label="整改方案"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 2}
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 16 }
              }"
            
            >
              <!-- v-bind="formItemLayout" -->
              <a-textarea
                placeholder="请输入整改方案"
                v-decorator="[
                  'corr_solution',
                  {
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="验证人"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="验证人"
                v-decorator="[
                  'verify_user_name',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="验证日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[
                  'verify_time'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item
              label="验证意见"
              :labelCol="{
                xs: { span:24 },
                sm: { span: 2 }
              }"
              :wrapperCol="{
                xs: { span: 24},
                sm: { span: 16 }
              }"
            
            >
              <!-- v-bind="formItemLayout" -->
              <a-textarea
                placeholder="请输入验证意见"
                v-decorator="[
                  'corr_opinion',
                  {
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="问题隐患照片"
              v-bind="formItemLayout"
            >
               <div class="dropbox">
                  <a-upload-dragger
                    v-decorator="['a', {
                      valuePropName: 'fileList',
                      getValueFromEvent: normFile,
                    }]"
                    name="files"
                    action="/upload.do"
                  >
                    <p class="ant-upload-drag-icon">
                      <a-icon type="inbox" />
                    </p>
                    <p class="ant-upload-text">
                      请上传问题隐患照片
                    </p>
                  </a-upload-dragger>
                </div>
            </a-form-item>
          </a-col>
          <a-col :span="6">
             <a-form-item
              label="问题整改照片"
              v-bind="formItemLayout"
            >
               <div class="dropbox">
                  <a-upload-dragger
                    v-decorator="['b', {
                      valuePropName: 'fileList',
                      getValueFromEvent: normFile_result,
                    }]"
                    name="files"
                    action="/upload.do"
                  >
                    <p class="ant-upload-drag-icon">
                      <a-icon type="inbox" />
                    </p>
                    <p class="ant-upload-text">
                      请上传问题整改照片
                    </p>
                  </a-upload-dragger>
                </div>
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
      <div
        class="attachment"
        v-if="activeTabKey === 'attach'"
      >
        <a-upload-dragger
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'010'}"
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
          <span
            slot="serial"
            slot-scope="text, record, index"
          >{{ index + 1 }}</span>
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <span>
              <a @click="download(record)"><a-icon type="cloud-download" /></a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="removeAttachment(record)"
              >
                <a><a-icon type="delete" /></a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
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
      </div> -->
      
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
      >保存</a-button>
      &nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >提交</a-button>
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
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getDeviceList, handlePurchase, submitRequire,queryone} from '@/api/safety/question'
import {uploadUrl,modules,model,getAttachments, downloadAttachment, delAttachment, formStatus} from'@/api/safety/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
// const selectData = {
//   'tax_rate':[

//   ]
// }
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
        // {
        //   key: 'approval',
        //   tab: '审批记录'
        // }
      ],
     
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
      activeTabKey: 'attach',
      fileList: [],
      selectData: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      // details table
      detailData: [],
     
      attachColumns: [
        // {
        //   title: '序号',
        //   dataIndex: 'id_in_module',
        //   key: 'id_in_module'
        // },
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
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      
      // approvalColumns: [
      //   {
      //     title: '审批人',
      //     dataIndex: 'user',
      //     key: 'approvaluser'
      //   },
      //   {
      //     title: '审批意见',
      //     dataIndex: 'suggest',
      //     key: 'approvalsuggest'
      //   },
      //   {
      //     title: '审批人签名',
      //     dataIndex: 'signature',
      //     key: 'signature'
      //   },
      //   {
      //     title: '审批时间',
      //     dataIndex: 'date',
      //     key: 'approvaldate'
      //   }
      // ],
      errors: []
    }
  },
  computed: {
    date () {
      return moment()
    },
    uploadUrl () {
      return uploadUrl 
    },
    formStatus() {
      return formStatus
    }
  },
  // beforeCreate () {
  //   this.form = this.$form.createForm(this)
  // },
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
    normFile  (e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    normFile_result  (e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    handleGetInfo () {

    },
    loadEditInfo (data) {
      const { form } = this
      console.log(data)
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        
         queryone({id:data.id}).then(res => {
          console.log("一查三",res)
         
        })
        getAttachments({ id_in_module: data.id, module:modules.question} ).then(res => {
          console.log(res)
          this.fileList = res.responseList.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
        })
        const formData = pick(data, ['manage_code', 'equip_name', 'check_time', 'check_user_name', 'check_content', 'confirm_user_name', 'confirm_time', 'draft_user_name', 'draft_time', 'corr_solution', 'verify_user_name', 'corr_opinion' ])
        formData.confirm_time = moment(data.confirm_time)
        formData.draft_time = moment(data.draft_time)
        formData.verify_time = moment(data.verify_time)
        formData.check_time = moment(data.check_time)
        console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice () {
      const length = this.detailData.length
     
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

        if (['price_without_tax','tax_rate','num'].includes(column)) {
          target.tax_fee= (target.price_without_tax *target.tax_rate/100).toFixed(2)
          target.price_with_tax=(target.price_without_tax*1+target.tax_fee*1).toFixed(2)
          target.sum_with_tax=(target.price_with_tax*target.num).toFixed(2)
          // this.form.setFieldsValue({
          //   total_amount: newData.reduce((total, d) => {
          //     return total + Number(d.amount)
          //   }, 0)
          // })
        }
        this.detailData = newData
      }
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
      delAttachment({
        filePath: record.file_path,
        fileName: record.file_name,
        id:record.id
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

    // 最终全页面提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('配件 ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk () {
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList
              console.log(values)

              if (that.recording) {
                values.creator_org_id = that.creator_org_id
                values.id= that.recording.id
                // values.remark = that.recording.remark
                values.creator_user_id = that.recording.creator_user_id
                // values.creator_org_name = that.recording.creator_org_name
                values.flag = 2
                values.creator_org_id=that.recording.creator_org_id
                values.status=that.recording.status
                // values.repair_origination=that.recording.repair_origination
                // values.repair_budget=that.recording.repair_budget
                // values.manage_code=that.recording.manage_code
                // values.equipment_name=that.recording.equipment_name
                values.specification = that.recording.specification
                values.confirm_user_id = that.recording.confirm_user_id
                values.draft_user_id = that.recording.draft_user_id
                values.verify_user_id=that.recording.verify_user_id
              } else {
                // 联动参数
                // values.remark = '备注'
                values.confirm_user_id = '113'
                values.creator_user_id = '123'
                values.creator_org_id = '2222'
                values.draft_user_id = '1112'
                values.verify_user_id = '1111'
                // values.creator_org_name = '财务部'
                values.flag = 1
              }
              // 日期格式转换
              values.confirm_time = values.confirm_time.format('YYYY-MM-DD HH:mm:ss')
              values.draft_time = values.draft_time.format('YYYY-MM-DD HH:mm:ss')
              values.verify_time = values.verify_time.format('YYYY-MM-DD HH:mm:ss')
              values.check_time = values.check_time.format('YYYY-MM-DD HH:mm:ss')

               return handlePurchase(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(res => {
                type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)
                console.log(res)
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
          file.id_in_module = file.length
        }
        file.key = file.uid
        file.module = modules.question
        file.file_size = file.size.toString()
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.model = model.question
        return file
      })
      console.log(fileList)
      this.fileList = fileList

    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
 
}
.ant-form-item-label label{
    white-space: wrap; 
    width:100px;

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
#components-form-demo-validate-other .dropbox {
  height: 180px;
  line-height: 1.5;
}
</style>
