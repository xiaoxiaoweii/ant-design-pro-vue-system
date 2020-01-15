<template>
  <div>
    <a-card class="card" title="设备费用统计单" :bordered="false">
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
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="请选择编制单位"
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
        :scroll="{ x: 2400 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            :maxlength="128"
            :class="col + record.order_number"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columnTitle[i]"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :class="col + record.order_number"
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectDetailData[col]"
              :key="item.dic_enum_name"
              :value="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :class="col + record.order_number"
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
            :class="col + record.order_number"
            v-else-if="record.editable && rangePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0"
            :class="col + record.order_number"
            :max="col === 'amount' ? 999999999 : 999999999.99"
            :placeholder="columnTitle[i]"
            :step="col === 'price' ? 0.01 : 1"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="apitalMaterial" slot-scope="text, record">
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
        icon="sync"
        @click="newDevice"
      >更新结算信息</a-button>
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
          :data="{model:'E009', type: 0, menu_id: 100}"
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
          <template slot="apitalMaterial" slot-scope="text, record">
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
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { STable } from '@/components'
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  getDeviceList,
  handleApitalMaterial,
  getSerialNumber,
  getHistory,
  getLedger,
  getSupplier,
  getAmount,
  settleDate,
  // getMaterialType
} from '@/api/settlement/equipClearingFee'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules, getdictionary } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

const selectDetailData = {
  'rent_type': [
    {
      dic_enum_name: '月租',
      dic_enum_id: '月租'
    },
    {
      dic_enum_name: '年租',
      dic_enum_id: '年租'
    }
  ],
  'fee_type': [
    {
      dic_enum_name: '月',
      dic_enum_id: '月'
    },
    {
      dic_enum_name: '年',
      dic_enum_id: '年'
    }
  ]
}

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    FooterToolBar
  },
  // props: {
  //   params: {
  //     type: [Object, String],
  //     default: ''
  //   }
  // },
  data () {
    return {
      params: {},
      dateDis: false,
      isrequired: true,
      sizeable: true,
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
        return getCheck(Object.assign(parameter, this.queryParam, { menu_id: 60, scope_code: this.$store.state.menu_key || this.$store.state.user.first_key })).then(res => {
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
      selectData: [],
      selectDetailData: selectDetailData,
      columnTitle: [
        '供应商名称',
        '结算内容描述',
        '本期结算金额（不含税）',
        '本期结算金额（含税）',
        '开累结算金额（不含税）',
        '开累结算金额（含税）',
        '已支付金额（元）',
        '欠款金额（元）'
      ],
      selectFields: [
        'tax_rate',
      ],
      serial_number: '',
      inputFields: [
        // 'supplier_name',
        // 'settlement_content_description',
        // 'total_amount_excluding_tax',
        // 'settlement_amount_tax',
        // 'settlement_amount_without_tax',
        // 'open_settlement_amount',
        // 'amount_paid',
        // 'amount_in_arrears'
      ],
      rangePickerFields: [],
      datePickerFields: [
        //
      ],
      numberFields: [
        'amount_paid',
        'amount_in_arrears'
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
          title: '供应商名称',
          dataIndex: 'supplier_name',
          align: 'center',
          scopedSlots: { customRender: 'supplier_name' }
        },
        {
          title: '结算内容描述',
          dataIndex: 'settlement_content_description',
          align: 'center',
          scopedSlots: { customRender: 'settlement_content_description' }
        },
        {
          title: '本期结算金额（不含税）',
          dataIndex: 'total_amount_excluding_tax',
          align: 'center',
          scopedSlots: { customRender: 'total_amount_excluding_tax' }
        },
        {
          title: '本期结算金额（含税）',
          dataIndex: 'settlement_amount_tax',
          align: 'center',
          scopedSlots: { customRender: 'settlement_amount_tax' }
        },
        {
          title: '开累结算金额（不含税）',
          dataIndex: 'settlement_amount_without_tax',
          align: 'center',
          scopedSlots: { customRender: 'settlement_amount_without_tax' }
        },
        {
          title: '开累结算金额（含税）',
          dataIndex: 'open_settlement_amount',
          align: 'center',
          scopedSlots: { customRender: 'open_settlement_amount' }
        },
        {
          title: '已支付金额（元）',
          dataIndex: 'amount_paid',
          align: 'center',
          scopedSlots: { customRender: 'amount_paid' }
        },
        {
          title: '欠款金额（元）',
          dataIndex: 'amount_in_arrears',
          align: 'center',
          scopedSlots: { customRender: 'amount_in_arrears' }
        }
      ],
      detailFields: [
        'supplier_name',
        'settlement_content_description',
        'total_amount_excluding_tax',
        'settlement_amount_tax',
        'settlement_amount_without_tax',
        'open_settlement_amount',
        'amount_paid',
        'amount_in_arrears'
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
          scopedSlots: { customRender: 'apitalMaterial' }
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
          title: '名称',
          dataIndex: 'name',
          scopedSlots: {
            customRender: 'name'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specifications',
          scopedSlots: {
            customRender: 'specifications'
          }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          width: '150px',
          scopedSlots: {
            customRender: 'manufacturer'
          }
        },
        {
          title: '不含税单价（元）',
          dataIndex: 'price',
          width: '150px',
          scopedSlots: {
            customRender: 'price'
          }
        },
        {
          title: '采购日期',
          dataIndex: 'purchase_date',
          width: '150px',
          scopedSlots: {
            customRender: 'purchase_date'
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
  activated () {
    this.isrequired = true
    this.params = this.$route.params
    this.loadEditInfo(this.params)
  },
  mounted () {
    this.isrequired = true
    this.params = this.$route.params
    // 存取编辑数据id
    let idObj = this.$route.name
    let obj = {}
    obj[idObj] = this.params
    if (this.params.id) this.$store.commit('SET_EDIT_ID', obj)
    this.params = this.$store.state.edit_id[idObj] || this.params

    this.$nextTick(() => {
      // this.getSupplierList()
      this.loadEditInfo(this.params)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    getSupplierList () {
      getSupplier({ scope_code: this.$store.state.menu_key || this.$store.state.first_key}).then(res => {
        this.detailData = res.responseList.map((x, i) => {
          x.editable = true
          x.isNew = true
          x.key = i + 1
          x.order_number = i + 1
          x.amount_paid = ''
          x.amount_in_arrears = ''
          return x
        })
        if (this.detailData.length) this.detailData.push({
          key: '0',
          order_number: '合计',
          editable: false,
          isNew: true,
          total_amount_excluding_tax: this.data_sum('total_amount_excluding_tax'),
          settlement_amount_tax: this.data_sum('settlement_amount_tax'),
          settlement_amount_without_tax: this.data_sum('settlement_amount_without_tax'),
          open_settlement_amount: this.data_sum('open_settlement_amount'),
          amount_paid: this.data_sum('amount_paid'),
          amount_in_arrears: this.data_sum('amount_in_arrears')
        })
      })
    },

    onChange (date, dateString) {
      console.log('日期选择', date, dateString)
    },

    supChange (value) {
      this.detailData = []
      getdictionary({ pageNum: 1, pageSize: 13, dic_type_id: 1006 }).then(res => {
        this.selectDetailData['tax_rate'] = res.responseList
      })
      console.log(value)
      settleDate({ supplier_name: value }).then(res => {
        if (res.responseObject.settlement_start_time) {
          this.dateDis = true
          this.form.setFieldsValue({
            settlement_start_time: moment(res.responseObject.settlement_start_time)
          })
        }
      })
      getLedger({ scope_code: this.$store.state.menu_key, pageSize: 13, pageNum: 1, supplier_name: value }).then(res => {
        console.log(res)
        this.detailData = res.responsePageInfo.list.map((x, i) => {
          x.key = i + 1
          x.order_number = i + 1
          x.editable = true
          x.isNew = true
          x.rent_type = '月租'
          x.fee_type = '月'
          x.tax_rate = 6
          getAmount({ contract_code: x.contract_code }).then(res => {
            console.log(res)
            x.sumObj = res.responseObject
          })

          return x
        })

        if (this.detailData.length) this.detailData.push({
          key: '0',
          order_number: '合计',
          editable: false,
          isNew: true
        })

      })
    },

    // 点验单
    showTable () {
      // this.newDataKey = col.key
      this.visible_name = true
      this.$refs.tables && this.refresh('tables')
    },
    handleName (val) {
      this.visible_name = false
      const arr = this.selectedRows[0]
      this.selectedRowKeys = []
      this.selectedRows = []
      if (val.length !== 1) return this.noSelect()
      // 赋值
      this.detailData = this.detailData.map(x => {
        if (x.key === this.newDataKey) {
          x.name = arr.name
          x.specifications = arr.specifications
          x.manufacturer = arr.manufacturer
          // x.price = arr.price.toFixed(2)
          x.purchase_date = arr.purchase_date
          x.check_id = arr.check_id
          this.handleChange(arr.price.toFixed(2), x.key, 'price')
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
      this.$router.push('equipClearingFeeList')
    },

    loadEditInfo (data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {

        getDeviceList({ id: data.id, menu_id: 100 }).then(res => {
          this.detailData = res.responseObject.details.map((d, i) => {
            d.editable = true
            d.isNew = true
            d.key = d.id
            d.order_number = i + 1

            return d
          })

          if (this.detailData.length) this.detailData.push({
            key: '0',
            order_number: '合计',
            editable: false,
            isNew: true,
            total_amount_excluding_tax: this.data_sum('total_amount_excluding_tax'),
            settlement_amount_tax: this.data_sum('settlement_amount_tax'),
            settlement_amount_without_tax: this.data_sum('settlement_amount_without_tax'),
            open_settlement_amount: this.data_sum('open_settlement_amount'),
            amount_paid: this.data_sum('amount_paid'),
            amount_in_arrears: this.data_sum('amount_in_arrears')
          })

          this.fileList = res.responseObject.files.map(attachment => {
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
          'serial_number',
          'pro_unit',
          'creator_user_name',
          'create_date',
        ])
        formData.create_date = moment(data.create_date)
        // console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice () {
      this.getSupplierList()
      // if (this.detailData.length) {
      //   if (!this.detailData[this.detailData.length - 2].name) return this.noSelect('请填完上一条数据')
      // }
      // this.detailData.forEach((x, i) => {
      //   if (x.order_number === '合计') {
      //     this.detailData.splice(i, 1)
      //   }
      // })
      // const length = this.detailData.length
      // this.detailData.push({
      //   key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
      //   order_number: length + 1,
      //   editable: true,
      //   isNew: true,
      //   name: '',
      //   specifications: '',
      //   manufacturer: '',
      //   purchase_date: '',
      //   amortization_period: '',
      //   price: '',
      //   quantity: '',
      //   original_value: '',
      //   month_amortized_amount: '',
      //   months_amortized: '',
      //   amortized_amount: '',
      //   net_value: '',
      //   use_org: '',
      //   employee: '',
      //   recyclable: '是'
      // })
      // this.detailData.push({
      //   key: '0',
      //   order_number: '合计',
      //   editable: false,
      //   isNew: true,
      //   name: '',
      //   specifications: '',
      //   manufacturer: '',
      //   purchase_date: '',
      //   amortization_period: this.data_sum('amortization_period'),
      //   price: this.data_sum('price'),
      //   quantity: this.data_sum('quantity'),
      //   original_value: this.data_sum('original_value'),
      //   month_amortized_amount: this.data_sum('month_amortized_amount'),
      //   months_amortized: this.data_sum('months_amortized'),
      //   amortized_amount: this.data_sum('amortized_amount'),
      //   net_value: this.data_sum('net_value'),
      //   use_org: '',
      //   employee: '',
      //   recyclable: ''
      // })
    },

    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.map(x => {
        // if (!x[attr]) x[attr] = 0
        if (x.order_number !== '合计') {
          num = parseInt(num * 100 + (x[attr] || 0) * 100) / 100
          
        }
      })
      return num
    },
    remove (key) {
      const arr = ['price', 'amount', 'tax_amount', 'settlement_amount_excluding_tax', 'settlement_amount', 'contract_add_amount_without_tax', 'contract_add_amount']
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

        if (['amount_paid', 'amount_in_arrears'].includes(column)) {

          if (target.amount && target.unit_price_excluding_tax) {

            // 结算金额 不含税
            target.money_excluding_tax = parseInt(target.unit_price_excluding_tax * target.amount * 100) / 100

            // 税额
            target.tax_amount = parseInt(target.unit_price_excluding_tax * target.tax_rate * target.amount * 100) / 100

            // 结算金额 含税
            target.value_tax_total = parseInt((target.unit_price_excluding_tax * target.tax_rate / 100 + target.unit_price_excluding_tax) * 100 * target.amount) / 100

            // 开累结算金额 不含税
            target.contract_add_amount_without_tax = parseInt(target.sumObj.contract_add_amount_without_tax * 100 + target.money_excluding_tax * 100) / 100

            // 开累结算金额 含税
            target.contract_add_amount = parseInt(target.value_tax_total * 100 + target.sumObj.contract_add_amount * 100) / 100
          }

          const arr = ['amount_paid', 'amount_in_arrears']
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
        menu_id: 100,
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
        menu_id: 100,
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
        this.isrequired = true
        if (this.detailData.length === 0) {
          this.$notification['warn']({
            message: '提示',
            description: '提交时明细不能为空'
          })
          return
        }
        let break1 = false
        let colname = ''
        let keyname = ''
        this.detailData.forEach((d, i) => {
          if (d.order_number !== '合计') {
            for (var key in d) {
              if (!d[key] && d[key] !== 0) {
                if (key != 'remark') {
                  this.columns.map(item => {
                    if (item.dataIndex == key) {
                      colname = item.title
                      keyname = item.dataIndex
                    }
                  })
                  if (document.querySelector(`.${keyname + d.order_number} input`)) {
                    document.querySelector(`.${keyname + d.order_number} input`).focus()
                  } else {
                    document.querySelector(`.${keyname + d.order_number}`).focus()
                  }
                  this.$notification['warn']({
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

          if (that.params) {
            values.id = that.params.id
            values.serial_number = that.params.serial_number
            values.creator_user_id = that.params.creator_user_id
            values.creator_org_id = that.params.creator_org_id
            values.creator_org_name = that.params.creator_org_name
            values.status = that.params.status
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
          values.menu_id = 100
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code
          // values.status_description = '已保存'
          // console.log(values.create_date)
          values.create_date = values.create_date.format('YYYY-MM-DD')

          values.settlement_start_time = values.settlement_start_time ? values.settlement_start_time.format('YYYY-MM-DD') : ''
          values.settlement_end_time = values.settlement_end_time ? values.settlement_end_time.format('YYYY-MM-DD') : ''

          for (let key in values) {
            if (!values[key]) {
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
                  return handleApitalMaterial(values, 'submit').then(
                    res => {

                      that.submitLoading = false
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
            return handleApitalMaterial(values, 'update').then(
              res => {

                that.saveLoading = false
                if (res.status === '0') {
                  that.$notification['success']({
                    message: '提示',
                    description: res.msg
                  })
                  that.handleGoBack() // 返回列表页
                }
                that.isrequired = true
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
</style>
