<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="临时设施需求计划单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8" >
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
          <a-col :span="8" >
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'creator_user_name'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                v-decorator="[
                  'create_date'
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
                  {
                    initialValue: this.params.serial_number
                  }
                ]"
              />
            </a-form-item>
          </a-col> -->
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
                placeholder="请输入摘要, 1000字以内"
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
        :scroll="{x:1800}"
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
              :key="item.value"
              :value="item.title"
            >{{ item.title }}</a-select-option>
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
            :min="1 "
            :precision="0.1"
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
      >新增设备明细</a-button>
    </a-card>

    <a-modal
      class="modal-box"
      title="请选择"
      v-model="enameVisible"
      width="40%"
      @cancel="handleCancel"
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

    <a-modal class="modal-box" title="请选择" v-model="visible" width="80%" @ok="handleOk" @cancel="oncancel">
      <a-row :gutter="8">
        <a-col :span="5">
          <a-input :value="valTree" v-model="input1" placeholder="请输入要查询的名称" @change="valueChange" />
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
            class="s-table"
            ref="tables"
            size="small"
            rowKey="serial"
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
          :data="{ model: mod, type: 0 ,menu_id:16}"
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
      <!-- <div class="picture clearfix" v-if="activeTabKey === 'picture'">
        <a-upload
          :action="uploadUrl"
          :multiple="true"
          listType="picture-card"
          :fileList="picList"
          @preview="handlePreview"
          @change="picChange"
          :beforeUpload="beforeUpload"
          :withCredentials="true"
          :data="{ model: mod, type: 1 }"
        >
          <div v-if="picList.length < 10">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" width="80%" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </div> -->
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
import {queryProjectName} from '@/api/planManagement/require'
import { handleTemporary, exportToExcel,exportToPDF ,getDeviceList} from '@/api/planManagement/temporary'
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
  queryAssetsCategory,
  handleQueryApprover,
  queryByEquipment2
} from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

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
      myEquipment_code:'',
      input1:'',
      input2:'',
      params: {},
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      isrequired: true,
      dicTree2:[],
      mycol:'',
      handleData: {},
      handleTreeData: {},
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      formStatusArray: formStatusArray,
      showIndex: 0,
      enameVisible:false,
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
            pIdKey: 'parentCode',
            idKey: 'categoryCode'
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
      selectFields: [],
      inputFields: ['model'],
      datePickerFields: [],
      numberFields: [ 'number','single_capacity'],
      popconfirmFields: ['name'],
      popconfirmFields2:['project_name','supply_scope','facility_position'],
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
        '工程名称', '名称', '型号', '数量', '单台容量(功率)',
         '单位', '小计容量(功率)', 
         '主要(备用)供应范围', '设置位置(里程桩号)'
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
          title: '工程名称',
          dataIndex: 'project_name',
          key: 'project_name',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'project_name' },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '型号',
          dataIndex: 'model',
          width: '150px',
          align: 'center',
          key: 'model',
          scopedSlots: { customRender: 'model' }
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '单台容量(功率)',
          dataIndex: 'single_capacity',
          key: 'single_capacity',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'single_capacity' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          align: 'center',
          width: '160px',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title:'小计容量(功率)',
          dataIndex:'total_capacity',
          key:'total_capacity',
          align:'center',
          width:'150px',
          scopedSlots: { customRender: 'total_capacity' }
        },
        {
          title: '主要(备用)供应范围',
          dataIndex: 'supply_scope',
          key: 'supply_scope',
          align: 'center',
          scopedSlots: { customRender: 'supply_scope' }
        },
        {
          title: '设置位置(里程桩号)',
          dataIndex: 'facility_position',
          key: 'facility_position',
          align: 'center',
          scopedSlots: { customRender: 'facility_position' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: [
        'project_name',
        'name',
        'model',
        'number',
        'single_capacity',
        'unit',
        'total_capacity',
        'supply_scope',
        'facility_position',
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
      eqcode:'',
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
        if (!this.queryParam.condition.equipmentCategoryCode) {
          this.queryParam.condition.equipmentCategoryCode = '0'
        }
        return queryByEquipment2(this.queryParam).then(res => {
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
      valTree2:''
    }
  },
  created() {
    this.isrequired = true
    this.params = this.$route.params
    this.$nextTick(() => {
      this.loadEditInfo(this.params)
    })
  },
  watch: {
    $route(to, from) {
      if (to.path === '/planManagement/temporaryEdit') {
        this.params=this.$route.params
        this.$nextTick(() => {
          this.loadEditInfo(this.params)
          this.isrequired = true
        })
      }
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
    demo () {
      return [
        {
          title: '序号',
          width: '70px',
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
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: '140px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
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
  mounted() {
    this.isrequired = true
    // this.params = this.$route.params
    this.queryParam = {
      current: 1,
      size: 20,
      condition: {
        organCode: '0000100002'
      }
    }
  },
  methods: {
    showModal (selectedRowKeys, col, key, record) {
      this.visible = true
      // queryAllEquipment().then(res => (this.dicTree = res.responseList))
      this.axios
        .post(
          '/selectCategory',
          {
            condition: {
              organCode: '0000100002'
            }
          },
          { headers: { 'Content-Type': 'application/json' } }
        )
        .then(res => {
          let arr1 = res.responseObject.data.map(d => {
            if (d.parentCode === null) d.parentCode = 0
            return d
          })
          this.dicTree = arr1
          this.dicTree2 = arr1
        })
      this.handleData.col = col
      this.handleData.key = key
      this.handleData.record = record     
    },
    ...mapGetters(['nickname']),
  async loadEditInfo(data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        await getDeviceList({ id: data.id, menu_id: 16 }).then(res => {
          this.detailData = res.responseObject.details.map((d,i) => {
            d.code = i+1
            d.editable = true
            d.isNew = true
            if (d.number===0) d.number = ''
            if (d.single_capacity===0) d.single_capacity = ''
            if (d.total_capacity===0) d.total_capacity = ''
            delete d.approved_alloc_num
            delete d.approved_purchase_num
            delete d.approved_rent_num
            d.key = d.id

            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            // if (attachment.type === 0) {
              attachment.uid = attachment.id.toString()
              attachment.status = 'done'
              attachment.url = ''
              attachment.key = attachment.id.toString()
              attachment.name = attachment.file_name
              attachment.fileSize = attachment.file_size
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
          if(this.mycol=='1') {
            x.project_name = this.selectNode
          } else if(this.mycol=='2') {
            x.supply_scope = this.selectNode
          } else if(this.mycol=='3') {
            x.facility_position = this.selectNode
          }
        }
        return x
      })
      this.input2 = ''
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
    valueChange(e) {
      this.dicTree = this.dicTree2
      this.valTree = e.target.value
      if (this.valTree == '') this.dicTree = this.dicTree2
      let arr1 = []
      for (let i = 0; i < this.dicTree.length; i++) {
        if (this.dicTree[i].categoryName.indexOf(this.valTree) != -1) {
          arr1.push(this.dicTree[i])
        }
      }
      this.dicTree = arr1
      // queryAllEquipment({ e_name: this.valTree }).then(res => (this.dicTree = res.responseList))
    },
    valueChange2(e) {
      this.valTree2 = e.target.value
      queryAssetsCategory({ assets_type_name: this.valTree2 }).then(res => (this.treeData = res.responseList))
    },
    
    onClick: function(evt, treeId, treeNode) {
      // 点击事件
      // this.queryParam = {
      //   equipment_code: treeNode.equipment_code
      // }
      this.queryParam.condition.equipmentCategoryCode = treeNode.categoryCode
      this.myEquipment_code = treeNode.categoryCode
      this.$refs.tables.refresh(true)
    },
    treeClick(evt, treeId, treeNode) {
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
    onCheck: function(evt, treeId, treeNode) {
      // 选中事件
    },
    handleCreated: function(ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleCancel() {
      this.$refs.myinput.valTree = ''
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
      this.visible = false
      const arr = this.selectedRows
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (this.selectedRowKeys.length > 1) return this.noSelect()
      
      this.detailData = this.detailData.map((x, i) => {
        if (x.key === this.handleData.key) {
          x.name = arr[0].equipmentName
          x.model = arr[0].specificationModel
          x.equipment_code = arr[0].equipmentCategoryCode
          x.unit = arr[0].calculateUnit
        }
        return x
      })
      this.queryParam = {
        current: 1,
        size: 20,
        condition: {
          organCode: '0000100002'
        }
      }
      this.refresh(true)
      this.input1 = ''
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
      this.queryParam = {
        current: 1,
        size: 20,
        condition: {
          organCode: '0000100002'
        }
      }
      this.refresh(true)
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
    showTree(selectedRowKeys, col, key, record) {
      if(col=='project_name') {
        this.mycol = '1'
      } else if(col =='supply_scope') {
        this.mycol = '2'
      } else if(col=='facility_position') {
        this.mycol = '3'
      }
      queryProjectName({creator_org_id: this.$store.state.menu_key}).then(res => {
      this.treeData = res.responseObject
      // this.delChild(this.options)
    })
      this.handleTreeData.col = col
      this.handleTreeData.key = key
      this.handleTreeData.record = record
      this.enameVisible = true
    },
    handleGoBack() {
        this.resetForm()
        this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
        this.$router.push('temporaryList')
        this.mycol = ''
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
      // this.visible = true
      // queryAllEquipment().then(res => (this.dicTree = res.responseList))

      const length = this.detailData.length
      if (length > 0 && !this.detailData[this.detailData.length - 1].name) return this.noSelect('请填完上一条数据')

      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        project_name: '',
        editable: true,
        isNew: true,
        name: '',
        model: '',
        number: '',
        single_capacity: '',
        unit: '',
        total_capacity: '',
        supply_scope:'',
        facility_position:''
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
        if (['number','single_capacity'].includes(column)) {
          if (isNaN(target.total_capacity)) target.total_capacity = ''
         target.total_capacity = (target.number*target.single_capacity).toFixed(0)
        }
        if (isNaN(target.total_capacity)) target.total_capacity = ''
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
        menu_id:16,
        type:0
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
        menu_id:16,
        type:0
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
            for(let i in values) {
              if(values[i]==undefined) delete values[i]
            }
      
            values.details = that.detailData.map((x) => {
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
              values.id = that.params.id
              values.creator_org_id = this.$store.state.menu_key
              values.creator_org_name = this.$store.state.org_name
              values.create_date = that.date
              values.flag = 2
            
            // values.create_date = values.create_date.format('YYYY-MM-DD')
            values.menu_id = 16
            if (values.reason == undefined) delete values.reason
            if (values.total_amount == undefined) delete values.total_amount
            if (type === 'submit') {
              if(values.details.length===0) {
                this.$notification['warning']({
                  message:'提示',
                  description:'提交时设备明细不能为空'
                })
                return
              }
              let break1 =false
              let colname=''
              values.details.map((d,i)=>{
                for(var key in d){
                  if(d[key]==null||d[key]==''){
                    if(key!='remark') {
                    this.columns.map((item)=>{
                    if(item.dataIndex==key) colname=item.title
                    })
                    this.$notification['warning']({
                      message:"提示",
                      description:`提交时第${i+1}行：${colname}不能为空`
                    })
                    break1=true
                    return
                    }
                  }
                }
              })
              if(break1) return
              
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk() {

                  var btn1=document.querySelector('.ant-modal-confirm-btns>.ant-btn-default')
                  btn1.style.visibility="hidden"
                  that.submitLoading = true

                  return handleTemporary(values, 'submit').then(res => {
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
              return handleTemporary(values, 'update').then(res => {
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
    handleSearch (selectedKeys, confirm, col) {
      
      confirm()
      // if (col) this.refresh(true)
    },

    handleReset(clearFilters, col) {
      clearFilters()
      this.queryParam.condition.equipmentCategoryCode = this.myEquipment_code

      this.$refs.tables.refresh(true)
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

/deep/ .line-table tr td:nth-child(9) {
  font-size: 0 !important;
}
/deep/ .line-table tr td:nth-child(10) {
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
/deep/ div.ant-col-19{
  width: 70%
}
/deep/ div.ant-col-5{
  width: 30%
}
</style>
