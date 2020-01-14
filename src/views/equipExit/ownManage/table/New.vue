<template>
  <div>
    <!-- 基本表单信息 -->
    <a-card class="card" title="自有设备鉴定单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                read-only
                v-decorator="[ 'pro_unit', { initialValue: $store.state.pro_unit } ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                read-only
                disabled
                v-decorator="[ 'creator_user_name', { initialValue: nickname } ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="项目名称" v-bind="formItemLayout">
              <a-input
                disabled
                read-only
                v-decorator="[ 'creator_org_name', { initialValue: $store.state.org_name }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备名称" v-bind="formItemLayout">
              <a-input
                read-only
                @click="() => $refs.equipmentModal.add()"
                placeholder="设备名称"
                v-decorator="[ 'name', { rules: [{required: isrequired, message: '请选择设备'}] } ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备编码" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="[ 'equip_code' ]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理号码" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="[ 'manage_code' ]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="规格型号" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="[ 'spec' ]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="[ 'unit' ]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生产厂家" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="[ 'manufacturer' ]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="原值(元)" v-bind="formItemLayout">
              <a-input-number
                disabled
                style="width: 100%;"
                :min="0"
                :step="0.01"
                placeholder="自动生成"
                v-decorator="[
                  'original_value'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="净值(元)" v-bind="formItemLayout">
              <a-input-number
                disabled
                style="width: 100%;"
                :min="0"
                :step="0.01"
                placeholder="自动生成"
                v-decorator="[
                  'net_value',
                  { rules: [{ required: isrequired, message: '请输入净值(元)' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="购置日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width: 100%;"
                v-decorator="[
                  'purchase_date'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="出厂日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width: 100%;"
                v-decorator="[
                  'prod_date'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="折旧年限" v-bind="formItemLayout">
              <a-select
                v-decorator="[
                  'depreciation_period',
                  { rules: [{ required: isrequired, message: '请选择折旧年限' }] }
                ]"
              >
                <a-select-option
                  v-for="item in depreciationOptions"
                  :key="item.title"
                  :value="item.value"
                >{{ item.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="使用单位" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="['use_org']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="产权单位" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="['owner_org']" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="鉴定日期" v-bind="formItemLayout">
              <a-date-picker
                style="width: 100%;"
                v-decorator="[
                  'check_date',
                  { initialValue: date, rules: [{required: isrequired, message: '请选择鉴定日期'}] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所在地" v-bind="formItemLayout">
              <a-input disabled placeholder="自动生成" v-decorator="['location']" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- file upload and approval record-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <!-- 验收结果 -->
      <div class="accept" v-if="activeTabKey === 'accept'">
        <a-table
          ref="table"
          :columns="acceptColumns"
          :pagination="false"
          :dataSource="acceptData"
          :loading="memberLoading"
          rowKey="key"
          :scroll="{ x: 1100 }"
          bordered
        >
          <template v-for="(col) in acceptFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              :maxlength="1024"
              v-if="inputFields.includes(col)"
              placeholder="评价说明"
              style="margin: -5px 0"
              :value="text"
              @change="e => accept_handleChange(e.target.value, record.key, col)"
            />
            <a-radio-group
              :key="col"
              :options="options"
              v-if="radioFields.includes(col)"
              :value="text"
              @change="e => accept_handleChange(e.target.value, record.key, col)"
            >
              <a-radio
                v-for="item in queryLevel"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}</a-radio>
            </a-radio-group>
          </template>
        </a-table>
        <div v-if="acceptData.length > 0">
          <a-table
            :columns="acceptColumnsSum"
            :dataSource="sumData"
            :pagination="false"
            :loading="memberLoading"
            :showHeader="false"
            rowKey="key"
          >
            <template v-for="(col, i) in sumFields " :slot="col" slot-scope="text, record">
              <a-input
                :key="col"
                :maxlength="1024"
                v-if="['check_remark'].includes(col)"
                style="margin: -5px 0"
                :value="text"
                placeholder="结论描述"
                @change="e => sum_handleChange(e.target.value, record.key, col)"
              />
              <a-radio-group
                :key="col"
                v-if="radioFields.includes(col)"
                :options="options"
                :value="text"
                @change="e => sum_handleChange(e.target.value, record.key, col)"
              >
                <a-radio
                  v-for="item in queryLevel"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</a-radio>
              </a-radio-group>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 附件上传 -->
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :withCredentials="true"
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :beforeUpload="beforeUploaddata"
          :data="{ model: mod, type: 0 ,menu_id: menuCode }"
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
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 222 : 80}px)` : '100%'}"
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
    <equipment-modal ref="equipmentModal" :queryEquip="queryEquip" @ok="handleSelectEquipment" />
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handleOwnEquipmentOut, queryEquip, queryEquipDetail } from '@/api/equipExit/own'
import { uploadUrl, EXIT_EQUIP_PLAN_Modules, model, getAttachments, downloadAttachment, delAttachment, formStatus } from '@/api/equipExit/upload'
import { queryProjectName } from '@/api/common'
import { getDictionaryEnum } from '@/api/system/dictionary'
import equipmentModal from '@/views/equipExit/modules/Equipment'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
let temp = {} // 当前重复的值,支持多列
const mergeCells = (text, array, columns) => {
  let i = 0
  if (temp[columns] !== text) {
    temp[columns] = text
    array.forEach(item => {
      if (item.check_item === temp[columns]) {
        i += 1
      }
    })
  }
  return i
}

const queryLevel = [
  {
    label: '良好',
    value: '良好'
  },
  {
    label: '一般',
    value: '一般'
  },
  {
    label: '较差',
    value: '较差'
  },
]
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    equipmentModal
  },
  data () {
    return {
      owner_org_code: '',
      isrequired: true,
      queryLevel: queryLevel,
      queryEquip: queryEquip,
      equipSupplyList: [], // 设备供应商列表
      myEquipment_code: '',
      input1: '',
      input2: '',
      params: {},
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      handleData: {},
      handleTreeData: {},
      filteredInfo: null,
      customFilterColumn: {},
      tabList: [
        {
          key: 'accept',
          tab: '验收记录'
        },
        {
          key: 'attach',
          tab: '附件上传'
        }
      ],
      tableData: {},
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      sizeable: false,
      activeTabKey: 'accept',
      fileList: [],
      selectData: { unit: [] },
      detailFields: ['manage_code', 'name', 'spec', 'contract_no', 'contract_end_date', 'remark'],
      selectFields: [],
      inputFields: ['name', 'remark'],
      datePickerFields: ['contract_end_date'],
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
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      expandedRowKeys: [],
      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          key: 'manage_code',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'manage_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_no',
          key: 'contract_no',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'contract_no' }
        },
        {
          title: '合同终止日期',
          dataIndex: 'contract_end_date',
          key: 'contract_end_date',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'contract_end_date' }
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
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
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
      acceptData: [],
      acceptColumns: [
        {
          title: '序号',
          dataIndex: 'key',
          key: 'key'
        },
        {
          title: '验收项目',
          dataIndex: 'check_item',
          key: 'check_item',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = mergeCells(row.check_item, this.acceptData, 'check_item')

            return obj
          }
        },
        {
          title: '验收内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: { customRender: 'result' }
        },

        {
          title: '评价说明',
          width: '400px',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' }
        }
      ],

      sumData: [
        {
          key: '1',
          code2: '验收总结论：',
          check_item1: '结论描述：',
          result: '良好',
          check_remark: '备注',
          editable: true,
          isNew: true
        }
      ],
      sumFields: ['code2', 'all_total', 'result', 'check_item1', 'check_remark'],
      acceptColumnsSum: [
        {
          title: '序号',
          dataIndex: 'code2',
          key: 'code2',
          width: '300px',
          align: 'center'
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '项目',
          dataIndex: 'check_item1',
          key: 'check_item1',
          align: 'center'
        },
        {
          title: '评价说明',
          width: '400px',
          dataIndex: 'check_remark',
          key: 'check_remark',
          scopedSlots: { customRender: 'check_remark' }
        }
      ],
      acceptFields: ['code', 'check_item', 'result', 'remark'],
      radioFields: ['result'],
      errors: [],
      currentRecord: {},
      depreciationOptions: [
        {
          title: '1年',
          value: 1
        },
        {
          title: '5年',
          value: 5
        },
        {
          title: '10年',
          value: 10
        },
        {
          title: '15年',
          value: 15
        },
        {
          title: '20年',
          value: 20
        }
      ],
      useOrgList: []
    }
  },
  computed: {
    ...mapGetters(['nickname', 'userId']),
    mod () {
      return EXIT_EQUIP_PLAN_Modules.ownManage
    },
    uploadUrl () {
      return uploadUrl
    },
    formStatus () {
      return formStatus
    },
    date () {
      return new moment()
    },
    menuCode () {
      return this.$route.query.menuCode
    },
    scopeCode () {
      return this.$store.state.menu_key
    }
  },
  methods: {
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
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('haveExitList')
    },
    newDevice () {
      const length = this.detailData.length
      if (length && !this.detailData[length - 1].name) return this.noSelect('请填完上一条数据！')
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        manage_code: '',
        name: '',
        spec: '',
        contract_no: '',
        contract_end_date: new moment(),
        remark: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.detailData.filter(item => item.key !== key)
      newData.forEach((x, i) => {
        x.code = i + 1
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

        this.detailData = newData
      }
    },
    handleSelectEquipment (equipment) {
      if (equipment) {
        this.owner_org_code = equipment.accept_from_code
        equipment = {
          ...equipment,
          owner_org: equipment.accept_from,
          purchase_date: equipment.purchase_date && moment(equipment.purchase_date),
          prod_date: equipment.production_time && moment(equipment.production_time),
        }
        this.currentRecord = equipment

        const formData = pick(equipment, ['manage_code', 'manufacturer', 'net_value', 'original_value', 'equip_code', 'unit', 'purchase_date', 'prod_date', 'use_org', 'owner_org', 'location'])
        formData.name = equipment.equip_name
        formData.spec = equipment.specification
        // formData.purchase_date = new moment(equipment.in_date)
        // formData.prod_date = new moment(equipment.out_date)
        this.form.setFieldsValue(formData)

        queryEquipDetail({ scope_code: this.$store.state.menu_key, manage_code: equipment.manage_code }).then(res => {
          if (res.status === '0') this.acceptData = res.responseList.map((x, i) => {
            x.key = i + 1
            return x
          })
        })
      }
    },
    selectEquipment () {
      this.$refs.equipmentModal.add()
    },
    accept_handleChange (value, key, column) {
      // console.log(key)
      const newData = [...this.acceptData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value

        this.acceptData = newData
      }
    },
    sum_handleChange (value, key, column) {
      const newsumData = [...this.sumData]
      const target_sum = newsumData.filter(item => key === item.key)[0]
      if (target_sum) {
        target_sum[column] = value
        this.sumData = newsumData
      }
    },
    name_handleChange (value, key, column) {
      const newnameData = [...this.nameData]
      const target_name = newnameData.filter(item => key === item.key)[0]
      if (target_name) {
        target_name[column] = value
        this.nameData = newnameData
      }
    },
    equip_handleChange (value, key, column) {
      const newequipData = [...this.equipData]
      const target_equip = newequipData.filter(item => key === item.key)[0]
      if (target_equip) {
        target_equip[column] = value
        this.equipData = newequipData
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
        menu_id: this.menuCode
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
        menu_id: this.menuCode
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
      const { form: { validateFields } } = this
      const that = this
      if (type === 'save') {
        this.isrequired = false
      } else {
        if (this.detailData.length === 0) {
          this.$notification['warn']({
            message: '提示',
            description: '提交时明细不能为空'
          })
          return
        }
        let break1 = false
        let colname = ''
        this.detailData.forEach((d, i) => {
          if (d.code !== '合计') {
            for (var key in d) {
              if (!d[key] && d[key] !== 0) {
                if (key != 'remark') {
                  this.columns.map(item => {
                    if (item.dataIndex == key) colname = item.title
                  })
                  this.$notification['warn']({
                    message: '提示',
                    description: `提交时第${d.code}行：${colname}不能为空`
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
          values.owner_org_code = that.owner_org_code
          values.check_date && (values.check_date = values.check_date.format('YYYY-MM-DD'))
          values = Object.assign({ scope_code: this.scopeCode, menu_id: this.menuCode },
            values, {
            files: that.fileList,
            details: that.acceptData,
            check_result: that.sumData[0].result,
            check_remark: that.sumData[0].check_remark,
            purchase_date: values.purchase_date && values.purchase_date.format('YYYY-MM-DD'),
            prod_date: values.prod_date && values.prod_date.format('YYYY-MM-DD'),
            pro_unit_code: that.$store.state.pro_unit_code,
            creator_org_id: that.scopeCode,
            equipment_category_code: that.currentRecord['equipment_category_code']
          })
          for (let key in values) {
            if (!values[key]) {
              delete values[key]
            }
          }
          if (type === 'save') {
            type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
            if (type === 'submit') {
              values.flag = 1
            }

            // TODO: 编制单位,工程名称？
            return handleOwnEquipmentOut(type === 'save' ? 'create' : 'submit',
              values).then(res => {
                type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)
                if (res.status === '0') {
                  that.$notification['success']({
                    message: '提示',
                    description: res.msg
                  })
                  that.handleGoBack() // 返回列表页
                }
              })
          }
          if (!err) {
            this.$confirm({
              title: '提示',
              content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
              onOk: () => {
                type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
                if (type === 'submit') {
                  values.flag = 1
                }

                // TODO: 编制单位,工程名称？
                return handleOwnEquipmentOut(type === 'save' ? 'create' : 'submit',
                  values).then(res => {
                    type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)
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
        file.key = file.uid
        file.module = this.mod
        file.file_size = file.size
        file.fileSize = (file.size / 1024).toFixed(0)
        file.upload_user_id = this.userId
        file.upload_user_name = this.nickname
        file.remark = '附件'
        file.type = 0

        return file
      })

      this.fileList = fileList
    },
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.picList = []
      this.acceptData = []
    },
    filterOrg (org) {
      org.key = org.id
      org.value = org.name.toString() //TODO: 使用单位取值是名称？
      org.title = org.name
      if (org.children)
        org.children = org.children.map(sonOrg => {
          return this.filterOrg(sonOrg)
        })
      return org
    },
    queryProjectName () {
      queryProjectName({ creator_org_id: this.scopeCode }).then(res => {
        if (res.status === '0')
          this.useOrgList = res.responseObject.map(org => {
            return this.filterOrg(org)
          })
      })
    }
  },
  activated () {
    this.queryProjectName()
    this.resetForm()
  },
  mounted () {
    this.queryProjectName()
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
/deep/ .ant-select-selection {
  text-overflow: clip !important;
  overflow: visible !important;
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
/deep/ .line-table tr td:nth-child(7) {
  font-size: 0 !important;
}
// /deep/ .line-table tr td:nth-child(2) {
//   font-size: 0 !important;
// }

/deep/div.ant-col-18 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/deep/ div.ant-col-18 > div.ant-row > div.ant-col-sm-2 {
  width: 80px;
}

/deep/ div.ant-col-8 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-8 > div.ant-row > div.ant-col-sm-8 {
  width: 80px;
}
/deep/ div.ant-col-19 {
  width: 70%;
}
/deep/ div.ant-col-5 {
  width: 30%;
}
</style>
