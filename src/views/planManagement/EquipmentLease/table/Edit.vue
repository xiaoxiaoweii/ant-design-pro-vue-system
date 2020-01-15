<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="设备租赁申请单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="编制单位" v-bind="formItemLayout" default-value="0">
              <a-input
                disabled
                placeholder="编制单位"
                v-decorator="[
                  'pro_unit',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
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
          <a-col :span="6">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                v-decorator="[
                  'create_date',
                  {
                    rules: [{ required: true, message: '请选择日期' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                {
                  initialValue: this.params.serial_number,
                }  
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
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
                  'remark',
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

    <!-- 设备明细 -->
    <a-card class="card" title="设备明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="code"
        bordered
        class="line-table"
        :scroll="{x:2500}"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <div :key="col" v-if="record.editable && popconfirmFields.includes(col)">
            <a-input
              read-only
              style="margin: -5px 0"
              :value="text"
              @click="showModal(selectedRowKeys, col, record.key, record)"
              @change="e => handleChange(e.target.value, record.key, col)"
              :placeholder="columnsTitle[i]"
              v-decorator="[
                {
                  rules: [{ required: true, message: `请选择${col}` }],
                }
              ]"
            />
          </div>
          <div :key="col" v-if="record.editable && popconfirmFields2.includes(col)">
            <a-input
              read-only
              style="margin: -5px 0"
              :value="text"
              @click="showModal2(selectedRowKeys, col, record.key, record)"
              @change="e => handleChange(e.target.value, record.key, col)"
              :placeholder="columnsTitle[i]"
              v-decorator="[
                {
                  rules: [{ required: true, message: `请选择${col}` }],
                }
              ]"
            />
          </div>

          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :maxlength="1024"
            :placeholder="columnsTitle[i]"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnsTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.id"
              :value="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :placeholder="columnsTitle[i]"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="col=='num'?1:0"
            :precision="col=='num'?0.1:2"
            :max="999999999"
            :placeholder="columnsTitle[i]"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template
            v-else
          >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.value === text))[0].title : text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template>
            <span>
              <!-- <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />-->
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>
                  <a-icon type="delete" />
                </a>
              </a-popconfirm>
            </span>
            <!-- <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>-->
          </template>
          <!-- <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>-->
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增设备明细</a-button>
    </a-card>
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible2"
      width="80%"
      @ok="handleOk2(selectedRowKeys)"
      @cancel="oncancel()"
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
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible"
      width="90%"
      @ok="handleOk()"
      @cancel="handleCancel()"
    >
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
          :data="{ model: mod, type: 0 ,menu_id:22}"
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
import { handleEquipmentLease, exportToExcel, exportToPDF, getDeviceList } from '@/api/planManagement/equipmentLease'
import {
  uploadUrl,
  getAttachments,
  downloadAttachment,
  delAttachment,
  formStatus,
  modules,
  formStatusArray,
  getImgView,
  formStatusArray2,
  formStatusArray3,
  queryAllEquipment,
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
      myNum:[],
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      mysupName:'',
      srows:[],
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
      selectFields: ['rent_type', 'fee_type', 'tax_rate'],
      inputFields: [ 'remark'],
      datePickerFields: ['planned_in_date1', 'planned_out_date1'],
      numberFields: ['num', 'planned_quantity', 'price_without_tax'],
      popconfirmFields: ['rent_plan_sn'],
      popconfirmFields2:['supplier_name'],
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
        '设备需求计划单号',
        '供应商名称',
        '设备编码',
        '设备名称',
        '规格型号',
        '数量',
        '单位',
        '租赁方式',
        '计费方式',
        '不含税单价',
        '含税单价',
        '计划进场日期',
        '计划出厂日期',
        '计划租期/工作量',
        '税率(%)',
        '税额',
        '不含税总额',
        '含税总额',
        '备注'
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '设备需求计划单号',
          dataIndex: 'rent_plan_sn',
          key: 'rent_plan_sn',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'rent_plan_sn' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'supplier_name' }
        },
        {
          title: '设备编码',
          dataIndex: 'equipment_code',
          key: 'equipment_code',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'equipment_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          key: 'name',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          key: 'specification',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '租赁方式',
          dataIndex: 'rent_type',
          width: '120px',
          key: 'rent_type',
          align: 'center',
          scopedSlots: { customRender: 'rent_type' }
        },
        {
          title: '计费方式',
          dataIndex: 'fee_type',
          width: '120px',
          key: 'fee_type',
          align: 'center',
          scopedSlots: { customRender: 'fee_type' }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax',
          key: 'price_without_tax',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'price_without_tax' }
        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          key: 'price_with_tax',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'price_with_tax' }
        },
        {
          title: '计划进场日期',
          dataIndex: 'planned_in_date1',
          width: '150px',
          key: 'planned_in_date1',
          align: 'center',
          scopedSlots: { customRender: 'planned_in_date1' }
        },
        {
          title: '计划出厂日期',
          width: '150px',
          dataIndex: 'planned_out_date1',
          key: 'planned_out_date1',
          align: 'center',
          scopedSlots: { customRender: 'planned_out_date1' }
        },
        {
          title: '计划租期/工作量',
          dataIndex: 'planned_quantity',
          key: 'planned_quantity',
          align: 'center',
          scopedSlots: { customRender: 'planned_quantity' }
        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额',
          dataIndex: 'tax_fee',
          key: 'tax_fee',
          align: 'center',
          scopedSlots: { customRender: 'tax_fee' }
        },
        {
          title: '含税总额',
          dataIndex: 'sum_tax_fee',
          key: 'sum_tax_fee',
          align: 'center',
          scopedSlots: { customRender: 'sum_tax_fee' }
        },
        {
          title: '不含税总额',
          dataIndex: 'sum_with_tax',
          key: 'sum_with_tax',
          align: 'center',
          scopedSlots: { customRender: 'sum_with_tax' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '100px',
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
        'rent_plan_sn',
        'supplier_name',
        'equipment_code',
        'name',
        'specification',
        'num',
        'unit',
        'rent_type',
        'fee_type',
        'price_without_tax',
        'price_with_tax',
        'planned_in_date1',
        'planned_out_date1',
        'planned_quantity',
        'tax_rate',
        'tax_fee',
        'sum_tax_fee',
        'sum_with_tax',
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
        return selectRequire(Object.assign(parameter,{creator_org_id:this.$store.state.menu_key}, this.queryParam), 'retrieve').then(res => {
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
      valTree: '',
      valTree2: ''
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
      // let { filteredInfo } = this
      // filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '单据编号',
          width: '200',
          dataIndex: 'serial_number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'serial_number'
          },
          onFilter: (value, record) => record.serial_number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备名称',
          dataIndex: 'equipment_name',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equipment_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备规格',
          dataIndex: 'equipment_spec',
          width: '200px',
          scopedSlots: {
            customRender: 'customRender'
          }
        },
        {
          title: '计量单位',
          width: '200px',
          dataIndex: 'equipment_unit',
          scopedSlots: {
            customRender: 'customRender'
          }
        },
        {
          title: '计划数量',
          width: '100px',
          dataIndex: 'approved_fictitious_num',
          scopedSlots: {
            customRender: 'customRender'
          }
        },
        {
          title: '预计进场时间',
          width: '200px',
          dataIndex: 'estimated_in_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.estimated_in_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '预计退场时间',
          width: '200px',
          dataIndex: 'estimated_out_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.estimated_out_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
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
      if (to.path === '/planManagement/equipmentLeaseEdit') {
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
    getdictionary({ dic_type_id: 1007 }).then(res => {
      selectData.rent_type = res.responseList
    })
    this.isrequired = true
    this.queryParam = {
    }
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
        await getDeviceList({ id: data.id, menu_id: 22 }).then(res => {
          this.detailData = res.responseObject.details.map((d,i)=> {
            d.code =i+1
            d.editable = true
            d.isNew = true
            this.myNum.push(d.approved_rent_num)
            delete d.approved_alloc_num
            delete d.approved_purchase_num
            delete d.approved_rent_num
            d.planned_in_date && (d.planned_in_date1 = moment(d.planned_in_date))
            d.planned_out_date && (d.planned_out_date1 = moment(d.planned_out_date))

            d.key = d.id

            return d
          })
          this.detailData.map(d=>{
            this.srows.push(d.requirement_id)
          })

          this.fileList = res.responseObject.files.map(attachment => {
            // if (attachment.type === 0) {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.fileSize = (attachment.file_size/1024).toFixed(0)
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
              attachment.size = attachment.file_size
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
      setTimeout(()=>{
        this.$refs.tables.refresh(true)
      },500)
    },
    showModal2(selectedRowKeys, col, key, record) {
      this.visible2 = true
      this.handleData.col = col
      this.handleData.key = key
      this.handleData.record = record
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
    handleOk() {
      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      const arr = this.selectedRows
      // console.log(val, '---', col, '---', key, '---', arr)
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (this.selectedRowKeys.length > 1) return this.noSelect()
      if(this.srows.includes(arr[0].id)) {
        this.$info({
            title:'提示',
            content:'该记录不能重复选择'
          })
          return
      }
      this.visible = false
      this.srows.push(arr[0].id)
      this.detailData = this.detailData.map((x, i) => {
        if (x.key === this.handleData.key) {
          x.rent_plan_sn = arr[0].serial_number
          x.name = arr[0].equipment_name
          x.specification = arr[0].equipment_spec
          x.equipment_code = arr[0].equipment_code
          x.unit = arr[0].equipment_unit
          x.num = arr[0].approved_fictitious_num
          x.planned_in_date1 = moment(arr[0].estimated_in_date)
          x.planned_out_date1 = moment(arr[0].estimated_out_date)
          x.requirement_id = arr[0].id
          this.myNum[i] = (arr[0].approved_fictitious_num)
        }
        return x
      })

      this.queryParam = {
      }
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
      const arr = this.selectedRows
      if (!arr.length) return
      if (this.selectedRowKeys.length > 1) return this.noSelect()

      this.detailData = this.detailData.map((x, i) => {
        if (x.key === this.handleData.key) {
          x.supplier_name = arr[0].supName
        }
        return x
      })
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
      this.refresh(true)
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
      this.$router.push({ path: '/planManagement/equipmentLeaseList' })
      this.srows = [];this.myNum=[]
    },
    onSelectChange (selectedRowKeys, selectedRows) {
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

    handleGetInfo() {},

    newDevice() {
      const length = this.detailData.length
      if (length > 0 && !this.detailData[this.detailData.length - 1].rent_plan_sn)
        return this.noSelect('请填完上一条数据')

      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        name: '',
        editable: true,
        isNew: true,
        rent_plan_sn: '',
        supplier_name: '',
        equipment_code:'',
        specification: '',
        rent_type: '',
        fee_type: '',
        price_without_tax: '',
        planned_in_date1: null,
        planned_out_date1: null,
        planned_quantity: '',
        tax_fee: '',
        sum_tax_fee: '',
        num: '',
        tax_rate: '',
        remark: '',
        unit: ''
      })
    },
    remove (key) {
      var newData = this.detailData.filter(item => item.key !== key)
      newData=newData.map((d,i)=>{
        d.code = i+1
        return d
      })
      this.detailData = newData
    },
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    handleChange(value, key, column) {
      const newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        console.log(target.planned_in_date1,'===',target.planned_out_date1)
        if(target.planned_in_date1&&target.planned_out_date1) {
          if(target.planned_in_date1>=target.planned_out_date1){
            this.$confirm({
              title:'提示',
              content:'进场时间不能小于退场时间'
            })
            target.planned_in_date1 = null
            target.planned_out_date1 = null
          }
        }
        if (['tax_rate', 'price_without_tax'].includes(column)) {
          if (isNaN(target.price_with_tax)) target.price_with_tax = ''
          target.price_with_tax = (target.price_without_tax * (1 + target.tax_rate / 100)).toFixed(2)
        }
        target.tax_fee = isNaN(((target.num * target.price_without_tax * target.tax_rate * target.planned_quantity) / 100).toFixed(2))?'':((target.num * target.price_without_tax * target.tax_rate * target.planned_quantity) / 100).toFixed(2)
        if (isNaN(target.price_with_tax)) target.price_with_tax = ''

        if (isNaN(target.sum_tax_fee)) target.sum_tax_fee = ''
        target.sum_tax_fee = isNaN((target.num * target.price_with_tax*target.planned_quantity).toFixed(2))
          ? ''
          : (target.num * target.price_with_tax*target.planned_quantity).toFixed(2)

        if (isNaN(target.sum_with_tax)) target.sum_with_tax = ''
        target.sum_with_tax = isNaN((target.sum_tax_fee - target.tax_fee).toFixed(2))
          ? ''
          : (target.sum_tax_fee - target.tax_fee).toFixed(2)

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
        type: 0,
        menu_id: 22
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
        menu_id: 22
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
            values.details = that.detailData.map(x => {
              x.planned_in_date1 && (x.planned_in_date = x.planned_in_date1.format('YYYY-MM-DD'))
              x.planned_out_date1 && (x.planned_out_date = x.planned_out_date1.format('YYYY-MM-DD'))
              return x
            })
            for(let key in values.details) {
                if(values.details[key].sum_with_tax>9999999999999999){
                   this.$notification['warning']({
                    message: '提示',
                    description: '金额超限'
                  })
                  return
                }
              }
            let numbreak = false
            values.details.map((x,i)=>{
              if(x.num>this.myNum[i]) {
                this.$notification['warning']({
                    message: '提示',
                    description: `第${i+1}行数量不能超过引入的计划数量`
                  })
                  numbreak = true
                  return
              }
            })
            if(numbreak) return
            
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
            values.create_date = that.date
            values.flag = 2
            values.id = that.params.id
            // values.create_date = values.create_date.format('YYYY-MM-DD')
            values.menu_id = 22
            if (values.reason == undefined) delete values.reason
            if (values.total_amount == undefined) delete values.total_amount
            if (type === 'submit') {
              if (values.details.length === 0) {
                this.$notification['warning']({
                  message: '提示',
                  description: '提交时设备明细不能为空'
                })
                return
              }
              let break1 = false
              let colname = ''
              values.details.map((d, i) => {
                for (var key in d) {
                  if (d[key] == null || d[key] == '') {
                    if (key != 'remark') {
                      this.columns.map(item => {
                        if (item.dataIndex == key) colname = item.title
                      })
                      this.$notification['warning']({
                        message: '提示',
                        description: `提交时第${i + 1}行：${colname}不能为空`
                      })
                      break1 = true
                      return
                    }
                  }
                }
              })
              if (break1) return

              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk() {
                  var btn1 = document.querySelector('.ant-modal-confirm-btns>.ant-btn-default')
                  btn1.style.visibility = 'hidden'
                  that.submitLoading = true

                  return handleEquipmentLease(values, 'submit').then(res => {
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
              })
            } else {
              values.details = values.details.map(x => {
                for (let i in x) {
                  if (x[i] == '' || x[i] == undefined) delete x[i]
                }
                return x
              })
              that.saveLoading = true
              return handleEquipmentLease(values, 'update').then(res => {
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
        file.fileSize = (file.size / 1024).toFixed(0)
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
      if (col == 'material_category_code') {
        this.queryParam.code = this.eqcode
        this.$refs.tables.refresh(true)
        return
      }
      confirm()
      if (col) this.refresh(true)
    },

    handleReset(clearFilters, col) {
      this.eqcode = ''
      clearFilters()
      this.queryParam = {
        material_category_code: this.myEquipment_code
      }
      this.$refs.tables.refresh(true)
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
/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}

/deep/ .line-table tr td:nth-child(3) {
  font-size: 0 !important;
}

/deep/div.ant-col-18 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/deep/ div.ant-col-18 > div.ant-row > div.ant-col-sm-2 {
  width: 80px;
}

/deep/ div.ant-col-6 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-6 > div.ant-row > div.ant-col-sm-6 {
  width: 80px;
}
/deep/ div.ant-col-19 {
  width: 70%;
}
/deep/ div.ant-col-5 {
  width: 30%;
}
</style>
