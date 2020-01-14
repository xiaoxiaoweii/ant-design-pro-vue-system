<template>
  <div>
    <a-card class="card" title="水电费结算管理" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="点验单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="请选择点验单位"
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
            <a-form-item label="点验日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                style="width: 100%"
                v-decorator="[
                  'create_date',
                  {
                    initialValue: date
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="供应商" v-bind="formItemLayout">
              <a-input
                placeholder="请输入供应商"
                v-decorator="[
                  'supplier_name',
                  {
                    rules: [{ max: 32, required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 合同树 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        class="s-table"
        ref="tables"
        size="small"
        rowKey="check_id"
        bordered
        :columns="contract_data"
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
          <a-range-picker
            v-if="column.dataIndex === 'contract_sign_date'"
            v-model="range"
            @change="onChangeDate"
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
          <a-range-picker
            v-else-if="column.dataIndex === 'acceptance_date'"
            v-model="checkRange"
            @change="onChangeCheckDate"
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
          <a-input
            ref="input"
            :maxlength="128"
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
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date' ? 15 : 0}px`"
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

    <!-- 明细 -->
    <a-card class="card" title="明细">
      <a-table
        bordered
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        class="line-table"
        :scroll="{ x: 2600 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            :maxlength="128"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnTitle[i]"
            @click="() => {
              col !== 'contract_name' ? '' : showTable(record)
            }"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.dic_enum_name"
              :value="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :placeholder="columnTitle[i]"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-range-picker
            v-decorator="['range-time-picker']"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            :key="col"
            :value="text"
            v-else-if="record.editable && rangePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :max="999999999"
            :key="col"
            :value="text"
            :min="0"
            :placeholder="columnTitle[i]"
            :step="col === 'price' ? 0.01 : 1"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="hydroPower" slot-scope="text, record">
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
      >新增明细</a-button>
    </a-card>

    <!-- file upload and approval record-->
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
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'E004', type: 0, menu_id: 99}"
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
          <template slot="hydroPower" slot-scope="text, record">
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
        <br />
        <a-card :bordered="false" title="工作流进度">
          <a-steps :direction="isMobile() && 'vertical' || 'horizontal'" :current="2" progressDot>
            <a-step title="开始"></a-step>
            <a-step title="部门初审"></a-step>
            <a-step title="财务复核"></a-step>
            <a-step title="完成"></a-step>
          </a-steps>
        </a-card>
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
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { STable } from '@/components'
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  queryAllContract
} from '@/api/equipmentMobilization/upload'
import {
  getDeviceList,
  handleApitalMaterial,
  getSerialNumber,
  getAmount,
  getHistory,
  // getMaterialType
} from '@/api/settlement/hydroPower'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
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
      sizeable: true,
      sumObj: {},
      isrequired: true,
      queryParam: {},
      customFilterColumn: {},
      newDataKey: '',
      // 点验单数据
      visible_name: false,
      loadTable: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryAllContract(Object.assign(parameter, this.queryParam, { menu_id: 60, scope_code: this.$store.state.menu_key || this.$store.state.user.first_key })).then(res => {
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
      },

      tabList: [
        {
          key: 'attach',
          tab: '附件上传'
        },
        // {
        //   key: 'approval',
        //   tab: '审批记录'
        // }
      ],
      queryPurchase: [],
      queryMaterialType: [],
      selectedRowKeys: [],
      selectedRows: [],
      serialable: false,

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
      activeTabKey: 'attach',
      fileList: [],
      selectData: {
        material_category: [
          {
            dic_enum_name: '水',
            dic_enum_id: '水'
          },
          {
            dic_enum_name: '电',
            dic_enum_id: '电'
          }
        ]
      },
      columnTitle: [
        '合同名称',
        '合同编号',
        '设备材料名称',
        '材料类别',
        '单位',
        '数量',
        '不含税单价（元）',
        '税率',
        '税额（元）',
        '不含税金额（元）',
        '含税金额（元）',
        '合同开累金额（不含税）',
        '合同开累金额（含税）',
        '备注'
      ],
      selectFields: [
        'material_category'
      ],
      serial_number: '',
      inputFields: [
        'contract_name',
        // 'contract_code',
        'equip_material_name',
        // 'material_category',
        'unit',
        // 'amount',
        // 'unit_price_excluding_tax',
        // 'tax_rate',
        // 'tax_amount',
        // 'money_excluding_tax',
        // 'value_tax_total',
        // 'contract_add_amount_without_tax',
        // 'contract_add_amount',
        'remark'
      ],
      rangePickerFields: [],
      datePickerFields: [
        // 'purchase_date'
      ],
      numberFields: [
        'amount'
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
      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '合同名称',
          dataIndex: 'contract_name',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'contract_name' }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_code',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'contract_code' }
        },
        {
          title: '设备材料名称',
          dataIndex: 'equip_material_name',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'equip_material_name' }
        },
        {
          title: '材料类别',
          dataIndex: 'material_category',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'material_category' }
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
          dataIndex: 'amount',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'unit_price_excluding_tax',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'unit_price_excluding_tax' }
        },
        {
          title: '税率',
          dataIndex: 'tax_rate',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额（元）',
          dataIndex: 'tax_amount',
          align: 'center',
          scopedSlots: { customRender: 'tax_amount' }
        },
        {
          title: '不含税金额（元）',
          dataIndex: 'money_excluding_tax',
          align: 'center',
          scopedSlots: { customRender: 'money_excluding_tax' }
        },
        {
          title: '含税金额（元）',
          dataIndex: 'value_tax_total',
          align: 'center',
          scopedSlots: { customRender: 'value_tax_total' }
        },
        {
          title: '合同开累金额（不含税）',
          dataIndex: 'contract_add_amount_without_tax',
          align: 'center',
          scopedSlots: { customRender: 'contract_add_amount_without_tax' }
        },
        {
          title: '合同开累金额（含税）',
          dataIndex: 'contract_add_amount',
          align: 'center',
          scopedSlots: { customRender: 'contract_add_amount' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          width: '90px',
          align: 'center',
          scopedSlots: { customRender: 'hydroPower' }
        }
      ],
      detailFields: [
        'contract_name',
        'contract_code',
        'equip_material_name',
        'material_category',
        'unit',
        'amount',
        'unit_price_excluding_tax',
        'tax_rate',
        'tax_amount',
        'money_excluding_tax',
        'value_tax_total',
        'contract_add_amount_without_tax',
        'contract_add_amount',
        'remark'
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
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'hydroPower' }
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
    fields () {
      const field = {}

      this.contract_data.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field
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
          title: '合同名称',
          dataIndex: 'contract_name',
          scopedSlots: {
            customRender: 'contract_name'
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_code',
          scopedSlots: {
            customRender: 'contract_code'
          }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'price',
          width: '150px',
          align: 'right',
          scopedSlots: {
            customRender: 'price'
          }
        },
        {
          title: '税率',
          dataIndex: 'tax_rate',
          width: '150px',
          align: 'right',
          scopedSlots: {
            customRender: 'tax_rate'
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
    hasSelected () {
      return this.selectedRowKeys.length > 0
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/settlement/apitalMaterialList') {
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

    // 点验单
    showTable (col) {
      this.newDataKey = col.key
      this.visible_name = true
      this.$refs.tables && this.refresh('tables')
    },
    async handleName (val) {
      this.visible_name = false
      const arr = this.selectedRows[0]
      this.selectedRowKeys = []
      this.selectedRows = []
      if (val.length !== 1) return this.noSelect()
      // 赋值
      await getAmount({ contract_code: arr.contract_code }).then(res => Object.assign(arr, res.responseObject))
      // this.sumObj = arr
      this.detailData = this.detailData.map(x => {
        if (x.key === this.newDataKey) {
          x.sumObj = arr
          x.contract_name = arr.contract_name
          x.contract_code = arr.contract_code

          this.handleChange(arr.price.toFixed(2), x.key, 'unit_price_excluding_tax')
          this.handleChange(arr.tax_rate.toFixed(2), x.key, 'tax_rate')

          x.settlement_amount_excluding_tax = x.settlement_amount_excluding_tax || 0
          x.settlement_amount_tax = x.settlement_amount_tax || 0
          x.contract_add_amount_without_tax = parseInt(x.settlement_amount_excluding_tax * 100 + arr.contract_add_amount_without_tax * 100) / 100
          x.contract_add_amount = parseInt(x.settlement_amount_tax * 100 + arr.contract_add_amount * 100) / 100
        }
        return x
      })
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    // 重置表格数据和搜索条件
    refresh (ref) {
      this.$refs[ref].clearSelected()
      this.$refs[ref].refresh(true)
      this.queryParam = {}
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
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    start () {
      this.loading = true
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('hydroPowerList')
    },

    loadEditInfo (data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        this.serialable = true

        getDeviceList({ id: data.id, menu_id: 99 }).then(res => {
          this.detailData = res.responseObject.detail.map((d, i) => {
            d.editable = true
            d.isNew = true
            console.log(d.issue_time)
            d.issue_time = (d.issue_time == null ? null : moment(d.issue_time))
            d.key = d.id
            d.order_number = i + 1

            return d
          })

          this.fileList = res.responseObject.file.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size
            attachment.username = attachment.upload_user_name

            return attachment
          })
        })

        const formData = pick(data, [
          'issue_code',
          'issue_time',
          'material_name',
          'spec',
          'single_price',
          'unit',
          'num',
          'sum',
          'use_site',
          'usr_org',
          'usr',
          'recyclable'
        ])
        formData.create_date = moment(data.create_date)
        // console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice () {
      if (this.detailData.length) {
        if (!this.detailData[this.detailData.length - 2].contract_name) return this.noSelect('请填完上一条数据')
      }
      this.detailData.forEach((x, i) => {
        if (x.order_number === '合计') {
          this.detailData.splice(i, 1)
        }
      })
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        order_number: length + 1,
        editable: true,
        isNew: true,
        contract_name: '',
        contract_code: '',
        equip_material_name: '',
        material_category: '水',
        unit: '',
        amount: '',
        unit_price_excluding_tax: '',
        tax_rate: '',
        tax_amount: '',
        money_excluding_tax: '',
        value_tax_total: '',
        contract_add_amount_without_tax: '',
        contract_add_amount: '',
        remark: ''
      })
      this.detailData.push({
        key: '0',
        order_number: '合计',
        editable: false,
        isNew: true,
        contract_name: '',
        contract_code: '',
        equip_material_name: '',
        material_category: '',
        unit: '',
        amount: this.data_sum('amount'),
        unit_price_excluding_tax: this.data_sum('unit_price_excluding_tax'),
        tax_rate: '',
        tax_amount: this.data_sum('tax_amount'),
        money_excluding_tax: this.data_sum('money_excluding_tax'),
        value_tax_total: this.data_sum('value_tax_total'),
        contract_add_amount_without_tax: this.data_sum('contract_add_amount_without_tax'),
        contract_add_amount: this.data_sum('contract_add_amount'),
        remark: ''
      })
    },

    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        if (x.order_number !== '合计') {
          num += parseInt(x[attr] * 100)
        }
      })
      return num / 100
    },
    remove (key) {
      const arr = ['amount', 'unit_price_excluding_tax', 'tax_amount', 'money_excluding_tax', 'value_tax_total', 'contract_add_amount_without_tax', 'contract_add_amount']
      const newData = this.detailData.filter(item => item.key !== key)

      this.detailData = newData
      arr.map(x => {
        this.detailData.forEach((d, i) => {
          if (d.order_number === '合计') {
            d[x] = this.data_sum(x)
          }
          if (d.order_number !== '合计') {
            d.order_number = i + 1
          }
        })
      })
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
      let newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value

        if (['amount', 'unit_price_excluding_tax', 'tax_rate'].includes(column)) {
          // if (target.price) {

          if (!(target.amount && target.unit_price_excluding_tax && target.tax_rate)) {
            target.tax_amount = 0
            target.money_excluding_tax = 0
            target.value_tax_total = 0
            target.contract_add_amount_without_tax = 0
            target.contract_add_amount = 0
          }
          if (!target.amount) {
            target.amount = 0
          }

          if (target.amount && target.unit_price_excluding_tax && target.tax_rate) {
            // 税额
            target.tax_amount = parseInt((target.unit_price_excluding_tax * target.tax_rate) * target.amount * 100) / 100

            // 不含税金额
            target.money_excluding_tax = parseInt(target.unit_price_excluding_tax * target.amount * 100) / 100

            // 含税金额
            target.value_tax_total = parseInt(target.tax_amount * 100 + target.money_excluding_tax * 100) / 100

            // 合同开累金额（不含税）
            target.contract_add_amount_without_tax = parseInt(target.money_excluding_tax * 100 + target.sumObj.contract_add_amount_without_tax * 100) / 100

            // 合同开累金额（含税）
            target.contract_add_amount = parseInt(target.value_tax_total * 100 + target.sumObj.contract_add_amount * 100) / 100
          }

          const arr = ['amount', 'unit_price_excluding_tax', 'tax_amount', 'money_excluding_tax', 'value_tax_total', 'contract_add_amount_without_tax', 'contract_add_amount']
          arr.map(x => {
            newData.forEach(d => {
              if (d.order_number === '合计') {
                d[x] = this.data_sum(x)
              }
            })
          })
          // }
        }
        this.detailData = newData
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 99,
        type: 0,
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
          }
        ]
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment (record) {
      let data = {
        menu_id: 99,
        type: 0,
        filePath: record.file_path,
        fileName: record.file_name,
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
      const {
        form: { validateFields }
      } = this
      const that = this
      if (type === 'save') {
        this.isrequired = false
      } else {
        if (this.detailData.length === 0) {
          this.$notification['error']({
            message: '提示',
            description: '提交时明细不能为空'
          })
          return
        }
        let break1 = false
        let colname = ''
        this.detailData.forEach((d, i) => {
          if (d.order_number !== '合计') {
            console.log(d)
            for (var key in d) {
              if (!d[key] && d[key] !== 0) {
                if (key != 'remark') {
                  this.columns.map(item => {
                    if (item.dataIndex == key) colname = item.title
                  })
                  this.$notification['error']({
                    message: '提示',
                    description: `提交时第${d.order_number}行：${colname}不能为空`
                  })
                  break1 = true
                  return
                }
              }
            }
          }
        })
        if (break1) return
      }
      setTimeout(() => {
        validateFields((err, values) => {

          values.details = that.detailData.filter(x => {
            for (let key in x) {
              if (!x[key] && x[key] !== 0) {
                delete x[key]
              }
            }
            return x.order_number !== '合计'
          })
          values.files = that.fileList

          if (that.recording) {
            values.id = that.recording.id
            values.serial_number = that.recording.serial_number
            values.creator_user_id = that.recording.creator_user_id
            values.creator_org_id = that.recording.creator_org_id
            values.creator_org_name = that.recording.creator_org_name
            values.status = that.recording.status
            values.flag = 2
          } else {
            // 联动参数
            values.flag = 1
          }
          // values.details.map(x => {
          //   // x.issue_time = x.issue_time ? x.issue_time.format('YYYY-MM-DD') : ''
          //   x.single_price = x.single_price + ''
          //   x.num = x.num + ''
          //   return x
          // })
          values.menu_id = 99
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code
          // values.status_description = '已保存'
          // console.log(values.create_date)
          values.create_date = values.create_date.format('YYYY-MM-DD')

          for (let key in values) {
            if (!values[key]) {
              delete values[key]
            }
          }

          if (!err) {
            if (type === 'submit') {
              that.submitLoading = true
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  that.submitLoading = false
                  return handleApitalMaterial(values, 'submit').then(
                    res => {

                      if (res.status === '0') {
                        that.$notification['success']({
                          message: '提示',
                          description: res.msg
                        })
                        that.handleGoBack() // 返回列表页
                      }
                    }
                  )
                },
                onCancel () {
                  that.submitLoading = false
                }
              })
            }
          }
          if (type === 'save') {
            that.saveLoading = true
            that.submitLoading = false
            return handleApitalMaterial(values, 'create').then(
              res => {
                that.saveLoading = false
                if (res.status === '0') {
                  that.$notification['success']({
                    message: '提示',
                    description: res.msg
                  })
                  that.handleGoBack() // 返回列表页
                }
              }
            )
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
    beforeUploaddata (file) {
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
      let sizeSum = 0
      this.fileList.map(x => {
        sizeSum += x.file_size
        return x
      })
      this.picList.map(x => {
        sizeSum += x.file_size
        return x
      })
      const isLt50M = sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
    },

    // 文件上传
    fileChange (info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      fileList = fileList.filter(file => {
        if (file.status === 'error') this.$message.error('上传文件过大或不支持该格式的文件！')
        else if (file.response && file.response.status === '0') {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
          file.id_in_module = file.length
          file.key = file.uid
          file.module = modules.apitalMaterial
          file.file_size = file.size.toString()
          file.upload_user_id = '123' // 待修改
          file.upload_user_name = this.nickname()
          file.remark = '附件'
          file.type = 0
        }
        return file.status !== 'error'
      })
      this.fileList = fileList
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

    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
      // if (col) this.refresh(true)
    },

    handleNameReset (clearFilters, col) {
      clearFilters()
      // this.queryParam = {}
      // this.refresh(true)
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

/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
</style>
