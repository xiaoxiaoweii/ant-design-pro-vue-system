<template>
  <div>
    <a-card class="card" title="对外付款申请管理" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6" v-if="serialable">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  {
                    initialValue: this.recording.serial_number
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="编制单位" v-bind="formItemLayout" default-value="0">
                <a-input
                v-decorator="[
                'compile_company',
                {
                  rules: [{ required: true, message: '请输入编制单位' }] 
                }
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                style="width: 100%"
                v-decorator="[
                  'compile_person',
                  {
                    rules: [{  message: '请输入编制人' }] 
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                style="width: 100%"
                v-decorator="[
                  'compile_date',
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

    <!-- 明细 -->
    <a-card class="card" title="明细">
      <a-table
        bordered
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
        class="line-table"
        :scroll="{ x: 2300 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">

          <div
            :key="col+'1'"
            v-if="record.editable && popconfirmFields.includes(col)"
          > 
            <a-modal
              title="请选择"
              v-model="visible"
              width="80%"
              @ok="handleOk(selectedRowKeys, col, record.key, record)"
            >
              <a-row :gutter="8">
                <a-col :span="5">
                  <!-- <s-tree
                    :dataSource="dicTree"
                    :openKeys.sync="openKeys"
                    @click="handleClick"
                    :defaultSelectedKeys="['key-01']"
                    :search="true"
                    ></s-tree> -->
                </a-col>
                <a-col :span="19">
                  <s-table
                    ref="tables"
                    size="small"
                    rowKey="id"
                    bordered
                    :columns="demo"
                    :data="loadData"
                    :alert="false"
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
                  >
                    <span
                      slot="serial"
                      slot-scope="text, record, index"
                    >{{ index + 1 }}</span>
                    <span
                      slot="is_valid"
                      slot-scope="text"
                    >{{ text | valid }}</span>
                  </s-table>
                </a-col>
              </a-row>
            </a-modal>
          </div>

          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            
            :placeholder="columnTitle[i]"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input
            :key="col"
            v-else-if="record.editable && tanchukuang.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @click="showModal"
            :placeholder="columnTitle[i]"
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
              style="width:100px"
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
            :key="col"
            :value="text"
            :min="0"
            :placeholder="columnTitle[i]"
            :step="col === 'number' ? 1 : 1"
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
      >新增路用车使用费结算</a-button>
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
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'C008'}"
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
import STree from '@/components/Tree/Tree'
import { mixin, mixinDevice } from '@/utils/mixin'
import { STable } from '@/components'
import {getDeviceList,handlePayment} from '@/api/settlement/ExternalPayment'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
import { mapGetters } from 'vuex'
import { getDictionaryTree, getDictionaryEnum } from '@/api/dictionary'
const FileSaver = require('file-saver')

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    STable,
    STree
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    return {
      visible:false,
      popconfirmFields: ['contract_number'],
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
       business_type:[
        {
        dic_enum_name: '租赁',
        dic_enum_id: 1
       },
       {
        dic_enum_name: '维修',
        dic_enum_id: 2
       },
       {
        dic_enum_name: '采购',
        dic_enum_id: 3
       },
       {
        dic_enum_name: '安拆',
        dic_enum_id: 4
       }
       ]
      },
      columnTitle: [
        '业务类型',
        '供应商名称',
        '合同编号',
        '合同名称',
        '收款账户名称',
        '收款账号',
        '开户行',
        '资金计划流水号',
        '本次申请金额(元)',
        '开累支付金额(元)',
        '累计计价金额(元)',
        '结算金额含税(元)',
        '付款比例',
        '备注'
      ],
      selectFields: [
       'business_type'
      ],
      serial_number: '',
      inputFields: [
       'supplier_name',
       'contract_number',
       'contract_name',
       'payment_account_name',
       'receiver_account',
       'opening_bank',
       'funding_plan_serial',
       'remark'
      ],
      tanchukuang:[],
      rangePickerFields: [],
      datePickerFields: [
      ],
      numberFields: [
      'applications_amount',
      'payment_amount',
      'accumulated_valuation_amount',
      'settlement_amount_tax',
      'payment_ratio'
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
      queryParam:{},
      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          width: '60px',
          align: 'center',
          fixed: 'left',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '业务类型',
          dataIndex: '业务类型',
          align: 'center',
          width:'150px',
          scopedSlots: { customRender: 'business_type' }
        },
        {
          title:'供应商名称',
          dataIndex:'supplier_name',
          align:'center',
          scopedSlots:{customRender:'supplier_name'}  
        },
        {
          title: '合同编号',
          dataIndex: 'contract_number',
          align: 'center',
       
          scopedSlots: { customRender: 'contract_number' }
        },
        {
          title: '合同名称',
          dataIndex: 'contract_name',
          align: 'center',
          scopedSlots: { customRender: 'contract_name' }
        },
        {
          title: '收款账户名称',
          dataIndex: 'payment_account_name',
          align: 'center',
          scopedSlots: { customRender: 'payment_account_name' }
        },
        {
          title: '收款账号',
          dataIndex: 'receiver_account',
          align: 'center',
          scopedSlots: { customRender: 'receiver_account' }
        },
        {
          title: '开户行',
          dataIndex: 'opening_bank',
          align: 'center',
          scopedSlots: { customRender: 'opening_bank' }
        },
        {
          title: '资金计划流水号',
          dataIndex: 'funding_plan_serial',
          align: 'center',
          scopedSlots: { customRender: 'funding_plan_serial' }
        },
        {
          title: '本次申请金额(元)',
          dataIndex: 'applications_amount',
          align: 'center',
          width:'150px',
          scopedSlots: { customRender: 'applications_amount' }
        },
        {
          title:'开累支付金额(元)',
          dataIndex:'payment_amount',
          align:'center',
          width:'150px',
          scopedSlots:{ customRender:'payment_amount'}
        },
        {
          title: '累计计价金额(元)',
          dataIndex: 'accumulated_valuation_amount',
          align: 'center',
          width:'150px',
          scopedSlots: { customRender: 'accumulated_valuation_amount' }
        },
        {
          title: '结算金额含税(元)',
          dataIndex: 'settlement_amount_tax',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'settlement_amount_tax' }
        },
        {
          title:'付款比例',
          dataIndex:'payment_ratio',
          align:'center',
          scopedSlots:{customRender:'payment_ratio'}
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
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: [
       'business_type',
       'supplier_name',
       'contract_number',
       'contract_name',
       'payment_account_name',
       'receiver_account',
       'opening_bank',
       'funding_plan_serial',
       'applications_amount',
       'payment_amount',
       'accumulated_valuation_amount',
       'settlement_amount_tax',
       'payment_ratio',
       'remark'
      ],
      demo: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '路用车名称',
          dataIndex: 'car_name'
        },
        {
          title: '规格型号',
          dataIndex: 'spec'
        },
        {
          title: '数量',
          dataIndex: 'num'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        }
      ],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'name',
          key: 'attachname'
        },
        {
          title: '附件大小',
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: '上传人',
          dataIndex: 'username',
          key: 'username'
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
      dicTree: [],
      openKeys:[],
      tableData:[],
      loadData: parameter => {
        return getDictionaryEnum(Object.assign(parameter, this.queryParam))
          .then(res => {
            this.tableData =res.responsePageInfo.list
            return res.result || { pageSize: 15, pageNo: 1, totalPage: 1, totalCount: res.responsePageInfo.list.length, data: res.responsePageInfo.list }
          })
      }
    }
  },
  computed: {
    date() {
      return moment()
    },
    uploadUrl() {
      return uploadUrl
    },
    formStatus() {
      return formStatus
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  // created () {
  //   const tree = {
  //     key: 'key-01',
  //     title: '字典类型',
  //     icon: 'folder',
  //     children: []
  //   }
  //   getDictionaryTree().then(res => {
  //     tree.children = res.responsePageInfo.list.map(d => {
  //       d.key = d.vehicle_check_id
  //       d.title = d.car_name
  //       d.icon = null
  //       return d
  //     })
  //     this.openKeys = [tree.children[0].key]
  //     this.queryParam = {
  //       vehicle_check_id: tree.children[0].key
  //     }
  //     this.dicTree = [tree]
  //   })
  // },
  mounted() {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    start() {
      this.loading = true
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false
        this.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    
    handleGoBack() {
      this.$emit('onGoBack')
    },
    showModal() {
      this.visible = true
    },
    // handleClick (e) {
    //   this.queryParam = {
    //     vehicle_check_id: e.key
    //   }
    //   console.log(this.$refs.tables[0])
    //   this.$refs.tables[0].refresh(true)
    // },
    handleGetInfo() {},
    handleOk(val, col, key) {
      this.visible = false
      const arr = this.tableData.filter(item => item.id == val[0])
      console.log(val, '---', col, '---', key, '---', arr)
      this.selectedRowKeys = []
      this.selectedRows = []
      if (val.length > 1) return this.noSelect()

      console.log(this.detailData.filter(x => x.key == key))
      this.detailData = this.detailData.map((x, i) => {
        if (x.key == key) {
          x.vehicle_name = arr[0].car_name
          x.specifications = arr[0].spec
          x.amount = arr[0].num
          x.remark=arr[0].remark
        }
        return x
      })
    },
    loadEditInfo(data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        this.serialable = true

        getDeviceList({ id: data.id }).then(res => {
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
            'serial_number',
            'compile_person',
            'compile_date',
            'compile_company'
        ])
        formData.compile_date = moment(data.compile_date)
         console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice() {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        order_number: length + 1,
        editable: true,
        isNew: true,
        contract_number:'',
        business_type:'',
        supplier_name:'',
        contract_name:'',
        payment_account_name:'',
        receiver_account:'',
        opening_bank:'',
        applications_amount:'0',
        payment_amount:'0',
        accumulated_valuation_amount:'0',
        settlement_amount_tax:'0',
        payment_ratio:'',
        remark:''
      })
    },
    remove(key) {
      const newData = this.detailData.filter(item => item.key !== key)
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

        if (['unit_price_excluding_tax', 'amount','settlement_days'].includes(column)) {
          target.amount_without_tax=(target.unit_price_excluding_tax*target.amount*target.settlement_days).toFixed(2)
        }
        if(['amount_without_tax','tax_rate'].includes(column)){
          target.settlement_amount_tax=(target.amount_without_tax*(1+target.tax_rate/100)).toFixed(2)
        }
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
        ]
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment(record) {
      delAttachment({
        filePath: record.file_path,
        fileName: record.file_name,
        id: record.id
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

    // 购置单保存或提交
    saveOrSubmit(type) {
      const {
        form: { validateFields }
      } = this
      const that = this

      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk() {
              console.log('这个是recording......',that.recording)
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList
              if (that.recording) {
                values.id = that.recording.id
                values.serial_number = that.recording.serial_number
               //values.status = that.recording.status
                values.flag = 2
              } else {
                // 联动参数
                values.flag = 1
              }         
              values.status_description = '已保存'
              values.compile_date = values.compile_date.format('YYYY-MM-DD')
              values.compile_person= values.compile_person==undefined?'':values.compile_person
              return handlePayment(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(
                res => {
                  type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)

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
            onCancel() {}
          })
        }
      })
    },
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 文件上传
    fileChange(info) {
      let fileList = [...info.fileList]

      fileList = fileList.map(file => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        file.module = modules.externalPayment
        file.file_size = file.size
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'

        return file
      })

      this.fileList = fileList
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
/deep/ .ant-select-selection--single{
    width:100px
}
</style>
