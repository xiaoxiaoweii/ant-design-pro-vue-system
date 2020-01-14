<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="设备维修(改造)申请单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout" default-value="0">
              <a-input
                disabled
                placeholder="编制单位"
                v-decorator="[
                  'pro_unit'
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
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                v-decorator="[
                  'create_date',
                  { 
                    rules: [{required: true, message: '请选择日期' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="6">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  
                ]"
              />
            </a-form-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item label="供应商名称" v-bind="formItemLayout">
              <a-input
                @click="showModal2"
                placeholder="供应商名称"
                v-decorator="[
                  'supplier_name',
                  {
                    initialValue:dataObj.supplier_name,
                    rules: [{ required: true, message: '请输入供应商名称' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理号码" v-bind="formItemLayout">
              <a-input
                @click="showModal"
                placeholder="管理号码"
                v-decorator="[
                  'manage_code',
                  {
                    initialValue:dataObj.manage_code,
                    rules: [{ required: isrequired, message: '请输入管理号码' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备名称" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="设备名称"
                v-decorator="[
                  'equipment_name',
                  {
                    initialValue:dataObj.equipment_name,
                    rules: [{ message: '设备名称' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item label="规格型号" v-bind="formItemLayout">
            <a-input
                disabled
                placeholder="规格型号"
                v-decorator="[
                  'specification',
                  {
                    initialValue:dataObj.specification,
                    rules: [{ message: '规格型号' }],
                  }
                ]"
              />
            </a-form-item>  
          </a-col>
          <a-col :span="8">
            <a-form-item label="预算费用" v-bind="formItemLayout">
            <a-input-number
                :max="9999999999"
                :min="0"
                :precision="2"
                placeholder="预算费用"
                v-decorator="[
                  'repair_budget',
                  {
                    initialValue:dataObj.repair_budget,
                    rules: [{ required: isrequired, message: '预算费用' }],
                  }
                ]"
              />
            </a-form-item>  
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item
              label="设备技术状况"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 2 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 22 }
              }"
            >
              <a-textarea
                placeholder="请输入设备技术状况, 128字以内"
                v-decorator="[
                  'tech_status',
                  {
                    initialValue:dataObj.tech_status,
                    rules: [{ required: isrequired,max: 128, message: '128字以内' }],
                  }
                ]"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item
              label="维修改造(项目)"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 2 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 22 }
              }"
            >
              <a-textarea
                placeholder="请输入维修改造(项目), 128字以内"
                v-decorator="[
                  'fix_item',
                  {
                    initialValue:dataObj.fix_item,
                    rules: [{ required: isrequired,max: 128, message: '128字以内' }],
                  }
                ]"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item
              label="备注"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 2 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 22 }
              }"
            >
              <a-textarea
                placeholder="请输入备注, 1000字以内"
                v-decorator="[
                  'digest',
                  {
                    initialValue:dataObj.digest,
                    rules: [{ max: 1000, message: '1000字以内' }],
                  }
                ]"
              >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible"
      width="80%"
      @ok="handleOk(selectedRowKeys)"
      @cancel="handleCancel()"
    >
      <a-row>
        <a-col>
          <s-table
            ref="tables"
            size="small"
            rowKey="id"
            bordered
            :columns="demo"
            :data="loadData"
            :alert="false"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
            :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
          >
            <div
              slot="filterDropdown"
              slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
              class="custom-filter-dropdown"
            >
              <!-- 获取自定义栏位相关作用域属性 -->
              {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
              <a-range-picker
                v-if="column.dataIndex === 'request_date'"
                v-model="range"
                @change="onChangeDate"
                style="width: 218px; margin-bottom: 8px; display: block;"
              />
              <a-range-picker
                v-else-if="column.dataIndex === 'production_date'"
                v-model="checkRange"
                @change="onChangeCheckDate"
                style="width: 218px; margin-bottom: 8px; display: block;"
              />
              <a-input
                v-if="column.dataIndex === 'equipment_code'"
                v-model="eqcode"
                v-ant-ref="c => searchInput = c"
                :placeholder="`${column.title}`"
                :value="selectedKeys[0]"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch(selectedKeys, confirm,column.dataIndex)"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
              <a-input
                v-else
                ref="input"
                v-ant-ref="c => searchInput = c"
                :placeholder="`${column.title}`"
                :value="selectedKeys[0]"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch(selectedKeys, confirm,column.dataIndex)"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
              <a-button
                type="primary"
                @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                icon="search"
                size="small"
                :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date' ? 15 : 0}px`"
              >查询</a-button>
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
            <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
          </s-table>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible2"
      width="80%"
      @ok="handleOk2(selectedRowKeys)"
      @cancel="handleCancel()"
     >
      <a-row>
        <a-col>
          <s-table
            ref="tables"
            size="small"
            rowKey="serial"
            bordered
            :columns="demo2"
            :data="loadData2"
            :alert="false"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
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
                v-if="column.dataIndex === 'supName'"
                v-model="mysupName"
                v-ant-ref="c => searchInput = c"
                :placeholder="`${column.title}`"
                :value="selectedKeys[0]"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="() => handleSearch2(selectedKeys, confirm,column.dataIndex)"
                style="width: 188px; margin-bottom: 8px; display: block;"
              />
              <a-button
                type="primary"
                @click="() => handleSearch2(selectedKeys, confirm, column.dataIndex)"
                icon="search"
                size="small"
                :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date' ? 15 : 0}px`"
              >查询</a-button>
              <a-button
                @click="() => handleReset2(clearFilters, column.dataIndex)"
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
        </a-col>
      </a-row>
    </a-modal>
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
          :data="{ model: mod, type: 0 ,menu_id:27}"
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
      <!-- 图片上传 -->
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
        :disabled="![formStatus.saved, null, undefined, ''].includes(params.status)"
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >保存</a-button>&nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(params.status)"
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
import moment from 'moment'
import pick from 'lodash.pick'
import STree from '@/components/Tree/Tree'
import { STable, ZTree } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { selectRequire } from '@/api/planManagement/equipmentLease'
import { handleMaintenance, queryByCode,queryone,exportToExcel, exportToPDF } from '@/api/planManagement/maintenance'
import {
  uploadUrl,
  getAttachments,
  downloadAttachment,
  delAttachment,
  formStatus,
  modules,
  formStatusArray,
  formStatusArray2,
  formStatusArray3,
  getImgView,
  getdictionary,
  selectSupplierInfo
} from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
if (!window.jQuery) {
  window.jQuery = $
}

var selectData = {
  rent_type: [
    {
      dic_enum_name: '月租',
      id: 1
    },
    {
      dic_enum_name: '临租',
      id: 2
    },
    {
      dic_enum_name: '量化',
      id: 3
    },
    {
      dic_enum_name: '租赁',
      id: 4
    }
  ],
  fee_type: [],
  tax_rate: []
}

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    STree,
    ZTree,
    FooterToolBar
  },
  // props: {
  //   recording: {
  //     type: [Object, String],
  //     default: ''
  //   }
  // },
  data() {
    return {
      eqcode: '',
      myEquipment_code: '',
      input1: '',
      input2: '',
      params: {},
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      isrequired: true,
      handleData: {},
      handleTreeData: {},
      mysupName:'',
      dataObj:{},
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      formStatusArray: formStatusArray,
      showIndex: 0,
      treeData: [],
      settingTree: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'assets_type_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_code',
            idKey: 'assets_type_code'
          }
        }
      },
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'material_category_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_id',
            idKey: 'material_category_code'
          }
        }
      },
      equipList: [],
      tabList: [
        // {
        //   key: 'picture',
        //   tab: '图片上传'
        // },
        {
          key: 'attach',
          tab: '附件上传'
        }
        // {
        //   key: 'approval',
        //   tab: '审批记录'
        // }
      ],
      tableData: {},
      visible: false,
      visible2:false,
      selectedRowKeys: [],
      selectedRows: [],

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
      loadChange(pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      },
      sizeable: false,
      activeTabKey: 'picture',
      fileList: [],
      selectData: selectData,
      selectEquData: [],
      selectFields: ['tax_rate'],
      inputFields: ['supplier', 'remark'],
      datePickerFields: ['planned_arrival_date'],
      numberFields: ['num', 'price_without_tax','price_with_tax'],
      numberFields2: [],
      popconfirmFields: ['name'],
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
      columnsTitle: [
        '材料名称',
        '规格',
        '数量',
        '单位',
        '供应商名称',
        '不含税单价(元)',
        '税率(%)',
        '含税单价(元)',
        '税额',
        '总额',
        '价格合计',
        '计划到货日期',
        '备注'
      ],
      columns: [
        {
          title: '材料名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'specification',
          key: 'specification',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier',
          key: 'supplier',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'supplier' }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'price_without_tax',
          key: 'price_without_tax',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'price_without_tax' }
        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '含税单价（元）',
          dataIndex: 'price_with_tax',
          key: 'price_with_tax',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'price_with_tax' }
        },
        {
          title: '税额',
          dataIndex: 'tax_fee',
          key: 'tax_fee',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'tax_fee' }
        },
        {
          title: '总额',
          dataIndex: 'total_amount',
          key: 'total_amount',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'total_amount' }
        },
        {
          title: '价格合计',
          dataIndex: 'sum_with_tax',
          key: 'sum_with_tax',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'sum_with_tax' }
        },
        {
          title: '计划到货日期',
          dataIndex: 'planned_arrival_date',
          key: 'planned_arrival_date',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'planned_arrival_date' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: [
        'name',
        'specification',
        'num',
        'unit',
        'supplier',
        'price_without_tax',
        'tax_rate',
        'tax_fee',
        'total_amount',
        'sum_with_tax',
        'planned_arrival_date',
        'remark'
      ],
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
          title: '审批时间',
          dataIndex: 'date',
          key: 'approvaldate'
        }
      ],
      errors: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryByCode(Object.assign(parameter,{menu_id:27,scope_code:this.$store.state.menu_key}, this.queryParam), 'retrieve').then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          this.tableData = res

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
      loadData2: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        if (!this.queryParam2.condition.supName) {
          this.queryParam2.condition.supName = '公司'
        }
        parameter.current = parameter.pageNum
        parameter.size = parameter.pageSize
        if (parameter.supLevel) {
          this.queryParam2.condition.supLevel = parameter.supLevel
        } else {
          delete this.queryParam2.condition.supLevel
        }

        if (parameter.supType) {
          this.queryParam2.condition.supType = parameter.supType
        } else {
          delete this.queryParam2.condition.supType
        }

        return selectSupplierInfo(Object.assign(parameter, this.queryParam2)).then(res => {
          res.responseObject.data.records = res.responseObject.data.records.map(d => {
            if (d.supLevel == 1) {
              d.supLevel = '合格'
            } else {
              d.supLevel = '警示'
            }
            if (d.supType == 1) {
              d.supType = '企业'
            } else if (d.supType == 2) {
              d.supType = '个体工商户'
            } else {
              d.supType = '个人'
            }
            return d
          })
          // 索引
          res.responseObject.data.current && (this.current = res.responseObject.data.current)
          this.currentSize = res.responseObject.data.size
          this.tableData = res
          res.responseObject.data.records.forEach((x, i) => {
            x.serial = i + 1
          })

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
      },
      // 索引
      selectNode: '',
      current: Number,
      currentSize: Number,
      dicTree: [],
      myeqcode:'',
      valTree: '',
      valTree2: '',
    }
  },
  
  computed: {
    fields() {
      const fields = {}

      this.demo.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    },
    demo() {

      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '规格型号',
          width: '200px',
          dataIndex: 'specification',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          }
        },
        {
          title: '设备编码',
          width: '200px',
          dataIndex: 'equip_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equip_code.toLowerCase().includes(value.toLowerCase())
        }
      ]
    },
    demo2() {
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
          title: '供应商名称',
          dataIndex: 'supName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supName'
          }
        },
        {
          title: '供应商级别',
          dataIndex: 'supLevel',
          width: '140px',
          scopedSlots: {
            customRender: 'customRender'
          },
          filterMultiple: false,
          filters: formStatusArray2,
          filteredValue: filteredInfo.status || null,
          onFilter: (value, record) => record.status === value
        },
        {
          title: '供应商类型',
          dataIndex: 'supType',
          width: '140px',
          scopedSlots: {
            customRender: 'customRender'
          },
          filterMultiple: false,
          filters: formStatusArray3,
          filteredValue: filteredInfo.status || null,
          onFilter: (value, record) => record.status === value
        }
      ]
    },
    mod() {
      return modules.purchase
    },
    date() {
      return moment()
    },
    uploadUrl() {
      return uploadUrl
    },
    formStatus() {
      return formStatus
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/planManagement/maintenanceEdit') {
        this.params = this.$route.params
        this.$nextTick(() => {
          this.loadEditInfo(this.params)
          this.isrequired = true
        })
      }
    }
  },
  created() {
    this.isrequired = true
    this.params = this.$route.params
    this.queryParam = {}
    this.$nextTick(() => {
      this.loadEditInfo(this.params)
    })
  },
  mounted() {
    getdictionary({ dic_type_id: 1008 }).then(res => {
      selectData.fee_type = res.responseList
    })
    getdictionary({ dic_type_id: 1006 }).then(res => {
      selectData.tax_rate = res.responseList
    })
    this.isrequired = true
    // this.params = this.$route.params
    this.queryParam = {}
    this.queryParam2 = {
        condition: {
          organCode: '0000100002'
        }
      }
  },
  methods: {
    async loadEditInfo(data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        await queryone({ id: data.id, menu_id: 27 }).then(res => {
          this.dataObj = res.responseObject
          this.myeqcode = this.dataObj.equipment_code
          this.fileList = res.responseObject.files.map(attachment => {
            // if (attachment.type === 0) {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size
            attachment.username = attachment.upload_user_name
            // }
            return attachment
          })
          this.picList = res.responseObject.files.filter(attachment => {
            if (attachment.type === 1) {
              attachment.uid = attachment.id.toString()
              attachment.status = 'done'
              attachment.url = attachment.file_path + attachment.file_name
              attachment.key = attachment.id.toString()
              attachment.name = attachment.file_name
              attachment.fileSize = attachment.file_size
              attachment.username = attachment.upload_user_name
            }
            return attachment.type === 1
          })
          if (this.picList.length === 0) return false
          const details = this.picList.map(x => {
            return { file_path: x.file_path + x.file_name }
          })
          getImgView({
            details
          }).then(res => {
            this.picList.map((x, i) => {
              const arr = res.responseList.filter(y => x.file_path + x.file_name === y.file_path)
              if (arr.length > 0) {
                // base64
                const data = 'data:image/png;base64,' + arr[0].base64
                // 文件流
                x.url = data
              }
              return x
            })
          })
        })
        const formData = pick(data, ['pro_unit', 'creator_user_name', 'create_date', 'remark'])
        formData.create_date = moment(data.create_date)

        form.setFieldsValue(formData)
      }
    },
    showModal(selectedRowKeys, col, key, record) {
      this.visible = true
      this.handleData.col = col
      this.handleData.key = key
      this.handleData.record = record
    },
    showModal2() {
      this.visible2 = true
    },
    ...mapGetters(['nickname']),

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

    setFilterColumnScope(data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onClick: function(evt, treeId, treeNode) {
      // 点击事件
      // console.log(evt.type, treeNode)
      this.queryParam = {
        material_category_code: treeNode.material_category_code
      }
      this.myEquipment_code = treeNode.material_category_code
      this.$refs.tables.refresh(true)
    },
    onCheck: function(evt, treeId, treeNode) {
      // 选中事件
      // console.log(evt.type, treeNode)
    },
    handleCreated: function(ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      // console.log(ztreeObj)
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleCancel() {
      this.refresh(true)
    },
    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },

    update: function() {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    },
    handleTitleClick(item) {
      // console.log('handleTitleClick', item)
    },
    titleClick(e) {
      // console.log('titleClick', e)
    },
    handleSaveClose() {},
    handleOk(val, col, key) {
      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      this.visible = false
      const arr = this.selectedRows
      // console.log(val, '---', col, '---', key, '---', arr)
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (this.selectedRowKeys.length > 1) return this.noSelect()
      this.form.setFieldsValue({
        manage_code:arr[0].manage_code,
        equipment_name:arr[0].equip_name,
        specification:arr[0].specification
      })
      this.myeqcode = arr[0].equip_code
      this.queryParam = {}
      this.refresh(true)
    },
    handleOk2(val, col, key) {
      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      this.visible2 = false

      if (this.selectedRowKeys.length > 1) return this.noSelect()
      this.dataObj.supplier_name = this.selectedRows[0].supName
      this.selectedRowKeys = []
      this.selectedRows = []
      this.queryParam2 = {
        condition: {
          organCode: '0000100002'
        }
      }
      this.refresh(true)
    },
    refresh(bool) {
      this.$refs.tables.clearSelected()
      this.$refs.tables.refresh(bool)
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
    oncancel() {
      this.input1 = ''
    },
    // 提示框
    noSelect(title) {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: title || '请选择至少一条记录'
      })

      setTimeout(() => {
        modal.destroy()
      }, secondsToGo * 1000)
    },
    handleGoBack() {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push({ path: '/planManagement/maintenanceList' })
      this.dataObj={}
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
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
        type: 0,
        menu_id: 27
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
        type: 0,
        menu_id: 27
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

    // 购置单保存或提交
    saveOrSubmit(type) {
      if (type === 'save') {
        this.isrequired = false
      }
      const {
        form: { validateFields }
      } = this
      const that = this
      setTimeout(() => {
        validateFields((err, values) => {
          if (!err) {
            for (let i in values) {
              if (values[i] == undefined) delete values[i]
            }
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
            values.id = that.params.id
            values.creator_org_id = this.$store.state.menu_key
            values.creator_org_name = this.$store.state.org_name
            values.pro_unit_code = this.$store.state.pro_unit_code
            values.create_date = that.date
            values.flag = 2
            values.equipment_code = this.myeqcode

            // values.create_date = values.create_date.format('YYYY-MM-DD')
            values.menu_id = 27
            if (values.reason == undefined) delete values.reason
            if (values.total_amount == undefined) delete values.total_amount
            if (type === 'submit') {

              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk() {
                  var btn1 = document.querySelector('.ant-modal-confirm-btns>.ant-btn-default')
                  btn1.style.visibility = 'hidden'
                  that.submitLoading = true

                  return handleMaintenance(values, 'submit').then(res => {
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
                onCancel() {}
              })
            } else {
              that.saveLoading = true
              return handleMaintenance(values, 'update').then(res => {
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
    scrollToField(fieldKey) {
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
        // file = {
        //   key: file.uid,
        //   module: modules.purchase,
        //   file_size: (file.size / 1024).toFixed(0),
        //   upload_user_name: this.nickname(),
        //   upload_user_id: '123',
        //   type: 0
        // }
        file.key = file.uid
        file.module = modules.purchase
        file.file_size = file.size
        file.fileSize = file.size.toString()
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.type = 0

        return file
      })

      this.fileList = fileList
    },

    // 表格内过滤函数
    handleSearch(selectedKeys, confirm, col) {
      confirm()
    },

    handleReset(clearFilters, col) {
      clearFilters()
    },
    handleSearch2(selectedKeys, confirm, col) {
      this.queryParam2.condition.supName = this.mysupName
      confirm()
    },
    handleReset2(clearFilters, col) {
      this.mysupName = ''
      clearFilters()
      this.queryParam2.condition.supName = ''
      this.$refs.table.refresh(true)
    },
    resetForm() {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.picList = []
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
/deep/ .ant-select-selection--single {
  width: 80px;
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

// 详情隐藏表格第1&2
/deep/ .line-table tr td:nth-child(1) {
  font-size: 0 !important;
}

// /deep/ .line-table tr td:nth-child(2) {
//   font-size: 0 !important;
// }

/deep/div.ant-col-8 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/deep/ div.ant-col-8 > div.ant-row > div.ant-form-item-label {
  width: 110px;
}

/deep/ div.ant-col-16 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-16 > div.ant-row > div.ant-form-item-label {
  width: 110px;
}
/deep/ div.ant-row:nth-child(4)>div.ant-col-8:nth-child(2)>div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-row:nth-child(4)>div.ant-col-8:nth-child(2)>div.ant-row>div.ant-col-sm-6{
  width: 110px;
}
/deep/ div.ant-col-19 {
  width: 70%;
}
/deep/ div.ant-col-5 {
  width: 30%;
}
</style>
