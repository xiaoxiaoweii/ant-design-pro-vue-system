<template>
  <div>
    <!-- 基本设备需求计划信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="编制单位"
              v-bind="formItemLayout"
              default-value="0"
            >
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'creator_org_name',
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
            <a-form-item
              label="编制人"
              v-bind="formItemLayout"
            >
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'creator_user_name',
                  {
                     initialValue: nickname(),
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="编制日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                disabled
                v-decorator="[
                  'create_date',
                  { initialValue: date },
                  {
                    rules: [{ required: true, message: '请选择日期' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="主讲人"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="主讲人"
                v-decorator="[
                  'lecturer',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="教育对象"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="教育对象"
                v-decorator="[
                  'target_audience',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="计划课时"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="计划课时"
                v-decorator="[
                  'planned_hour',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="本次课时"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="本次课时"
                v-decorator="[
                  'hour',
                ]"
              />
            </a-form-item>
          </a-col>
           <a-col :span="6">
            <a-form-item
              label="教育人数"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="教育人数"
                v-decorator="[
                  'person_num',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="培训地点"
              v-bind="formItemLayout"
            >
              <a-input
                placeholder="培训地点"
                v-decorator="[
                  'edu_place',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row> 
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item class='label'
              label="教育内容"
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
                  'content',
                  {
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              />
            </a-form-item>
            
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item
              label="培训影像资料"
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
                placeholder="请输入培训教育影像资料"
                v-decorator="[
                  'edu_movie',
                  {
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              />
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
import { getDeviceList, handlePurchase, submitRequire,queryone} from '@/api/safety/person'
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
        {
          key: 'approval',
          tab: '审批记录'
        }
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
        getAttachments({id_in_module: data.id, module:modules.person}).then(res => {
          console.log(res)
          this.fileList = res.responseList.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.size = attachment.file_size.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
        })
        const formData = pick(data, [ 'edu_movie','planned_hour','creator_org_name','creator_user_name','create_date','target_audience','hour','edu_place','lecturer', 'person_num','content','feedback','edu_movie'])
        formData.create_date = moment(data.create_date)
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
                values.specification=that.recording.specification
                // values.tech_status=that.recording.tech_status
                // values.fix_item=that.recording.fix_item
              } else {
                // 联动参数
                // values.remark = '备注'
                values.creator_user_id = '123'
                values.creator_org_id='2222'
                // values.creator_org_name = '财务部'
                values.flag = 1
              }
              // 日期格式转换
              values.create_date = values.create_date.format('YYYY-MM-DD')

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
        file.module = modules.person
        file.file_size = file.size.toString()
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.model = model.person
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
</style>
