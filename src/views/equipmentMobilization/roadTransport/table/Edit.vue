<template>
  <div>
    <!-- 基本设备需求计划信息 -->
    <a-card class="card" title="路用车进场验收单" :bordered="false">
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
                  'creator_user_name'
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
                  'create_date'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 查询车辆信息 -->

    <a-modal title="请选择" v-model="visible_name" width="100%" @ok="handleName(selectedRowKeys)">
      <s-table
        class="s-table"
        ref="tables"
        size="small"
        :customRow="dbClick"
        rowKey="id"
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

    <!-- 路用车明细 -->
    <a-card class="card" title="车辆明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        :scroll="{ x: 2500 }"
        bordered
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <div :key="col" v-if="record.editable && propFields.includes(col)">
            <a-input
              :read-only="col === 'car_name'"
              style="margin: -5px 0"
              :value="text"
              :class="col + record.code"
              :maxlength="128"
              @click="showModal(record)"
              @change="e => handleChange(e.target.value, record.key, col)"
              :placeholder="tableTitle[i]"
            />
          </div>
          <a-input
            :key="col"
            :maxlength="128"
              :class="col + record.code"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="tableTitle[i]"
            @change="e => handleChange(e.target.value, record.key, col)"
          />

          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="tableTitle[i]"
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
              :class="col + record.code"
            :value="text"
            :placeholder="tableTitle[i]"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
              :class="col + record.code"
            :max="999999999"
            :min="0"
            :step="col === 'num' ? 1 : 1"
            :placeholder="tableTitle[i]"
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
                <a title="删除">
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
      >新增车辆明细</a-button>
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
          :data="{model:'B005', type: 0, menu_id: 37}"
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
              <a @click="download(record)" title="下载">
                <a-icon type="cloud-download" />
              </a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="removeAttachment(record)">
                <a title="删除">
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
import * as $ from 'jquery'
if (!window.jQuery) {
  window.jQuery = $
}
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { STable } from '@/components'
import { handlePurchase, submitRequire, queryone, getQueryCarNo } from '@/api/equipmentMobilization/roadTransport'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, formStatus, queryAllContract } from '@/api/equipmentMobilization/upload'
import { formStatusLabel, formStatusArray } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
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
      params: {},
      selectKey: '',
      tableData: {},
      selectedRowKeys: [],
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
      sizeable: true,
      visible_name: false,
      number: '',
      activeTabKey: 'attach',
      fileList: [],
      selectData: {},
      selectFields: [],
      form: this.$form.createForm(this),
      tableTitle: [
        '序号',
        '车辆名称',
        '规格型号',
        '车号',
        '数量',
        '供应商名称',
        '扣车时间',
        '计划还车时间',
        '厂段修到期时间',
        '走行部分',
        '制动部分',
        '车钩缓冲',
        '车体部分',
        '其他',
        '验收人',
        '备注',
      ],
      customFilterColumn: {},
      propFields: ['car_name'],
      inputFields: ['car_no', 'running', 'braking', 'coupling_buffer', 'car_body', 'other', 'check_person', 'remark'],
      datePickerFields: ['buckle_time1', 'planned_return_time1', 'expire1'],
      numberFields: [],
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
      selectedRows: [],
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
          dataIndex: 'code',
          key: 'code',
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '车辆名称',
          dataIndex: 'car_name',
          key: 'car_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'car_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'supplier_name' }
        },
        {
          title: '车号',
          dataIndex: 'car_no',
          key: 'car_no',
          align: 'center',
          with: '150px',
          scopedSlots: { customRender: 'car_no' }
        },
        {
          title: '扣车时间',
          dataIndex: 'buckle_time1',
          key: 'buckle_time1',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'buckle_time1' }
        },
        {
          title: '计划还车时间',
          dataIndex: 'planned_return_time1',
          key: 'planned_return_time1',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'planned_return_time1' }
        },
        {
          title: '厂段修到期时间',
          dataIndex: 'expire1',
          key: "expire1",
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'expire1' }
        },
        {
          title: '主要技术性能 ',
          key: 'reply',
          align: 'center',
          children: [
            {
              title: '走行部分',
              dataIndex: 'running',
              key: "running",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'running' }
            },
            {
              title: '制动部分',
              dataIndex: 'braking',
              key: "braking",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'braking' }

            },
            {
              title: '车钩缓冲',
              dataIndex: 'coupling_buffer',
              key: "coupling_buffer",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'coupling_buffer' }
            },
            {
              title: '车体部分',
              dataIndex: 'car_body',
              key: "car_body",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'car_body' }
            }
          ]
        },
        {
          title: '其他',
          dataIndex: 'other',
          key: 'other',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'other' }
        },
        {
          title: '验收人',
          dataIndex: 'check_person',
          key: 'check_person',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'check_person' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: ['code', 'car_name', 'spec', 'car_no', 'supplier_name', 'buckle_time1', 'planned_return_time1', 'expire1', 'running', 'braking', 'coupling_buffer', 'car_body', 'other', 'check_person', 'remark'],
      attachColumns: [
        // {
        //   title: '序号',
        //   dataIndex: 'id_in_module',
        //   key: 'id_in_module'
        // },
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
        return queryAllContract({ pageNum: 1, pageSize: 100 }).then(res => {
          // 索引
          console.log('aaaa', res)
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          console.log(res)
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
    // let idObj = this.$route.name
    // let obj = {}
    // obj[idObj] = this.params
    // if (this.params.id) this.$store.commit('SET_EDIT_ID', obj)
    // this.params = this.$store.state.edit_id[idObj] || this.params

    this.$nextTick(() => {
      this.loadEditInfo(this.params)
    })
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
          title: '车辆名称',
          dataIndex: 'car_name',
          scopedSlots: {
            customRender: 'car_name'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          scopedSlots: {
            customRender: 'spec'
          }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          // width: '200px',
          scopedSlots: {
            customRender: 'customRender'
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
    }
  },
  methods: {
    ...mapGetters(['nickname']),
    
    // 双击确定
    dbClick (record) {
      return {
        on: {
          dblclick: (e) => {
            console.log(record, '----', e)
            this.selectedRows[0] = record
            this.handleName(record.id)
          }
        }
      }
    },

    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
    },

    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('roadTransportList')
    },

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
    showModal (record) {
      this.visible_name = true
      this.$refs.tables && this.refresh('tables')
      this.selectKey = record.key
    },
    handleName (val) {
      this.visible_name = false
      // const arr = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
      const arr = this.selectedRows
      console.log(val, '---', arr)
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.detailData = this.detailData.map((x, i) => {
        if (x.key === this.selectKey) {
          x.car_name = arr[0].car_name
          x.spec = arr[0].spec
          x.supplier_name = arr[0].supplier_name
        }
        return x
      })
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    async loadEditInfo (data) {

      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {

        await queryone({ id: data.id, menu_id: 37 }).then(res => {
          this.number = true
          console.log(res)
          data = res.responseObject
          // this.serial_number = res.responseObject.serial_number
          this.detailData = res.responseObject.details.map((d, i) => {
            // d.equipment_code ='1111'
            d.buckle_time ? (d.buckle_time1 = moment(d.buckle_time)) : null
            d.planned_return_time ? (d.planned_return_time1 = moment(d.planned_return_time)) : null
            d.expire ? (d.expire1 = moment(d.expire)) : null
            d.code = i + 1
            d.key = d.id + ''
            d.editable = true
            d.isNew = true
            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
        })
        // getAttachments({ module: modules.roadTransport, id_in_module: data.id }).then(res => {
        //   this.fileList = res.responseList.map(attachment => {
        //     attachment.upload_user_id = attachment.upload_user_id.toString()
        //     attachment.file_size = attachment.file_size.toString()
        //     attachment.uid = attachment.id.toString()
        //     attachment.status = 'done'
        //     attachment.url = ''
        //     attachment.key = attachment.id.toString()
        //     attachment.name = attachment.file_name
        //     attachment.size = attachment.file_size.toString()
        //     attachment.file_size = attachment.file_size.toString()
        //     attachment.upload_user_id = attachment.upload_user_id.toString()
        //     attachment.username = attachment.upload_user_name
        //     return attachment
        //   })
        // })

        const formData = pick(data, ['create_date', 'pro_unit', 'creator_user_name', 'serial_number'])
        formData.create_date = moment(data.create_date)
        console.log('formData', formData)
        this.form.setFieldsValue(formData)
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
    },
    newDevice () {
      const length = this.detailData.length
      if (length && !this.detailData[length - 1].car_name) return this.noSelect('请填完上一条数据')
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        car_name: '',
        spec: '',
        car_no: '',
        supplier_name: '',
        buckle_time1: null,
        planned_return_time1: null,
        expire1: null,
        running: '',
        braking: '',
        coupling_buffer: '',
        car_body: '',
        other: '',
        check_person: '',
        remark: '',
        editable: true,
        isNew: true,
      });
    },
    remove (key) {
      const newData = this.detailData.filter(item => item.key !== key)
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

        // if (['estimated_price', 'number'].includes(column)) {
        //   target.amount = (target.estimated_price * target.number).toFixed(2)

        //   this.form.setFieldsValue({
        //     total_amount: newData.reduce((total, d) => {
        //       return total + Number(d.amount)
        //     }, 0)
        //   })
        // }
        this.detailData = newData
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        type: 0,
        menu_id: 37,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 附件删除
    removeAttachment (record) {
      const data = {
        type: 0,
        menu_id: 37,
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
      const { form: { validateFields } } = this
      const that = this
      
      if (type === 'submit') {
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
          if (d.code !== '合计') {
            for (var key in d) {
              if (!d[key] && d[key] !== 0) {
                if (key != 'remark' && key != 'reply') {
                  this.columns.map(item => {
                    if (item.dataIndex == key) {
                      colname = item.title
                      keyname = item.dataIndex
                    }
                    if (item.children) {
                      item.children.map(c => {
                        if (c.dataIndex == key) {
                          colname = c.title
                          keyname = c.dataIndex
                        }
                    })}
                    })
                  if (document.querySelector(`.${keyname + d.code} input`)) {
                    document.querySelector(`.${keyname + d.code} input`).focus()
                  } else if (document.querySelector(`.${keyname + d.code}`)) {
                    document.querySelector(`.${keyname + d.code}`).focus()
                  }
                  this.$notification['warn']({
                    message: '提示',
                    description: `提交时第${d.code}行：${colname}不能为空`
                  })
                  console.log(key, this.detailData, '221')
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

        values.details = that.detailData.map(x => {
          for (let key in x) {
            const isTrue = x[key] === null || x[key] === undefined || x[key] === ''
            if (isTrue) {
              delete x[key]
            }
          }
          x.expire1 && (x.expire = x.expire1.format('YYYY-MM-DD'))
          x.planned_return_time1 && (x.planned_return_time = x.planned_return_time1.format('YYYY-MM-DD'))
          x.buckle_time1 && (x.buckle_time = x.buckle_time1.format('YYYY-MM-DD'))
          return x
        })
        values.files = that.fileList

        if (that.params.id) {
          values.creator_org_id = that.creator_org_id
          values.equipment_code = that.params.equipment_code
          values.equipment_code = that.equipment_code
          values.id = that.params.id
          values.serial_number = that.params.serial_number
          values.creator_user_id = that.params.creator_user_id
          // values.creator_org_name = that.params.creator_org_name
          values.flag = 2
          values.creator_org_id = that.params.creator_org_id
          values.status = that.params.status
        } else {
          // 联动参数
          // values.remark = '备注'
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          // values.equipment_code = '111'
          values.flag = 1
        }
        values.creator_org_id = that.$store.state.menu_key
        values.creator_org_name = that.$store.state.org_name
        values.pro_unit_code = that.$store.state.pro_unit_code
        values.menu_id = 37
        // 日期格式转换
        values.create_date && (values.create_date = values.create_date.format('YYYY-MM-DD'))
        for (let key in values) {
          const isTrue = values[key] === null || values[key] === undefined || values[key] === ''
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
                document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
                that.submitLoading = true
                return handlePurchase(values, 'submit').then(res => {
                  that.submitLoading = false
                  console.log(res)
                  if (res.status === '0') {
                    that.$notification['success']({
                      message: '提示',
                      description: res.msg
                    })
                    that.handleGoBack() // 返回列表页
                  }
                }).catch(err => {
                  that.$notification['warn']({
                    message: '提示',
                    description: res.msg || '提交失败'
                  })
                  that.submitLoading = false
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
          return handlePurchase(values, 'update').then(res => {
            that.saveLoading = false
            console.log(res)
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
        console.log(file)
        if (file.status === 'error') this.$message.error('上传文件过大或不支持该格式的文件！')
        else if (file.response && file.response.status === '0') {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
          file.id_in_module = file.length
          file.key = file.uid
          file.module = modules.siteAccept
          file.file_size = file.size.toString()
          file.upload_user_id = '123' // 待修改
          file.upload_user_name = this.nickname()
          file.remark = '附件'
          file.model = model.siteAccept
          file.type = 0
        }
        return file.status !== 'error'
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
