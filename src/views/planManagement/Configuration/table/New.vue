<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="材料配置计划单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="编制单位" v-bind="formItemLayout" default-value="0">
              <a-input
                disabled
                placeholder="编制单位"
                v-decorator="[
                  'pro_unit',
                  {
                    initialValue: this.$store.state.pro_unit
                  }
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
                  {
                     initialValue: nickname(),
                  }
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
                  { initialValue: date },
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
    <a-card class="card" title="材料明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="code"
        bordered
        class="line-table"
        :scroll="{x:1300}"
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
              @click="showTree(selectedRowKeys, col, record.key, record)"
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
          <a-tree-select
            :dropdownStyle="{maxWidth: '200px',maxHeight:'300px',overflowX:'scroll'}"
            :dropdownMatchSelectWidth="false"
            style="margin: -5px 0;width: 200px;"
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            :value="text"
            :placeholder="columnsTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-tree-select-node
              v-for="item in selectData[col]"
              :key="item.id"
              :value="item.name"
              :title="item.name"
            />
          </a-tree-select>
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
            :min="1 "
            :precision="5"
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
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <!-- <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />-->
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>
                  <a-icon type="delete" />
                </a>
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
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增材料明细</a-button>
    </a-card>
    <a-modal
      @cancel="handleCancel"
      class="modal-box"
      title="请选择"
      v-model="enameVisible"
      width="40%"
      @ok="handleEnameOk(selectedRowKeys)"
    >
      <!-- <a-input :value="valTree2" v-model="input2" placeholder="请输入要查询的名称" @change="valueChange2"/> -->
      <ZTree
        ref="myztree"
        class="ztree1"
        :setting="settingTree"
        :nodes="treeData"
        @onClick="treeClick"
        @onCheck="onCheck"
        @onCreated="handleCreated"
        :ishow="true"
      />
    </a-modal>
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible"
      width="100%"
      @ok="handleOk"
      @cancel="oncancel"
    >
      <a-tabs defaultActiveKey="1" @change="handleTabClick" :activeKey="tableKey">
        <a-tab-pane tab="材料" key="1">
          <a-row :gutter="8">
            <a-col :span="5">
              <a-input
                :value="valTree"
                v-model="input1"
                placeholder="请输入要查询的名称"
                @pressEnter="valueChange"
              />
              <ZTree
                class="z-tree"
                :setting="setting"
                :nodes="dicTree"
                @onClick="onClick"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
            </a-col>
            <a-col :span="19">
              <s-table
                :scroll="{x:600}"
                class="s-table"
                ref="Etables"
                size="small"
                rowKey="id"
                bordered
                :columns="demo"
                :data="loadData"
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
                    v-if="column.dataIndex === 'material_category_code'"
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
        </a-tab-pane>
        <a-tab-pane tab="配件" key="2">
          <a-row :gutter="8">
            <a-col :span="5">
              <a-input-search
                :value="valTree3"
                v-model="input3"
                placeholder="请输入名称并按确定进行查询"
                @search="valueChange3"
              />
              <ZTree
                class="z-tree"
                :setting="setting3"
                :nodes="dicTree3"
                @onClick="onClick3"
                @onCheck="onCheck"
                @onCreated="handleCreated"
              />
            </a-col>
            <a-col :span="19">
              <a-table
                class="s-table"
                ref="tables"
                size="small"
                rowKey="serial"
                bordered
                @expand="expand"
                :expandedRowKeys="expandedRowKeys"
                :columns="demo1"
                @change="tableChange"
                :expandRowByClick="true"
                :loading="ListLoading"
                :dataSource="loadDataList"
                :customRow="setRow"
                :pagination="pagination"
              >
                <div slot="expandedRowRender" slot-scope style="margin: 5px 10px">
                  <a-radio-group
                    v-if="sonData.length"
                    name="radioGroup"
                    :defaultValue="1"
                    style="width: 100%;"
                    @change="radioChange"
                  >
                    <detail-list>
                      <detail-list-item v-for="item in sonData" :key="item.key">
                        <a-radio
                          :value="item.accessoriesCategoryName"
                        >{{ item.accessoriesCategoryName }}</a-radio>
                      </detail-list-item>
                    </detail-list>
                  </a-radio-group>
                  <div v-else style="text-align: center;">暂无配件可以选择...</div>
                </div>
                <div
                  slot="filterDropdown"
                  slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                  class="custom-filter-dropdown"
                >
                  <!-- 获取自定义栏位相关作用域属性 -->
                  {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
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
                >{{ index + 1 + (pagination.current - 1) * pagination.pageSize }}</span>
                <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
              </a-table>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
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
          :data="{ model: mod, type: 0 ,menu_id:17}"
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
import DetailList from '@/components/tools/DetailList'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handleConfiguration, exportToExcel, exportToPDF, queryByCategory } from '@/api/planManagement/configuration'
import { queryProjectName, queryByEquipment } from '@/api/planManagement/require'
import {
  uploadUrl,
  getAttachments,
  downloadAttachment,
  delAttachment,
  formStatus,
  modules,
  formStatusArray,
  getImgView,
  queryAllEquipment,
  queryAllCategory,
  selectByMaterielName,
  queryAssetsCategory,
  queryEquipType,
  selectAccessories
} from '@/api/common'
import { mapGetters } from 'vuex'
import { axios } from '../../../../utils/request'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item
if (!window.jQuery) {
  window.jQuery = $
}

const selectData = {
  catogery: [
    {
      title: '购买',
      value: 1
    },
    {
      title: '租赁',
      value: 2
    }
  ]
}

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    STree,
    ZTree,
    FooterToolBar,
    DetailList,
    DetailListItem
  },
  // props: {
  //   recording: {
  //     type: [Object, String],
  //     default: ''
  //   }
  // },
  data () {
    return {
      equipList: [],
      tableData: {},
      expandedRowKeys: [],
      sonData: [],
      ListLoading: false,
      rowData: {},
      radioData: '',
      loadDataList: [],
      parameter: {
        current: 1,
        size: 13,
        condition: {
          organCode: '0000100002'
        }
      },
      setting3: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'categoryName'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentCode',
            idKey: 'categoryCode'
          }
        }
      },
      pagination: {
        total: 0,
        current: 1,
        pageNum: 1,
        pageSizeOptions: ['13', '26', '39'],
        showTotal: total =>
          `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(total / this.pagination.pageSize)} 页`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 13
      },

      eqcode: '',
      myEquipment_code: '',
      input1: '',
      input2: '',
      input3: '',
      params: {},
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      isrequired: true,
      handleData: {},
      handleTreeData: {},
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
            name: 'name'
            // children: 'children'
          }
        }
      },
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'categoryName'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentId',
            idKey: 'id'
          }
        }
      },
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
      loadChange (pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      },
      sizeable: false,
      activeTabKey: 'picture',
      fileList: [],
      selectData: selectData,
      selectEquData: [],
      selectFields: [],
      inputFields: ['remark', 'specification', 'unit'],
      datePickerFields: [],
      numberFields: ['number'],
      popconfirmFields: ['material_name'],
      popconfirmFields2: ['use_site'],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      enameVisible: false,
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
      columnsTitle: ['材料名称', '规格型号', '单位', '数量', '使用对象', '备注'],
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
          title: '材料名称',
          dataIndex: 'material_name',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'material_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '数量',
          dataIndex: 'number',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '使用对象',
          dataIndex: 'use_site',
          align: 'center',
          scopedSlots: { customRender: 'use_site' }
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
          width: '100px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: ['material_name', 'specification', 'unit', 'number', 'use_site', 'remark'],
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
        // {
        //   title: '备注',
        //   dataIndex: 'remark',
        //   key: 'attachremark'
        // },
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
        // {
        //   title: '审批人签名',
        //   dataIndex: 'signature',
        //   key: 'signature'
        // },
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
        if (!this.queryParam.condition.categoryCode) {
          this.queryParam.condition.categoryCode = '0'
        }
        parameter.current = parameter.pageNum
        parameter.size = parameter.pageSize
        if (parameter.materialName) {this.queryParam.condition.materialName = parameter.materialName} else {delete this.queryParam.condition.materialName}
        if (parameter.specificationModel) {this.queryParam.condition.specificationModel = parameter.specificationModel} else {delete this.queryParam.condition.specificationModel}
        if (parameter.materialCode) {this.queryParam.condition.materialCode = parameter.materialCode} else {delete this.queryParam.condition.materialCode}
        return queryByCategory(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          res.responseObject.data.current && (this.current = res.responseObject.data.current)
          this.currentSize = res.responseObject.data.size
          this.tableData = res

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
      dicTree2: [],
      dicTree3: [],
      valTree: '',
      valTree3: '',
      valTree2: '',
      tableKey: '1'
    }
  },
  created () {
    this.isrequired = true
  },
  computed: {
    fields () {
      const fields = {}

      this.demo.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    },
    demo () {
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
          title: '材料名称',
          dataIndex: 'materialName',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'materialName'
          },
          // onFilter: (value, record) => record.materialName.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: '140px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specificationModel'
          },
          // onFilter: (value, record) => record.specificationModel.toLowerCase().includes(value.toLowerCase()),
        },
        {
          title: '材料编码',
          dataIndex: 'materialCode',
          width: '140px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'materialCode'
          },
          // onFilter: (value, record) => record.materialCode.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '单位',
          width: '120px',
          dataIndex: 'calculateUnit',
          scopedSlots: {
            customRender: 'customRender'
          }
        }
      ]
    },

    fields () {
      const fields = {}

      this.demo1.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    },
    demo1 () {
      // let { filteredInfo } = this
      // filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          width: '70px',
          dataIndex: 'serial',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '机械设备名称',
          dataIndex: 'equipmentName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equipmentName'
          },
          onFilter: (value, record) => record.equipmentName.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: '140px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.specificationModel.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '机械设备编码',
          dataIndex: 'equipmentCode',
          width: '140px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equipmentCode.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '单位',
          width: '120px',
          dataIndex: 'calculateUnit',
          scopedSlots: {
            customRender: 'customRender'
          }
        }
      ]
    },
    mod () {
      return modules.purchase
    },
    date () {
      return moment()
    },
    uploadUrl () {
      return uploadUrl
    },
    formStatus () {
      return formStatus
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/equipment/requireList') {
        this.isrequired = true
      }
    }
  },
  mounted () {
    this.isrequired = true
    // this.params = this.$route.params
    this.queryParam = {
      condition: {
        organCode: '0000100002',
        categoryCode: '0'
      }
    }
  },
  methods: {
    // 设备配件部分
    // 获取列表数据
    getEquip () {
      this.ListLoading = true
      queryByEquipment(Object.assign(this.queryParam, this.parameter)).then(res => {
        res.responseObject.data && (this.loadDataList = res.responseObject.data.records.map((x, i) => {
          x.serial = i + 1
          return x
        }))

        if (res.responseObject.data) {
          this.pagination.pageNum = res.responseObject.data.current
          this.pagination.total = res.responseObject.data.total
          this.pagination.pageSize = res.responseObject.data.size
        }
      })
        .finally(() => {
          this.ListLoading = false
        })
    },

    // 单选
    radioChange (e) {
      this.radioData = e.target.value
    },

    // 表格变化操作
    tableChange (pagination, filters, sorter) {
      // 对页面大小，筛选，排序等条件修改后重新查询数据
      const flag = this.parameter.pageNum !== pagination.current || this.parameter.pageSize !== pagination.pageSize
      this.pagination = pagination
      this.parameter.current = pagination.current
      this.parameter.size = pagination.pageSize
      if (flag) {
        this.getEquip()
      }
    },

    // 展开列表
    expand (expanded, record) {
      this.rowData = record
      // 重置展开节点，只展开当前点击的节点
      this.expandedRowKeys = []
      this.sonData = []
      if (expanded) {
        this.expandedRowKeys = [record.serial]
        this.parameter.condition.equipmentCode = record.equipmentCode
        selectAccessories(this.parameter).then(res => {
          this.sonData = res.responseObject.data.records.map((x, i) => {
            x.key = i + 1
            return x
          })
        })
      }
    },

    valueChange3 (e) {
      this.valTree3 = e
      queryEquipType({
        current: 1,
        size: 13,
        condition: {
          categoryName: this.valTree3,
          organCode: '0000100002'
        }
      }).then(res => {
        this.dicTree3 = res.responseObject.data
      })
    },

    onClick3: function (evt, treeId, treeNode) {
      // 点击事件
      // this.queryParam = {
      //   material_category_code: treeNode.material_category_code
      // }
      console.log(treeNode, '点击', this.parameter)
      this.parameter.condition.equipmentCategoryCode = treeNode.categoryCode
      this.myEquipment_code = treeNode.categoryCode
      this.getEquip()
      // this.$refs.tables.refresh(true)
    },

    setRow (record) {
      return {
        on: {
          click: e => {
            const index = e.srcElement.__vue__.$options.propsData.index
            record.serial = index
            this.expand(!this.expandedRowKeys.length, record)
          }
        }
      }
    },

    handleEnameOk (val) {
      if (this.selectNode === '') {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      this.enameVisible = false
      this.$refs.myztree.valTree = ''
      this.detailData = this.detailData.map((x, i) => {
        if (x.key === this.handleTreeData.key) {
          x.use_site = this.selectNode
        }
        return x
      })
      this.input2 = ''
    },
    treeClick (evt, treeId, treeNode) {
      if (!treeNode.oldname) {
        this.selectNode = treeNode.name
        return
      }
      if (treeNode.oldname.search('span') != -1) {
        let a = treeNode.oldname.indexOf('>')
        treeNode.oldname = treeNode.oldname.slice(a + 1)
        let b = treeNode.oldname.indexOf('<')
        treeNode.oldname = treeNode.oldname.slice(0, b)
      }
      this.selectNode = treeNode.oldname
    },
    handleTabClick (key) {
      this.tableKey = key
      if (key === '2') {
        queryEquipType({
          condition: {
            organCode: '0000100002'
          }
        }).then(res => {
          this.dicTree3 = res.responseObject.data.map(d => {
            if (d.parentCode === null) d.parentCode = 0
            return d
          })
        })
      }
    },
    showModal (selectedRowKeys, col, key, record) {
      this.visible = true
      this.tableKey = '1'
      this.queryparam = {
        current: 1,
        size: 13,
        condition: {
          organCode: '0000100002',
          categoryCode: '0'
        }
      }
      let idd = 0
      this.axios
        .post(
          '/selectMaterialCategoryAll',
          {
            condition: {
              organCode: '0000100002'
            }
          },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then(res => {
          res.responseObject.data.categoryList.shift()
          let arr1 = res.responseObject.data.categoryList.map(d => {
            if (!d.parentId) d.parentId = 0
            return d
          })
          this.dicTree2 = arr1
          this.dicTree = arr1
        })
      // queryAllCategory().then(res => (this.dicTree = res.responseList))
      this.handleData.col = col
      this.handleData.key = key
      this.handleData.record = record
      this.loadDataList = []
      this.pagination = {
        total: 0,
        current: 1,
        pageNum: 1,
        pageSizeOptions: ['13', '26', '39'],
        showTotal: total =>
          `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(total / this.pagination.pageSize)} 页`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 13
      }
    },
    ...mapGetters(['nickname']),

    // 限制上传图片的大小
    beforeUpload (file) {
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
    beforeUploaddata (file) {
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

    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    valueChange (e) {
      this.valTree = e.target.value
      if (!this.valTree) return (this.dicTree = this.dicTree2)
      selectByMaterielName({
        current: 1,
        size: 13,
        condition: {
          categoryName: this.valTree,
          organCode: '0000100002'
        }
      }).then(res => {
        this.dicTree = res.responseObject.data.records
      })
      // queryAllCategory({ material_category_name: this.valTree }).then(res => (this.dicTree = res.responseList))
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      // this.queryParam = {
      //   material_category_code: treeNode.material_category_code
      // }
      console.log(treeNode, '点击事件')
      this.queryParam.condition.categoryCode = treeNode.categoryCode
      this.myEquipment_code = treeNode.categoryCode
      this.$refs.Etables.refresh(true)
    },
    onCheck: function (evt, treeId, treeNode) {
      // 选中事件
      // console.log(evt.type, treeNode)
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      // console.log(ztreeObj)
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleCancel () {
      this.$refs.myztree.valTree = ''
    },
    // 图片预览
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },

    update: function () {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    },
    handleTitleClick (item) {
      // console.log('handleTitleClick', item)
    },
    titleClick (e) {
      // console.log('titleClick', e)
    },
    handleSaveClose () { },
    handleOk () {
      if (this.tableKey === '2') {
        this.rowData.equipmentName = this.rowData.equipmentName + this.radioData
        this.detailData = this.detailData.map((x, i) => {
          if (x.key === this.handleData.key) {
            x.material_name = this.rowData.equipmentName
            x.specification = this.rowData.specificationModel
            x.unit = this.rowData.calculateUnit
            x.material_code = this.rowData.equipmentCategoryCode
          }
          return x
        })
        this.parameter = {
          current: 1,
          size: 13,
          condition: {
            organCode: '0000100002'
          }
        }
        this.input3 = ''
      } else {
        if (this.selectedRowKeys.length === 0) {
          this.$confirm({
            title: '提示',
            content: '您未选择任何数据'
          })
          return
        }
        const arr = this.tableData.responseObject.data.records.filter((item, i) => i === this.selectedRowKeys[0])
        if (!arr.length) return
        if (this.selectedRowKeys.length > 1) return this.noSelect()
        this.detailData = this.detailData.map((x, i) => {
          if (x.key === this.handleData.key) {
            x.material_name = arr[0].materialName
            x.specification = arr[0].specificationModel
            x.unit = arr[0].calculateUnit
            x.material_code = arr[0].materialCode
          }
          return x
        })

        this.queryParam = {
          current: 1,
          size: 13,
          condition: {
            organCode: '0000100002',
            categoryCode: '0'
          }
        }
        this.$refs.Etables.refresh(true)
      }

      this.visible = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.loadDataList = []
      this.sonData = []
      this.input1 = ''
      this.valTree3 = ''
      this.input3 = ''
      this.expandedRowKeys = []
    },
    refresh (bool) {
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
    oncancel () {
      this.visible = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.loadDataList = []
      this.sonData = []
      this.input1 = ''
      this.valTree3 = ''
      this.input3 = ''
      this.expandedRowKeys = []
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
    showTree (selectedRowKeys, col, key, record) {
      queryProjectName({ creator_org_id: this.$store.state.menu_key }).then(res => {
        this.treeData = res.responseObject
        // this.delChild(this.options)
      })
      this.handleTreeData.col = col
      this.handleTreeData.key = key
      this.handleTreeData.record = record
      this.enameVisible = true
    },
    handleGoBack () {
      if (this.params === {}) {
        this.$emit('onGoBack')
      } else {
        this.resetForm()
        this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
        this.$router.push('configurationList')
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },

    handleGetInfo () { },

    newDevice () {
      const length = this.detailData.length
      if (length > 0 && !this.detailData[this.detailData.length - 1].material_name)
        return this.noSelect('请填完上一条数据')

      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        editable: true,
        isNew: true,
        material_name: '',
        specification: '',
        unit: '',
        number: '',
        use_site: '',
        remark: ''
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
        if (['number', 'single_capacity'].includes(column)) {
          target.total_capacity = (target.number * target.single_capacity).toFixed(0)
        }
        if (['number', 'single_power'].includes(column)) {
          target.total_power = (target.number * target.single_power).toFixed(0)
        }
        this.detailData = newData
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
          }
        ],
        type: 0,
        menu_id: 17
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment (record) {
      const data = {
        filePath: record.file_path,
        fileName: record.file_name,
        type: 0,
        menu_id: 17
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
    saveOrSubmit (type) {
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
              // for (let i in x) {
              //     if (x[i]==''||x[i]==undefined) delete x[i]
              // }
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
            values.pro_unit_code = this.$store.state.pro_unit_code
            values.create_date = that.date
            values.flag = 1

            // values.create_date = values.create_date.format('YYYY-MM-DD')
            values.menu_id = 17
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
                onOk () {
                  var btn1 = document.querySelector('.ant-modal-confirm-btns>.ant-btn-default')
                  btn1.style.visibility = 'hidden'
                  that.submitLoading = true

                  return handleConfiguration(values, 'submit').then(res => {
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
              that.saveLoading = true
              return handleConfiguration(values, 'create').then(res => {
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
    fileChange (info) {
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
    handleSearch (selectedKeys, confirm, col) {
      confirm()
      if (col) this.refresh(true)
    },

    handleReset (clearFilters, col) {
      this.eqcode = ''
      clearFilters()
      // this.queryParam = {
      // material_category_code: this.myEquipment_code
      // }
      this.queryParam.condition.categoryCode = this.myEquipment_code
      this.$refs.tables.refresh(true)
    },

    resetForm () {
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

/deep/ .line-table tr td:nth-child(6) {
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
