<template>
  <div>
    <!-- 水电抄表记录单-新增 -->
    <a-card class="card" title="水电抄表记录单-新增" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
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
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="结算费用类型" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'fee_name',
                  {
                    rules: [{ required: isrequired, message: '请选择结算费用类型' }]
                  }
                ]"
                @change="selectFeeName"
              >
                <a-select-option value="电费">电费</a-select-option>
                <a-select-option value="水费">水费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>    
      </a-form>
    </a-card>
    
     <!-- 水电抄表 -->
    <a-card title="水电抄表">
      <a-table
        :columns="fee_name=='电费'?detailColumns:detailColumnsWater"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"      
        :scroll="{ x: 1220 }"
        bordered
      > 
        <a-table
          slot="expandedRowRender"
          slot-scope="record, index"
          v-if="detailData[index].details1"
          :columns="fee_name=='电费'?columnsSon:columnsSonWater"
          :dataSource="detailData[index].details1||[]"
          :pagination="false"
          bordered
        >
            <template v-for="(col, i) in detailFieldsSon" :slot="col" slot-scope="text, record">
            <a-input-number
            :key="col"
            :value="text"
            :min="record['previous_num']"
            step="0.0001"
            :placeholder="columnTitleSon[i]"
            v-if="numberFieldsSon.includes(col)"
            @change="value => handleChange(value, record, col)"
          />
          </template>
        </a-table>

        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input-number
            :key="col"
            :value="text"
            :min="record['previous_num']"
            step="0.0001"
            :placeholder="columnTitle[i]"
            v-if="numberFields.includes(col)"
            @change="value => handleChange(value, record, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0.00"
            :step="0.01"
            :placeholder="columnTitle[i]"
            v-if="number2Fields.includes(col)"
            @change="value => handleChange(value, record, col)"
          />
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
          @change="fileChange"
          :beforeUpload="beforeUploaddata"
          :data="{model:'020', type: 0, menu_id:40 }"
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
import * as $ from 'jquery'
if (!window.jQuery) {
  window.jQuery = $
}
import moment from 'moment'
import pick from 'lodash.pick'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import {handleHydroelectric,wattMeterOrElectricity,queryOne} from '@/api/onsite/hydroelectric'
import { model, queryByCategory } from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules,
queryProjectName } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
export default {
  name: 'TableNew',
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
      fee_name:"",
      queryParam: {},
      tableData: {},
      selectedRowKeys: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      isrequired: true,
      visible: false,
      visible_name: false,
      col: '',
      activeTabKey: 'attach',
      fileList: [],
      newArr:[],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
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
      detailData: [],
      columnTitle: [
        '本期读数',
        '线损',
        '变损',
      ],
      detailFields: [
        'current_num',
        'line_loss',
        'varialoss', 
      ],
      numberFields: [ 
        'current_num',
      ],
      number2Fields: [ 
        'line_loss', 
        'varialoss',
      ],
      numberFieldsSon: [ 
        'current_num', 
      ],
      columnTitleSon: [
        '本期读数',
      ],
      detailFieldsSon: [
        'current_num',
      ],
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
          title: '唯一标识',
          dataIndex: 'unique_number',
          key: 'unique_number',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'unique_number' }
        }, 
        {
          title: '变压器编号',
          dataIndex: 'switch_box',
          key: 'switch_box',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'switch_box' }
        },    
        {
          title: '电表数量',
          dataIndex: 'num',
          key: 'num',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },   
        {
          title: '上期读数',
          dataIndex: 'previous_num',
          key: 'previous_num',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'previous_num' }
        },
        {
          title: '本期读数',
          dataIndex: 'current_num',
          key: 'current_num',
          width: '300px',
          align: 'center',
          scopedSlots: { customRender: 'current_num' }
        },
        {
          title: '倍率',
          dataIndex: 'multiply',
          key: 'multiply',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'multiply' }
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        },      
        {
          title: '线损(%)',
          dataIndex: 'line_loss',
          key: 'line_loss',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'line_loss' }
        },
        {
          title: '变损(%)',
          dataIndex: 'varialoss',
          key: 'varialoss',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'varialoss' }
        },
      ],    
      detailColumnsWater: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '唯一标识',
          dataIndex: 'unique_number',
          key: 'unique_number',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'unique_number' }
        }, 
        {
          title: '水泵编号',
          dataIndex: 'switch_box',
          key: 'switch_box',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'switch_box' }
        },
        {
          title: '上期读数',
          dataIndex: 'previous_num',
          key: 'previous_num',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'previous_num' }
        },
        {
          title: '本期读数',
          dataIndex: 'current_num',
          key: 'current_num',
          width: '220px',
          align: 'center',
          scopedSlots: { customRender: 'current_num' }
        },
        {
          title: '水表数量',
          dataIndex: 'num',
          key: 'num',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },      
      ], 
      columnsSon: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '唯一标识',
          dataIndex: 'unique_number',
          key: 'unique_number',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'unique_number' }
        }, 
        {
          title: '计量表编号',
          dataIndex: 'meter_no',
          key: 'meter_no',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'meter_no'}
        },
        {
          title: '分包商',
          dataIndex: 'fenbao_name',
          width: '180px',
          key: 'fenbao_name',
          align: 'center',
          scopedSlots: { customRender: 'fenbao_name'}
        },
        {
          title: '上期读数',
          dataIndex: 'previous_num',
          width: '180px',
          key: 'previous_num',
          align: 'center',
          scopedSlots: { customRender: 'previous_num'}
        },
        {
          title: '本期读数',
          dataIndex: 'current_num',
          width: '220px',
          key: 'current_num',
          align: 'center',
          scopedSlots: { customRender: 'current_num'}
        },
        {
          title: '倍率',
          dataIndex: 'multiply',
          key: 'multiply',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'multiply' }
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'number' }
        },
      ], 
      columnsSonWater: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '唯一标识',
          dataIndex: 'unique_number',
          key: 'unique_number',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'unique_number' }
        }, 
        {
          title: '计量表编号',
          dataIndex: 'meter_no',
          key: 'meter_no',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'meter_no'}
        },
        {
          title: '分包商',
          dataIndex: 'fenbao_name',
          width: '180px',
          key: 'fenbao_name',
          align: 'center',
          scopedSlots: { customRender: 'fenbao_name'}
        },
        {
          title: '上期读数',
          dataIndex: 'previous_num',
          width: '180px',
          key: 'previous_num',
          align: 'center',
          scopedSlots: { customRender: 'previous_num'}
        },
        {
          title: '本期读数',
          dataIndex: 'current_num',
          width: '220px',
          key: 'current_num',
          align: 'center',
          scopedSlots: { customRender: 'current_num'}
        },
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
      if (from.path === '/onsite/hydroelectricList') {
        this.isrequired = true
        //this.loadInfo()
      }
    },
  },

  methods: {
    ...mapGetters(['nickname']),
    selectFeeName(value){ //选择电费水费就行选取数据
      let that=this
      this.fee_name=value
      return wattMeterOrElectricity({creator_org_id:that.$store.state.menu_key
                ,fee_name:value,pageNum:1,pageSize:13,}).then(res => {
        that.detailData=res.responsePageInfo.list.map((item,index)=>{
          item['order_number']=index+1
          if(!item['previous_num']){
            item['previous_num']=0
          }else{
            item['previous_num']=parseFloat(item['previous_num'])
          }
          item['current_num']=''
          item['line_loss']=''
          item['varialoss']=''
          if(item['num']){
            item['switch_box']=item['num']
            delete item['num']
          }
          if(item['multiplying_power']){
            item['multiply']=item['multiplying_power']
            delete item['multiplying_power']
          }
          if(item['electric_meter_number']){
            item['num']=item['electric_meter_number']
            delete item['electric_meter_number']
          }
          if(item['water_meter_number']){
            item['num']=item['water_meter_number']
            delete item['water_meter_number']
          }
          if(item['details1']){
            item['details1']=item['details1'].map((child,index2)=>{
              child['order_number']=index2+1
              child['current_num']=''
              if(item['use_site']){
                child['project_name']=child['use_site']
                delete child['use_site']
              }
              if(child['multiplying_power']){
                child['multiply']=child['multiplying_power']
                delete child['multiplying_power']
              }
              if(!child['previous_num']){
                child['previous_num']=0
	            }else{
                child['previous_num']=parseFloat(child['previous_num'])
              }
              if(child['num']){
              child['meter_no']=child['num']
                delete child['num']
              }
              if(child['use_org']){
                child['fenbao_name']=child['use_org']
                delete child['use_org']
              }
              if(child['use_org_code']){
                child['fenbao_code']=child['use_org_code']
                delete child['use_org_code']
              }
              return child
            })
          }
          return item
        })
      })
    },
    showTable () {
      this.visible_name = true
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    handleChange (value, record, column) { //新增工作明细内容更改
      let that=this
      let id=record['id']
      let code=record['code']
      let parentId=record['parentId']
      if(['line_loss','varialoss'].includes(column)&&value>=0&&value<=100){
        that.detailData = that.detailData.map(item=>{
          if(item.id==id){
            item[column]=value
          }
          return item
        })
      }else if(column=='current_num' &&!isNaN(value)){
        that.detailData = that.detailData.map(item=>{
          //电表本期读数
          if(item.code==parentId){
            item.details1=item.details1.map(child=>{
              if(child.id==id){
                child['current_num']=value
                child['number']=Math.round((value*10000-child['previous_num']*10000)*child['multiply'])/10000
              }
              return child
            })
          }else if(item.id==id){
            item['current_num']=value
            item['number']=Math.round((value*10000-item['previous_num']*10000)*item['multiply'])/10000
          }
          return item
        })
      }
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
      this.$router.push('hydroelectricList')
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

    //明细操作
    remove(key) {
      const newData = this.detailData.filter(item => item.key !== key)
      this.detailData = newData
    },
    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:40,
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
        menu_id:40
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
      if (type === 'save') {
        this.isrequired = false
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.details=that.detailData

          let columns=this.fee_name=='电费'?this.detailColumns:this.detailColumnsWater
          let detailF=this.fee_name=='电费'?this.detailFields:['current_num']
          let colname=''
          let break1=false
          values.details.map((d,i)=>{
            for(var key in d){
              if(detailF.includes(key)&&(d[key]==null||d[key]=='')){
                columns.map((item)=>{
                  if(item.dataIndex==key){
                    colname=item.title
                  }
                })
                that.$notification['warning']({
                  message:"提示",
                  description:`提交时第${d.order_number}行：${colname}不能为空`
                })
                break1=true
                return 
              }else if(!break1&&d['details1']){
                d['details1'].map(child=>{
                  if(child.current_num==null||child.current_num==''){
                    colname='本期读数'
                    that.$notification['warning']({
                      message:"提示",
                      description:`提交时第${d.order_number}行下第第${child.order_number}行：${colname}不能为空`
                    })
                    break1=true
                    return
                  }
                })
              }
              if(break1){
                return
              }
            }
          })

          if(break1) return
          
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code
          values.menu_id = 40 
          values.flag=1
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))

          for (let key in values) {
            const isTrue = values[key] === '' || values[key] == undefined || values == null
            if (isTrue) {
              delete values[key]
            }
          }
          values.details.map(item=>{
            if(item['line_loss']==''){
               item['line_loss']=0
            }
            if(item['varialoss']==''){
               item['varialoss']=0
            }
            if(item['current_num']==''){
               item['current_num']=0
            }
            if(item['details1']){
              item['details1'].map(child=>{
                if(child['current_num']==''){
                  child['current_num']=0
                }
              })
            }
            return item
          })

          if (!err) {
            if (type === 'submit') {
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  that.submitLoading = true
                  return handleHydroelectric(values, 'submit').then(res => {
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
          if (type === 'save') {
            that.saveLoading = true
            return handleHydroelectric(values, 'save').then(res => {
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
