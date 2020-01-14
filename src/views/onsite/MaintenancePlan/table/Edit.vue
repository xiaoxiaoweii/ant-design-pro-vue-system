<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card class="card" title="设备维修保养计划-编辑" :bordered="false">
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
                    initialValue: ''
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
                      initialValue: ''
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
        </a-row>
      </a-form>
    </a-card>

    <!-- 选择设备名称 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        size="small"
        ref="Mtables"
        rowKey="id"
        bordered
        :columns="equip_data"
        :data="loadTable"
        :alert="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
      >
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          class="custom-filter-dropdown"
        >
          <!-- 获取自定义栏位相关作用域属性 -->
          {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
          <a-input
            ref="input"
            v-ant-ref="c => searchInput = c"
            :placeholder="`${column.title}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleNameSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
          >查询</a-button>
          <a-button
            @click="() => handleNameReset(clearFilters, column.dataIndex)"
            size="small"
            style="width: 90px"
          >重置</a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <span
          slot="serial"
          slot-scope="text, record, index"
        >{{ index + 1 + (current - 1) * currentSize }}</span>
        <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
      </s-table>
    </a-modal>

    <!-- 选择工程名称 -->
   

    <!-- 工作地点及工作内容 -->
    <a-card title="工作地点及工作内容">
      <a-table
        :columns="detailColumns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
        :scroll="{ x: 2220 }"
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
            @click="e => onClick(e.target.value, record.order_number, col)"
          />
          <a-date-picker
            :key="col"
            :value="text"
            format="YYYY-MM-DD"
            :placeholder="columnTitle[i]"
            v-else-if="datePickerFields.includes(col)"
            @change="value => handleChange(value, record.order_number, col)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.order_number)">
              <a>
                <a-icon type="delete" />
              </a>
            </a-popconfirm>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增工作内容</a-button>
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
          :data="{model:'020', type: 0, menu_id:46 }"
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
        <a-table 
            :columns="approvalColumns" 
            :dataSource="[]" 
            :pagination="false" 
          />
        <br />
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
import {handleOperation,queryOne} from '@/api/onsite/maintenancePlan'
import { model, queryByCategory,selectLedger } from '@/api/onsite/upload'
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
      detailKey:'',//控制新增工作操作序号
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

      inputFields: [ 
        'manage_code', 
        'equip_name',
        'spec',
        'maintenance_content',
        'principal',
        'remark',
      ],
      datePickerFields:[ //
        'maintain_time',
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
      detailData: [],
      detailColumns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          key: 'manage_code',
          align: 'center',
          scopedSlots: { customRender: 'manage_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          key: 'equip_name',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '计划保养日期',
          dataIndex: 'maintain_time',
          key: 'maintain_time',
          align: 'center',
          scopedSlots: { customRender: 'maintain_time' }
        },
        {
          title: '维修保养内容',
          dataIndex: 'maintenance_content',
          key: 'maintenance_content',
          align: 'center',
          scopedSlots: { customRender: 'maintenance_content' }
        },
        {
          title: '负责人',
          dataIndex: 'principal',
          key: 'principal',
          align: 'center',
          scopedSlots: { customRender: 'principal' }
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
      columnTitle: [
        '管理号码',
        '设备名称',
        '规格型号',
        '计划保养日期',
        '维修保养内容',
        '负责人',
        '备注',
      ],
      detailFields: [
        'manage_code', 
        'equip_name', 
        'spec',
        'maintain_time', 
        'maintenance_content', 
        'principal', 
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
      loadTable: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return selectLedger({ creator_org_id:this.$store.state.menu_key||0,pageNum: 1, pageSize: 13 }).then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          this.EquipData = res

            return (
              res.result || {
                pageSize: res.responsePageInfo.pageSize,
                pageNo: res.responsePageInfo.pageNum,
                totalPage: res.responsePageInfo.pages,
                totalCount: res.responsePageInfo.total,
                data: res.responsePageInfo.list
              }
            )
          })
      },
      // 索引
      current: Number,
      currentSize: Number,
    }
  },
  computed: {
    equip_data () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_name'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specification'
          },
          onFilter: (value, record) => record.specification.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '出机单位',
          dataIndex: 'accept_from',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'accept_from'
          },
          onFilter: (value, record) => record.accept_from.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
      ]
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
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if(this.$route.params.type === 2){
        if (from.path === '/onsite/maintenancePlanList') {
          this.isrequired = true
          this.params=this.$route.params.selectedRows
          this.loadEditInfo(this.params)
        }
      }
    },
    unit(newValue){ //对新增明细进行监听
      this.detailData.map(item=>item['unit']=newValue)
    }
  },
  mounted () {
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
        queryOne({id:data.id,menu_id:46}).then(res => {
          that.dataFrom=res.responseObject
          const formData = pick(that.dataFrom, 
          [
            'serial_number',//单据编号
            'pro_unit',//编制单位
            'creator_user_name',//编制人
            'create_date',//编制日期
          ])
          formData.create_date = moment((that.dataFrom.create_date == null ? {} : that.dataFrom.create_date))
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
              if(item['maintain_time']){
                item['maintain_time']=moment(item['maintain_time'])
              }
            })
            that.detailData=detailData
          }
        })   
      }
    },
    newDevice () {//新增工作内容
      const length = this.detailData.length
      //判断是否连续增加空白明细
      if(length>0){
        let flag=false
        let item=this.detailData[length-1]
        if(item['manage_code']&&item['manage_code']!=null&&item['manage_code'].trim()!=''){
          flag=true
        }
        if(item['maintain_time']&&item['maintain_time']!=null){
          flag=true
        }
        if(item['maintenance_content']&&item['maintenance_content']!=null&&item['maintenance_content'].trim()!=''){
          flag=true
        }
         if(item['principal']&&item['principal']!=null&&item['principal'].trim()!=''){
          flag=true
        }
        if(!flag){
          return this.noSelect('不能连续新增空白明细')
        }
      }
      this.detailData.push({
        manage_code: '',
        equip_name:'',
        spec:'',
        maintain_time:null,
        maintenance_content:'',
        principal:'',
        remark:'',
      })
      this.detailData=this.detailData.map((item,index)=>{
        item['order_number']=index+1
        return item
      })
    },
    handleChange (value, order_number, column) {
      this.detailData.map(item=>{
        if(order_number === item.order_number){
          item[column] = value
        }
      })
    },
    showTable () {
      this.visible_name = true
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    handleName (val) {
      this.visible_name = false
      const arr = this.EquipData.responsePageInfo.list.filter(item =>item.id === val[0])
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()

      this.detailData.map(item=>{
        if(item['order_number']==this.detailKey){
          item['manage_code']=arr[0].manage_code
          item['equip_name']=arr[0].equip_name
          item['spec']=arr[0].specification
        }
      })
    },
    onClick (value, key, column) { //点击单位工程名称
      if(column=="manage_code"){ //拉起管理号码
        this.showTable()
      }
      this.detailKey=key
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
      this.$router.push('maintenancePlanList')
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
        menu_id:46,
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
        menu_id:46
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

          values.id=this.params.id
          values.menu_id = 46 
          values.flag=2
      
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))
          values.item_check_date = (values.item_check_date == undefined ? null : values.item_check_date.format('YYYY-MM-DD'))

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
                  return handleOperation(values, 'submit').then(res => {
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
            return handleOperation(values, 'update').then(res => {
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
