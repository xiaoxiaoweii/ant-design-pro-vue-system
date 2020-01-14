<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card class="card" title="设备盘点单-编辑" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  {
                     initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                'pro_unit',
                  {
                    initialValue: $store.state.pro_unit
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'creator_user_name',
                    {
                      initialValue: nickname()
                    }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'create_date',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="盘点开始日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'start_date',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="盘点结束日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'end_date',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    
   

    <!-- 盘点单明细 -->
    <a-card title="盘点单明细">
      <a-table
        :columns="detailColumns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
        :scroll="{ x: 1220 }"
        bordered
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            maxlengh="128"
            :placeholder="columnTitle[i]"
            v-if="inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.order_number, col)"
          />
          <a-select
            :key="col"
            v-else-if="selectFields.includes(col)"
            :defaultValue="record[col]"
            style="margin: -5px 0"
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.order_number, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key=" item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :showTime="{ format: 'HH:mm' }" 
            :key="col"
            :value="text"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="columnTitle[i]"
            v-else-if="datePickerFields.includes(col)"
            @change="value => handleChange(value, record.order_number, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0.00"
            :step="0.01"
            :placeholder="columnTitle[i]"
            v-else-if="numberFields.includes(col)"
            @change="value => handleChange(value, record.order_number, col)"
          />
          <template
            v-else
          >{{selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span v-if="record.isNew">
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.order_number)">
              <a>
                <a-icon type="delete" />
              </a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </a-card>


    <!-- 附件上传-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :action="uploadUrl"
          :multiple="true"
          :withCredentials="true"
          :showUploadList="false"
          :fileList="fileList"
          :beforeUpload="beforeUploaddata"
          @change="fileChange"
          :data="{model:'020', type: 0, menu_id:45 }"
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
        @click="saveOrSubmit('update')"
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
import * as $ from 'jquery'
if (!window.jQuery) {
  window.jQuery = $
}
import moment from 'moment'
import pick from 'lodash.pick'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import {handleInventory,queryOne,queryledger,selectCondInfo} from '@/api/onsite/inventory'
import { model, queryByCategory,querySingle } from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules,
queryProjectName } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
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
      scope_code: this.$store.state.menu_key,
      params:{},
      dataFrom:{},
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
      queryParam: {},
      tableData: {},
      selectedRowKeys: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      isrequired: true,
      visible: false,
      visible_name: false,
      number: '',
      col: '',
      activeTabKey: 'attach',
      fileList: [],
      newArr:[],
      selectData: {
        'asset': [
          {
            dic_enum_name: '有',
            dic_enum_id: 1
          },
          {
            dic_enum_name: '无',
            dic_enum_id: 2
          }
        ],
        technical_condition:[], //技术状况
      },
      selectFields: [
        'technical_condition', //技术状况'
        'asset', //是否分包商合同内
      ],
      inputFields: [ 
        'site_name',
        'remark',
      ],
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
      columnsTable: true,       
      detailData: [],
      detailColumns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          key: 'manage_code',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'manage_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          key: 'equip_name',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '型号',
          dataIndex: 'spec',
          key: 'spec',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '技术状况',
          dataIndex: 'technical_condition',
          key: 'technical_condition',
          width: '130px',
          align: 'center',
          scopedSlots: { customRender: 'technical_condition' }
        },
        {
          title: '所在地点',
          dataIndex: 'site_name',
          key: 'site_name',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'site_name' }
        },
        {
          title: '资产有无',
          dataIndex: 'asset',
          key: 'asset',
          width: '40px',
          align: 'center',
          scopedSlots: { customRender: 'asset' }
        },
        {
          title: '图片',
          dataIndex: 'img',
          align: 'center',
          customRender: () => (<img src="http://www.crcc.cn/images/79/logo.png" style="width: 200px" />)
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '130px',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
      ],      
      columnTitle: [
        '技术状况',
        '所在地点',
        '资产有无',
        '备注',
      ],
      detailFields: [
        'technical_condition', 
        'site_name',
        'asset', 
        'remark',
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
          dataIndex: 'user_name',
          key: 'user_name'
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
          title: '审批人岗位',
          dataIndex: 'user_position_name',
          key: 'user_position_name'
        },
        {
          title: '审批时间',
          dataIndex: 'approval_time',
          key: 'approval_time'
        }
      ],
      errors: [],
      // 索引
      current: Number,
      currentSize: Number,
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
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if(this.$route.params.type === 2){
        if (from.path === '/onsite/inventoryList') {
          this.queryDictionary()
          this.isrequired = true
          this.params=this.$route.params.selectedRows
          this.loadEditInfo(this.params)
        }
      }
    },
  },
  mounted () {
    this.queryDictionary()
    this.$nextTick(() => {
      if(this.$route.params.type === 2){
        this.params=this.$route.params.selectedRows
        this.loadEditInfo(this.params)
      }
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    //将数据加载到数据表
    loadEditInfo (data) {
      const { form } = this
      let that=this
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        queryOne({id:data.id,menu_id:45}).then(res => {
          that.dataFrom=res.responseObject
          const formData = pick(that.dataFrom, 
          [
            'serial_number',//单据编号
            // 'pro_unit',//编制单位
            // 'creator_user_name',//编制人
            'create_date',//编制日期
            'start_date',//盘点开始日期
            'end_date',//盘点结束日期
            'remark',//备注
          ])
          formData.create_date = moment((that.dataFrom.create_date == null ? {} : that.dataFrom.create_date))
          formData.end_date = moment((that.dataFrom.end_date == null ? {} : that.dataFrom.end_date))
          formData.start_date = moment((that.dataFrom.start_date == null ? {} : that.dataFrom.start_date))
          form.setFieldsValue(formData)
          if(res.responseObject.files){
            that.fileList=res.responseObject.files.map(file=>{
              file['key']=file.id
              return file
            })
          }
          if(res.responseObject.details){
            let detailData=res.responseObject.details
            detailData.map((item,index)=>{
              item['order_number']=index+1
            })
            that.detailData=detailData
          }
        })   
      }
    },
    queryDictionary(){
      let that=this
      let dicObj={
            'technical_condition':1029, //设备来源
          }
      Object.getOwnPropertyNames(dicObj).forEach(key=>{
        querySingle({dic_type_id:dicObj[key]}).then(res=>{
          that.selectData[key]=res.responseList
        })
      })
    },
    handleName (val) {
      this.visible_name = false
      if(this.columnsTable){
        const arr = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
        this.selectedRowKeys = []
        this.selectedRows = []
        if (!arr.length) return
        if (val.length > 1) return this.noSelect()
        this.form.setFieldsValue({
          manage_code: arr[0].manage_code,
          name: arr[0].equip_name,
          spec: arr[0].specification,
          dispatch_org_name: arr[0].accept_from||"",
        })
      }else{
        const arr = this.fenbaoData.responseObject.data.records.filter(item => item.id === val[0])
        this.selectedRowKeys = []
        this.selectedRows = []
        if (!arr.length) return
        if (val.length > 1) return this.noSelect()
        this.form.setFieldsValue({
          use_org_name: arr[0].supName,
        })
        this.supplier_code=arr[0].socialId
      }
    },
    handleProjectName(val){
      this.project_name = false
    },
    handleChange (value, order_number, column) { //新增工作明细内容更改
      let that=this 
      this.detailData.map(item=>{
        if(order_number === item.order_number){
          item[column] = value
        }
      })
    },
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    setFilterColumnScope (data) {
      // const { column } = data
      // this.customFilterColumn[column.dataIndex] = data
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('inventoryList')
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
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
    },
    handleNameReset (clearFilters, col) {
      clearFilters()
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    //明细操作
    remove(order_number) {
      const newData = this.detailData.filter(item => item.order_number !== order_number)
      this.detailData = newData.map((item,index)=>{
         item['order_number']=index+1
         return item
      })
    },
    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:45,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name,
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
        type: 0,
        menu_id:45
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
      if (type === 'update') {
        this.isrequired = false
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.details = that.detailData
          if(type==='submit'){
            let colname=''
            let break1=false
            values.details.map((d,i)=>{
              for(var key in d){
                if(that.detailFields.includes(key)&&(d[key]==null||d[key]=='')&&key!='remark'){
                  that.detailColumns.map((item)=>{
                    if(item.dataIndex==key){
                      colname=item.title
                    }
                  })
                  that.$notification['warning']({
                    message:"提示",
                    description:`提交时第${i+1}行：${colname}不能为空`
                  })
                  break1=true
                  return 
                }
              }
            })
            if(break1) return
          }
          values.details = values.details.map(x => {
            for (let key in x) {
              const isTrue = x[key] === '' || x[key] === undefined || x === null
              if (isTrue) {
                delete x[key]
              }
            }
            return x
          })
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          values.creator_org_id = that.$store.state.menu_key //右上角编号
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code //编制单位编号
          values.supplier_code=that.supplier_code
          values.menu_id = 45 
          if(type === 'submit'){
            values.flag=1
          }
          values.equip_code=this.equip_code
          values.id=this.params.id
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))
          values.use_date = (values.use_date == undefined ? null : values.use_date.format('YYYY-MM-DD'))

          for (let key in values) {
            const isTrue = values[key] === '' || values[key] == undefined || values == null
            if (isTrue) {
              delete values[key]
            }
          }
          if (!err) {
            if (type === 'submit') {
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  that.submitLoading = true
                  return handleInventory(values, 'submit').then(res => {
                    that.submitLoading = false
                    if (res.status === '0') {
                      that.$notification['success']({
                        message: '提示',
                        description: res.msg
                      })
                      that.handleGoBack() // 返回列表页
                    }
                  }).finally(() => {
                    that.submitLoading = false
                  })
                },

                onCancel () { }
              })
            }
          }
          if (type === 'update') {
            that.saveLoading = true
            return handleInventory(values, 'update').then(res => {
              that.saveLoading = false
              if (res.status === '0') {
                that.$notification['success']({
                  message: '提示',
                  description: res.msg
                })
                that.handleGoBack() // 返回列表页
              }
            }).finally(() => {
              that.submitLoading = false
            })
          }
        })
      }, 100)
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 限制上传附件的大小
    beforeUploaddata(file) {
      this.sizeable = true
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('单个文件的大小不能超过10M！')
        this.sizeable = false
      }
      this.sumUpliad()
      return isLt10M
    },

    // 限制单次提交的总文件大小
    sumUpliad () {
      this.sizeSum=0
      this.fileList.map(x => {
        this.sizeSum += parseInt(x.file_size)
        return x
      })
      const isLt50M = this.sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
    },

    // 文件上传
    fileChange (info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        if(file.name){
          file.file_name = file.name
        }
        file.module = '020'
        if(file.size){
          file.file_size=file.size
        }
        file.fileSize = (file.file_size / 1024).toFixed(0)
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
// /deep/ .ant-form-item .ant-calendar-picker-input {
//   width: 278px;
// }
/deep/ .ant-table-body .ant-select-selection--single {
  width: 130px;
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
