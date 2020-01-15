<template>
  <div>
    <!-- 基本信息 -->
    <a-card class="card" title="设备费用扣款基本信息" :bordered="false">
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
                     initialValue: recording.serial_number
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
                    initialValue: nickname(),
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
                style="width: 100%"
                disabled
                v-decorator="[
                  'create_date',
                  { initialValue: date }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="分包商名称"
              v-bind="formItemLayout"
            >
            <a-input
                read-only
                placeholder="请选择分包商"
                v-decorator="[
                  'subcontractor_name',
                   { 
                       rules: [{ required: isrequired, message: '请选择分包商' }]
                   } 
                ]"
                @click="showSubcontractor"
            />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="扣款日期"
              v-bind="formItemLayout"
              style="display: 'inline-block"
            >
                <a-form-item
                    :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
                >
                    <a-date-picker
                        :disabled="isDeductionStartDate"
                        placeholder="开始日期"
                        v-decorator="[
                        'deduction_start_date',
                        { 
                            rules: [{ required: isrequired, message: '请选择开始日期'  }]
                        }               
                        ]"
                        @change="handleChangeDeductionStartDate"
                    />
                </a-form-item>
                <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
                    -
                </span>
                <a-form-item :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }">
                    <a-date-picker
                        placeholder="结束日期"
                        v-decorator="[
                        'deduction_end_date',
                        { 
                            rules: [{ required: isrequired, message: '请选择结束日期'  }]
                        } 
                        ]"
                        @change="handleChangeDeductionEndDate"
                    />
                </a-form-item>

            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 分包商名称 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        class="s-table"
        size="small"
        ref="Mtables"
        rowKey="id"
        bordered
        :columns="Subcontracto_data"
        :data="loadTable"
        :alert="false"
        :customRow="handleCustomRow"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: 'radio'}"
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
            :maxlength="128"
            v-ant-ref="c => searchInput = c"
            :placeholder="`搜索${column.title}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px;"
          >搜索</a-button>
          <a-button
            @click="() => handleReset(clearFilters, column.dataIndex)"
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
        <span slot="supType" slot-scope="text">{{ text }}</span>
       <ellipsis slot="supName" slot-scope="text" :length="40" tooltip>
        {{ text }}
      </ellipsis>
      </s-table>
    </a-modal>

    <!-- 明细 -->
    <a-card
      class="card"
      title="扣款明细"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
        class="line-table"
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text, record"
        >
          <a-input
            :key="col"
            :maxlength="1024"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0;width: 150px"
            :value="text" 
            :placeholder="columns[i].title"    
            @change="e => handleChange(e.target.value, record.key, col)"      
          />
          <a-input-number
            :key="col"
            :value="text"
            :max="col === 'number' ? 999999999 : 999999999.99"
            :min="0"
            :step="col === 'number' ? 1 : 0.01"
            :placeholder="columns[i].title"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
          
        </template>
      </a-table>
    </a-card>
    
    <!-- file upload and approval record-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <div class="attachment" v-if="activeTabKey === 'picture'">
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :withCredentials="true"
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :beforeUpload="beforeUploaddata"
          :data="{ model: mod, type: 0 ,menu_id:66}"
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
import { STable,Ellipsis } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handlePurchase, submitRequire, queryone, getQueryName,querySubcontracto,querySubcontractoEndDate,queryMaterialAndRun,formSupTypeArray,formSupLevelArray } from '@/api/computation/equipFee'
import {uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, formStatus} from'@/api/computation/upload'
import { queryAllContract } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

// const selectData = {
//   'unit': [
//     {
//       dic_enum_name: '台'
//     },
//     {
//       dic_enum_name: '车'
//     },
//     {
//       dic_enum_name: '船'
//     }
//   ],
//   'cost_type': [
//     {
//       dic_enum_name: '设备使用费'
//     },
//     {
//       dic_enum_name: '设备材料费'
//     }
//   ]
// }
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    Ellipsis,
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
        }
      ],
      subcontractor_code:'',
      number: '',
      isrequired: true,
      isDeductionStartDate:true,
      visible_name: false,
      serial_number:'',
      activeTabKey: 'picture',
      fileList: [],
      picList: [],
      sizeSum: 0,
    //   selectData: selectData,
      subcontractorSelectData:{},
      selectedRowKeys: [],
      customFilterColumn: {},
      queryParam: {},
      current: Number,
      currentSize: Number,
      formSupTypeArray: formSupTypeArray,
      formSupLevelArray: formSupLevelArray,
      deduction_start_date1: null,
      deduction_end_date1: null,
      filteredInfo: null,
      selectFields: [],
      inputFields: ['remark'],
      datePickerFields: [],  
      numberFields: ['deduction_amount','price'],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      queryList:[],
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
      columns: [
        {
          title: '序号',
          dataIndex: 'no',
          key: 'no',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '单号',
          dataIndex: 'odd_numbers',
          key: 'odd_numbers',
          width: '130px',
          align: 'center',
          scopedSlots: { customRender: 'odd_numbers' }
        },
        {
          title: '费用类别',
          dataIndex: 'cost_type',
          key: 'cost_type',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'cost_type' }
        },
       
        {
          title: '内容描述',
          dataIndex: 'content_description',
          key: 'content_description',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'content_description' }
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '100px',
            align: 'center',
            scopedSlots: { customRender: 'quantity' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
  
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          key: 'price',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '扣款金额（元）',
          dataIndex: 'deduction_amount',
          key: 'deduction_amount',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'deduction_amount' }
  
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '140px',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      detailFields: ['no', 'odd_numbers', 'cost_type', 'content_description', 'quantity', 'unit', 'price', 'deduction_amount', 'remark'],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'name',
          key: 'attachname'
        },
        {
          title: '附件大小(KB)',
          dataIndex: 'fileSize',
          key: 'fileSize'
        },
        {
          title: '上传人',
          dataIndex: 'upload_user_name',
          key: 'upload_user_name'
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
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

        //调用外部接口，并分页，添加分页参数并赋值，
        parameter.current=parameter.pageNum
        parameter.size=parameter.pageSize
 
        return querySubcontracto(Object.assign(parameter, this.queryParam)).then(res => {
          res.responseObject.data.records = res.responseObject.data.records.map((x, index)=> {
            x.id = index+1
            return x
          })
          // 索引
          this.current = res.responseObject.data.current
          this.currentSize = res.responseObject.data.size
          this.subcontractorSelectData = res

          return (
            res.result || {
              pageSize: res.responseObject.data.size,
              pageNo: res.responseObject.data.current,
              totalPage: res.responseObject.data.pages,
              totalCount: res.responseObject.data.total,
              data: res.responseObject.data.records
            }
          )
        })
      }
    }
  },
  computed: {
    date () {
      return moment()
    },
    uploadUrl () {
      return uploadUrl 
    },
    mod() {
      return modules.equipFee
    },
    formStatus() {
      return formStatus
    },
    getSum () {
      let count = 0
      for (let item of this.detailData) {
        count += item.deduction_amount*1
      }
      this.sumData[0].total_deduction_amount = count.toFixed(2)
      return this.sumData
    },
    fields () {
      const field = {}

      this.Subcontracto_data.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field
    },
    Subcontracto_data () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          dataIndex: 'serial',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },       
        {
          title: '统一社会信用代码',
          dataIndex: 'socialId',
          width: '120px',
          scopedSlots: {
            customRender: 'socialId'
          }
        },
        {
          title: '分包商名称',
          dataIndex: 'supName',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supName'
          }
        },
        {
          title: '分包商状态',
          dataIndex: 'state',
          width: '100px',
          scopedSlots: {
            customRender: 'state'
          }
        },
        {
          title: '法人姓名',
          dataIndex: 'legalPersonName',
          width: '100px',
          scopedSlots: {
            customRender: 'legalPersonName'
          }
        },
        {
          title: '法人身份证号',
          dataIndex: 'legalPersonCode',
          width: '100px',
          scopedSlots: {
            customRender: 'legalPersonCode'
          }
        }
      ]
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/computation/equipFeeList') {
        this.isrequired = true
      }
    }
  },
  mounted () {
    this.$nextTick(() => {     
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    handleCustomRow(record, index) {
      return {
        on: {
          dblclick: () => {
            
            this.form.setFieldsValue({
              subcontractor_name: record.supName
            })  
            this.subcontractor_code = record.socialId         
            
            // let keys = [];
            // keys.push(record.socialId); 
            // this.selectedRowKeys = keys;
            
            // 获取分包商最新核算的结束日期
            querySubcontractoEndDate({
                subcontractor_code: record.socialId,
                creator_org_id:this.$store.state.menu_key
            }).then(res => {
                if (res.responseObject !== null) {
                    this.form.setFieldsValue({
                        deduction_start_date: moment(res.responseObject.deduction_end_date,'YYYY-MM-DD').add(1,'days')
                    })
                } else {
                    this.form.setFieldsValue({
                        deduction_start_date: null,
                        deduction_end_date: null
                    })
                    this.isDeductionStartDate = false
                }
                this.loadEditInfo(res)
            })
            this.visible_name = false
          }
        }
      }
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('equipFeeList')
    },
        // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    //   this.selectData = {}
      this.queryParam = {}
      this.subcontractorSelectData = {}
      this.customFilterColumn = {}
      this.detailData = []
    },

    refresh (bool) {
      this.queryParam = {            
          condition:{
                legalPersonName:"", 
                supName:"",  
                organCode:"0000100002"  
            }
      }

      this.$refs.Mtables.clearSelected()
      this.$refs.Mtables.refresh(bool)
      this.selectedRowKeys = []
      this.selectedRows = []

      for (const key in this.customFilterColumn) {
        if (this.customFilterColumn.hasOwnProperty(key)) {
          this.customFilterColumn[key].clearFilters()
        }
      }

      // 清空了过滤内容
      this.filteredInfo = null
    },

    handleChangeDeductionStartDate (date, dateString) {   
        const { form: { validateFields }} = this
        const that = this
        const deduction_end_date = this.form.getFieldValue('deduction_end_date')
        const subcontractor_name = this.form.getFieldValue('subcontractor_name')
        if(deduction_end_date !== null && deduction_end_date !=='' && deduction_end_date < date){
            that.noSelect(`开始日期不能大于结束日期`)
            setTimeout(()=>{
                this.form.setFieldsValue({
                    deduction_start_date: null
                })
            },50)
        } 

        if (subcontractor_name !== ''  && deduction_end_date !== null && date !== null) {
            // 获取分包商最新核算的结束日期
            queryMaterialAndRun({
                subcontractor_code: this.subcontractor_code,
                startdate: dateString,
                enddate: deduction_end_date.format('YYYY-MM-DD'),
                creator_org_id:this.$store.state.menu_key
            }).then(res => {
                    this.loadEditInfo(res)
            })
        }
    },

    handleChangeDeductionEndDate (date, dateString) {   
      const { form: { validateFields }} = this
      const that = this
      const subcontractor_name = this.form.getFieldValue('subcontractor_name')
      const deduction_start_date = this.form.getFieldValue('deduction_start_date')
      if(subcontractor_name === undefined || subcontractor_name === ''){
            that.noSelect(`请先选择分包商`)
      } else {
        if(deduction_start_date > date){
            that.noSelect(`结束日期不能小于开始日期`)
            setTimeout(()=>{
                this.form.setFieldsValue({
                    deduction_end_date: null
                })
            },50)
        } 
      }


      //根据分包商，开始日期(上次结算结束日期加1)，结束日期获取需要核算的相关设备材料信息
      if (subcontractor_name !== '' && deduction_start_date !== null  && date !== null) {
            queryMaterialAndRun({
                subcontractor_code: this.subcontractor_code,
                startdate: deduction_start_date.format('YYYY-MM-DD'),
                enddate: dateString,
                creator_org_id:this.$store.state.menu_key
            }).then(res => {
                    this.loadEditInfo(res)
            })
      }
    },

    showSubcontractor () {
      this.visible_name = true
      this.queryParam = {            
          condition:{
                legalPersonName:"", 
                supName:"",  
                organCode:"0000100002"  
            }
      }
      this.$refs.Mtables && this.refresh(true)
    },
    handleName (val) {
      this.visible_name = false
      const arr = this.subcontractorSelectData.responseObject.data.records.filter(item => item.id === val[0])
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.form.setFieldsValue({
        subcontractor_name: arr[0].supName
      })  

        this.subcontractor_code = arr[0].socialId

        // 获取分包商最新核算的结束日期
        querySubcontractoEndDate({
            subcontractor_code: arr[0].socialId,
            creator_org_id:this.$store.state.menu_key
        }).then(res => {
            if (res.responseObject !== null) {
                this.form.setFieldsValue({
                    deduction_start_date: moment(res.responseObject.deduction_end_date,'YYYY-MM-DD').add(1,'days')
                })
            } else {
                this.form.setFieldsValue({
                    deduction_start_date: null,
                    deduction_end_date: null
                })
                this.isDeductionStartDate = false
            }

            const deduction_end_date = this.form.getFieldValue('deduction_end_date')
            if (subcontractor_name !== '' && deduction_start_date !== null  && deduction_end_date !== undefined ) {
               this.loadEditInfo(res)
            }
        })
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleGetInfo () {

    },
    handleSearch (selectedKeys, confirm, col) {   
      if (col == 'supName'){
        this.queryParam.condition.supName = selectedKeys[0]
      }  
      if (col == 'legalPersonName'){
        this.queryParam.condition.legalPersonName = selectedKeys[0]
      } 
      confirm()
    },
    handleReset (clearFilters, col) {
      if (col == 'supName'){
        this.queryParam.condition.supName = ''
      }  
      if (col == 'legalPersonName'){
        this.queryParam.condition.legalPersonName = ''
      }  
      clearFilters()
    },
    loadEditInfo (res) {
        this.detailData = []
        const { form } = this     
        this.number = true
        if (res == '') {
            return
        }

        if (res.responseList !== undefined || res.responseObject !== null) {
            this.serial_number=res.responseList.serial_number
            this.detailData = res.responseList.map((d,i) => {
                d.price = d.price
                d.deduction_amount = d.deduction_amount
                d.remark = ''
                d.editable = true
                d.isNew = true
                d.no = i+1
                d.key = i+1
                return d
            })

            if(this.detailData.length > 0){
              this.detailData.push({
                  key: '0',
                  no: '合计',
                  odd_numbers: '',
                  cost_type: '',  
                  content_description: '',
                  quantity: '',
                  unit: '',
                  price: '',
                  deduction_amount: this.data_sum('deduction_amount'),
                  remark: '',
                  editable: false,
                  isNew: true,
              })
            }
        }
    },
    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        if (x.no !== '合计') {
          num += parseInt(x[attr] * 100)
        }
      })
      return (num / 100).toFixed(2)
    },
    handleChange (value, key, column) { 
      const newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        if (['quantity', 'price'].includes(column)) {
          target.deduction_amount= (target.quantity *target.price).toFixed(2)
          if (isNaN(target.deduction_amount)) {
              target.deduction_amount = ''
          } else {
              target.deduction_amount = (target.quantity *target.price).toFixed(2)
          }
        }

        const arr = ['deduction_amount']
        arr.map(x => {
        newData.forEach(d => {
                if (d.no === '合计') {
                    d[x] = this.data_sum(x)
                }
            })
        })
        this.detailData = newData
      }
    },
    // 附件下载
    download(record) {
      downloadAttachment({
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
            
          }
        ],
        type:0,
        menu_id:66
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 附件删除
    removeAttachment(record) {
      const data = {
        filePath: record.file_path,
        fileName: record.file_name,
        type:0,
        menu_id:66
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

    // 最终全页面提交
    saveOrSubmit (type) {
      if (type === 'save') {
        this.isrequired = false
      }
      const { form: { validateFields } } = this
      const that = this
     setTimeout(() => {
        validateFields((err, values) => {
          if (!err) {
            for (let i in values) {
              
              if (values[i] == undefined) delete values[i]
            }
            values.details = that.detailData.map(x => {
              x.deduction_start_date1 && (x.deduction_start_date = x.deduction_start_date.format('YYYY-MM-DD'))
              x.deduction_end_date1 && (x.deduction_end_date = x.deduction_end_date.format('YYYY-MM-DD'))
              return x
            })

            if (type === 'submit') {
                let break1 = false
                let colname = ''
                values.details.map((d, i) => {
                      if (values.details.length-1 !== i) {
                          for (var key in d) {
                              if (key == 'price' && d[key] == '') {
                                    this.$notification['warning']({
                                      message: '提示',
                                      description: `提交时第${i + 1}行：单价不能为空`
                                      })
                                  break1 = true
                                  return
                              }
                          }
                      }                  
                })
                if (break1) return
            }

            values.details = that.detailData.map(x => {
              for (let key in x) {
                if (!x[key] && x[key] !== 0) {
                  delete x[key]
                }
              }
              return x
            })

            values.files = that.fileList.map(x => {
              x.type = 0
              return x
            })
            values.files.push(...that.picList)
            values.files.map(d => {
              delete d.url
              delete d.thumbUrl
              d.thumbUrl = 1
              return d
            })

            // 联动参数
            values.creator_org_id = this.$store.state.menu_key
            values.creator_org_name = this.$store.state.org_name
            values.pro_unit_code =this.$store.state.pro_unit_code
            values.create_date = that.date
            values.flag = 1
            values.subcontractor_code = this.subcontractor_code

            values.menu_id = 66
            if (type === 'submit') {
              if (values.details.length === 0) {
                this.$notification['warning']({
                  message: '提示',
                  description: '提交时扣款明细不能为空'
                })
                return
              }

              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  var btn1 = document.querySelector('.ant-modal-confirm-btns>.ant-btn-default')
                  btn1.style.visibility = 'hidden'
                  that.submitLoading = true

                  return handlePurchase(values, 'submit').then(res => {
                    that.submitLoading = false
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
            } else {
              that.saveLoading = true
              return handlePurchase(values, 'create').then(res => {
                that.saveLoading = false
                if (res.status === '0') {
                  that.$notification['success']({
                    message: '提示',
                    description: res.msg
                  })
                  that.handleGoBack() // 返回列表页
                }
              })
            }
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

    // 文件上传
    fileChange(info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]

      fileList = fileList.map(file => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        file.module = modules.equipFee
        file.file_size = file.size
        file.fileSize = (file.size / 1024).toFixed(0)
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.type = 0

        return file
      })

      this.fileList = fileList
    },

        // 限制上传图片的大小
    beforeUpload(file) {
      this.sizeable = true
      const isPIC = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isPIC) {
        this.$message.error('只能上传jpg/jpeg/png格式的图片!')
        this.sizeable = false
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('单张图片的大小不能超过10M！')
        this.sizeable = false
      }
      this.sumUpliad()
      return isPIC && isLt10M
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
    sumUpliad() {
      this.fileList.map(x => {
        this.sizeSum += x.file_size
        return x
      })
      this.picList.map(x => {
        this.sizeSum += x.file_size
        return x
      })
      const isLt50M = this.sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
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
  .search {
    float: right;
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

/deep/ div.ant-col-8 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-8 > div.ant-row > div.ant-col-sm-6{
    width: 93px;
}
</style>
