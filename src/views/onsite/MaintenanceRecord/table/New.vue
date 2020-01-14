<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card class="card" title="设备维修保养记录-新增" :bordered="false">
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
            <a-form-item label="维修类型" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'maintenance_type',
                  {
                    rules: [{ required: isrequired, message: '请选择维修类型' }]
                  }
                ]"
              >
                <a-select-option 
                  v-for="item in selectData['maintenance_type']" 
                  :key="item.dic_enum_name">{{item.dic_enum_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理号码" v-bind="formItemLayout">
              <a-input
                placeholder="选择管理号码"
                v-decorator="[
                  'manage_code',
                    {
                      rules: [{ required: isrequired, message: '选择管理号码' }]
                    }
                ]"
                @click="showTable(true)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备名称" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动带入"
                v-decorator="[
                  'equip_name',
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
            <a-form-item label="规格型号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动带入"
                v-decorator="[
                  'spec',
                    {
                      initialValue: ''
                    }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="维修方式" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'maintenance_way',
                  {
                    rules: [{ required: isrequired, message: '请选择维修方式' }]
                  }
                ]"
                @change="value => handleChange(value,'maintenance_way')"
              >
                <a-select-option 
                  v-for="item in selectData['maintenance_way']" 
                  :key="item.dic_enum_name">{{item.dic_enum_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="维护级别" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'level',
                  {
                    rules: [{ required: isrequired, message: '请选择维护级别' }]
                  }
                ]"
              >
                <a-select-option 
                  v-for="item in selectData['level']" 
                  :key="item.dic_enum_name">{{item.dic_enum_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">

          <a-col :span="8">
            <a-form-item label="上次维修时间/里程" v-bind="formItemLayout">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'last_maintain_date',
                    {
                      rules: [{ required: isrequired, message: '请输入时间/里程' }]
                    }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="税率" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'tax_rate',
                  {
                    rules: [{ required: isrequired, message: '请选择税率' }]
                  }
                ]"
                @change="value => handleChange(value,'tax_rate')"
              >
                <a-select-option 
                  v-for="item in selectData['tax_rate']" 
                  :key="item.dic_enum_name">{{item.dic_enum_name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="不含税单价" v-bind="formItemLayout">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'tax_fee_maintenance_costs',
                    {
                      rules: [{ required: isrequired, message: '请输入不含税单价' }]
                    }
                ]"
                @change="e => handleChange(e.target.value, 'tax_fee_maintenance_costs')"
              />
            </a-form-item>
          </a-col>
          
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="税额(单)" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动计算"
                v-decorator="[
                  'tax_fee',
                    {
                      initialValue: ''
                    }
                ]"
              />
            </a-form-item>
          </a-col>  
          <a-col :span="8">
            <a-form-item label="含税单价" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动计算"
                v-decorator="[
                  'tax_included_maintenance_costs',
                ]"
              />
            </a-form-item>
          </a-col>   
          <a-col :span="8">
            <a-form-item label="参加保养人员" v-bind="formItemLayout">
              <a-input
                placeholder="请输入"
                v-decorator="[
                  'people',
                    {
                      rules: [{ required: isrequired, message: '请输入维保人员' }]
                    }
                ]"
              />
            </a-form-item>
          </a-col>  
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8" v-show="maintenanceWay=='外修'">
            <a-form-item label="合同号" v-bind="formItemLayout">
              <a-input
              placeholder="请选择"
              v-decorator="[
                'contract_no',
                {
                  rules: [{ required: maintenanceWay=='外修'?isrequired:!isrequired, message: '请选择合同号' }]
                }
              ]"
              @click="showTable(false)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="maintenanceWay=='外修'">
            <a-form-item label="供应商名称" v-bind="formItemLayout">
              <a-input
              disabled
              placeholder="自动带入"
              v-decorator="[
                'dispatch_org',
                {
                  initialValue: ''
                }
              ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="维修保养工作内容"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 3 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 21 }
              }"
            >
              <a-textarea
                placeholder="请输入备注, 10000字以内"
                v-decorator="[
                  'content',
                  {
                    rules: [{ required: isrequired,max: 10000, message: '10000字以内',}],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="机械负责人验收意见"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 3 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 21 }
              }"
            >
              <a-textarea
                placeholder="请输入备注, 10000字以内"
                v-decorator="[
                  'check_result',
                  {
                    rules: [{ required: isrequired,max: 10000, message: '10000字以内',}],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 弹出框 -->
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
        :columns="columnsTable?equip_data:contract_data"
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
          :data="{model:'020', type: 0, menu_id:42}"
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
import { getDictionaryEnum } from '@/api/dictionary'
import { fuzzySearchById } from '@/api/common'
import {contractsSearchById,selectRecord,handleMaintenanceRecord} from '@/api/onsite/maintenanceRecord'
import { model, getAttachments,selectLedger,querySingle} from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
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
      queryParam: {},
      selectedRowKeys: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      isrequired: true,
      visible: false,
      visible_name: false,
      columnsTable:true,
      number: '',
      col: '',
      activeTabKey: 'attach',
      tax_rate:0, //税率
      tax_fee_maintenance_costs:0,//不含税费用
      tax_fee:0, //税额
      maintenanceWay:'自修',
      fileList: [],
      selectData: {
        'is_subcontract': [
          {
            dic_enum_name: '是',
            dic_enum_id: 1
          },
          {
            dic_enum_name: '否',
            dic_enum_id: 2
          }
        ],
        'tax_rate':[], //税率
        'maintenance_way':[], //维修方式
        'maintenance_type':[], //维修类型
        'level':[], //维护级别
      },
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
          sm: { span: 9 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 15 }
        }
      },
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
        if(this.columnsTable){
          return selectLedger({creator_org_id:this.$store.state.menu_key||0,pageNum: 1, pageSize: 13 }).then(res => {
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
        }else{
          return fuzzySearchById({pageNum: 1, pageSize: 13 }).then(res => {
            // 索引
            this.current = res.responsePageInfo.pageNum
            this.currentSize = res.responsePageInfo.pageSize
            this.contractData = res

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
        }

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
          title: '管理号码',
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
      ]
    },
    contract_data () {
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
          title: '合同号',
          dataIndex: 'contract_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'contract_code'
          },
          onFilter: (value, record) => record.contract_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supplier_name'
          },
          onFilter: (value, record) => record.supplier_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
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
      if (from.path === '/onsite/maintenanceRecordList') {
        this.isrequired = true
        this.tax_rate=0
        this.tax_fee_maintenance_costs=0
      }
    }
  },
  mounted () {
    this.queryDictionary()
  },
  methods: {
    ...mapGetters(['nickname']),
    //设备字典
    queryDictionary(){
      let that=this
      let dicObj={
            'tax_rate':1006,
            'maintenance_way':1019,
            'maintenance_type':1018,
            'level':1017,
          }
      Object.getOwnPropertyNames(dicObj).forEach(key=>{
        querySingle({dic_type_id:dicObj[key]}).then(res=>{
          that.selectData[key]=res.responseList
        })
      })
    },
    showTable (flag) {
      this.columnsTable=flag
      this.visible_name = true
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    handleName (val) {
      this.visible_name = false
      if(this.columnsTable){
        const arr = this.EquipData.responsePageInfo.list.filter(item => item.id === val[0])
        if (!arr.length) return
        if (val.length > 1) return this.noSelect()

        if(arr[0].equip_code){
          //根据管理号码查询上次维修时间/里程
          this.equip_code=arr[0].equip_code
          // selectRecord({equip_code:arr[0].equip_code}).then(res => {
          //   // 索引
          //   if(res.responseObject.last_maintain_date){
          //     this.last_maintain_date=res.responseObject.last_maintain_date
          //   }
          // })
        }
        this.form.setFieldsValue({
          manage_code: arr[0].manage_code,
          equip_name: arr[0].equip_name,
          spec: arr[0].specification,
          dispatch_org_name: arr[0].accept_from||"",
        })
      }else{
        const arr2 = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
        if (!arr2.length) return
        if (val.length > 1) return this.noSelect()
        this.form.setFieldsValue({
          contract_no: arr2[0].contract_code,
          dispatch_org: arr2[0].supplier_name,
        })
      }
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    handleChange(value,key){
      debugger
      if(key=="maintenance_way"){ //自修是不需要合同和分包商
        if(value=="自修"){
          this.maintenanceWay="自修"
        }else{
          this.maintenanceWay="外修"
        }
      }
      if(key=="tax_rate"){
        this.tax_rate=value
      }
      if(key=="tax_fee_maintenance_costs"&&!isNaN(value)){
        this.tax_fee_maintenance_costs=value
      }
      console.log(this.tax_rate)
      console.log(this.tax_fee_maintenance_costs)
      let tax_fee=(this.tax_rate/100*this.tax_fee_maintenance_costs).toFixed(2)
      let tax_included_maintenance_costs=(parseFloat(this.tax_fee_maintenance_costs)+parseFloat(tax_fee)).toFixed(2)
      this.form.setFieldsValue(
        {
          tax_fee:tax_fee,
          tax_included_maintenance_costs:tax_included_maintenance_costs
        }
      )
    },
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
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
      this.$router.push('maintenanceRecordList')
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
      this.selectedRowKeys = selectedRowKeys
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
    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:42,
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
        menu_id:42 
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
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          values.creator_org_id = that.$store.state.menu_key //右上角编号
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code //编制单位编号

          values.menu_id = 42 
          values.flag=1
          values.equip_code=this.equip_code
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))

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
                  return handleMaintenanceRecord(values, 'submit').then(res => {
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
            return handleMaintenanceRecord(values, 'save').then(res => {
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
