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
          <a-col :span="6" >
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
                v-decorator="[
                  'check_time',
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
                  'check_person',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 明细 -->
    <a-card
      class="card"
      title="检查内容"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        class="line-table"
        bordered
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text, record"
        >
          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.value"
              :value="item.value"
            >{{ item.title }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0"
            :step="col === 'number' ? 1 : 1"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-radio-group 
          :key="col"
          v-if="radioFields.includes(col)"
          :value='text'
          @change="e => handleChange(e.target.value, record.key, col)"  
          >
            <a-radio v-for="item in queryLevel" :key="item.dic_enum_id" :value="item.dic_enum_name">{{ item.dic_enum_name }}</a-radio>
          </a-radio-group>
          <template >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.value === text))[0].title : text }}</template>
        </template>
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <!-- <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" /> -->
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="remove(record.key)"
              >
                <a title="删除"><a-icon type="delete" /></a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否要删除此行？"
              @confirm="remove(record.key)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <!-- <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增需求明细</a-button> -->
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
          :data="{model:'001'}"
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
              <a @click="download(record)" title="下载"><a-icon type="cloud-download" /></a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="removeAttachment(record)"
              >
                <a title="删除"><a-icon type="delete" /></a>
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
import { handlePurchase, submitRequire, queryone, getQueryResult} from '@/api/safety/checkResult'
import {uploadUrl,modules,model,getAttachments, downloadAttachment, delAttachment, formStatus} from'@/api/safety/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const selectData = {
  
}
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
      activeTabKey: 'attach',
      fileList: [],
      queryLevel:[],
      selectData: {},
      selectFields: [],
      inputFields: ['abnormal_performance', 'remark'],
      datePickerFields: [],  
      numberFields: [ ],
      radioFields:['result'],
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
      detail_Data: [
          {
            'check_code': '001',
            code: '1',
            check_item: '技检（卸载）人员',
            check_content: '岗前安全培训累计少于24小时',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          },
          {
            'check_code': '002',
            codes: '2',
            check_item: '技检（卸载）人员',
            check_content: '是否持证上岗',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          },
          {
            'check_code': '003',
            code: '3',
            check_item: '维修保养方面',
            check_content: '是否按照公司规定进行定期修理',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          },
          {
            'check_code': '004',
            code: '4',
            check_item: '维修保养方面',
            check_content: '有无日常保养维修记录',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          },
          {
            'check_code': '005',
            code: '5',
            check_item: '走行部分',
            check_content: '检查车轮轮缘垂直磨耗是否超限',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          },
          {
            'check_code': '006',
            code: '6',
            check_item: '制动部分',
            check_content: '检查车轮轮缘垂直磨耗是否超限',
            result: '无异常',
            abnormal_performance: '无异常',
            remark: '备注'
          }, 
      ],
      columns: [
        {
          title: '序号',
          dataIndex:'code',
          key: 'code',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '检查项目',
          dataIndex: 'check_item',
          key: 'check_item',
          align: 'center',
          scopedSlots: { customRender: 'check_item' }
        },
        {
          title: '检查内容',
          dataIndex: 'check_content',
          key: 'check_content',
          align: 'center',
          scopedSlots: { customRender: 'check_content' }
        },
        {
          title: '检查结果',
          key: 'reply',
          align:"center",
          children:[
            {
              title:'有无异常',
              dataIndex:'result',
              key:"result",
              align: 'center',
              scopedSlots: { customRender: 'result' }
              
            },
            {
              title:'异常表现',
              dataIndex:'abnormal_performance',
              key:"abnormal_performance",
              align: 'center',
              scopedSlots: { customRender: 'abnormal_performance' }
            }
          ]
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: ['code','check_item','check_content','result','abnormal_performance','remark'],
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
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',

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
    getQueryResult().then(res => {
      this.queryLevel = res.responseList
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
      // ajax
      console.log(`将加载 ${data.id} 信息到表单`)
      this.detailData = this.detail_Data.map((d,i) =>{
        d.key = i
        d.code = d.code
        d.check_item = d.check_item
        d.check_content = d.check_content
        d.result = d.result
        d.remark = d.remark
        d.editable = true
        d.isNew = true
        return d
      })
      if (data.id) {
        
         queryone({id:data.id}).then(res => {
          console.log(res)
          this.detailData = res.responseObject.detail.map((d,i) => {
            // d.equipment_code ='1111'
            d.estimated_in_date = moment(d.estimated_in_date)
            d.estimated_out_date = moment(d.estimated_out_date)
            d.code=i+1
            d.key =d.id+''
            d.editable = true
            d.isNew = true
            return d
          })
        })
        getAttachments({ module: modules.checkResult, id_in_module: data.id }).then(res => {
          this.fileList = res.responseList.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
        })
        this.detailData = this.detailData.map((item, index) => {
          item.code = index
          return item
        })
        const formData = pick(data, ['equip_name', 'manage_code', 'check_time', 'check_person'])
        formData.check_time = moment(data.check_time)
        console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice () {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        check_item: '',
        check_content: '',
        result: '',
        abnormal_performance: '',
        remark: '',
        editable: true,
        isNew: true,
      });
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

        //   this.form.setFieldsValue({
        //     total_amount: newData.reduce((total, d) => {
        //       return total + Number(d.amount)
        //     }, 0)
        //   })
        // }
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
      console.log(that)
      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('require数据 ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk () {
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList

              if (that.recording) {
                values.creator_org_id = that.creator_org_id
                values.id= that.recording.id
                values.creator_user_id = that.recording.creator_user_id
                values.flag = 2
                values.creator_org_id=that.recording.creator_org_id
                values.status=that.recording.status
              } else {
                // 联动参数
                values.creator_user_id = '123'
                values.creator_org_id='2222'
                values.flag = 1
              }
              // 日期格式转换
              values.check_time = values.check_time.format('YYYY-MM-DD')

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
        file.module = modules.checkResult
        file.file_size = file.size.toString()
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.model = model.checkResult
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
/deep/ .line-table tr td:nth-child(6) {
  font-size: 0 !important;
}
/deep/ .line-table tr td:nth-child(5) {
  font-size: 0 !important;
}
/deep/ .line-table tr td:nth-child(4) {
  font-size: 0 !important;
}
</style>
