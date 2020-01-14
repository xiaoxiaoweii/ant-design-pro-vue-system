<template>
  <div>
    <a-card class="card" title="材料配置计划" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="编制单位" v-bind="formItemLayout" default-value="0">
              <a-select
                placeholder="请选择编制单位"
                v-decorator="[
                  'creator_org_name',
                  {
                    rules: [{ required: true, message: '请选择编制单位' }]
                  }
                ]"
              >
                <a-select-option value="财务部">财务部</a-select-option>
                <a-select-option value="采购部">采购部</a-select-option>
                <a-select-option value="业务部">业务部</a-select-option>
                <a-select-option value="营销部">营销部</a-select-option>
                <a-select-option value="工程部">工程部</a-select-option>
                <a-select-option value="合同部">合同部</a-select-option>
              </a-select>
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
                style="width: 100%"
                v-decorator="[
                  'create_date',
                  { initialValue: date }
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
                    initialValue: this.recording.serial_number
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
              <!-- v-bind="formItemLayout" -->
              <a-textarea
                placeholder="请输入备注, 1000字以内"
                v-decorator="[
                  'remark'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 材料明细 -->
    <a-card class="card" title="材料明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <!-- 表单获取焦点弹出表格 -->
          <a-popconfirm
            :key="col"
            okText="确认"
            cancelText="取消"
            placement="bottom"
            @confirm="handleTable(selectedRowKeys, col, record.key, record)"
            v-if="record.editable && popconfirmFields.includes(col)"
            style="margin: -5px 0"
            class="popfirm"
          >
            <a-input
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
              :placeholder="columnTitle[i]"
            />
            <a-icon slot="icon" type="warn" />

            <template slot="title">
              <a-table
                ref="table"
                size="default"
                rowKey="IsEspecial"
                :columns="demo"
                :dataSource="tableData.data"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
              >
                <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
              </a-table>
            </template>
          </a-popconfirm>

          <a-input
            :key="col"
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
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.value"
              :value="item.value"
            >{{ item.title }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :placeholder="columnTitle[i]"
            v-else-if="record.editable && datePickerFields.includes(col)"
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
      >新增设备明细</a-button>
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
          :data="{model:'003'}"
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
import { mixin, mixinDevice } from '@/utils/mixin'
import { getDeviceList, handleProcurement, getSerialNumber } from '@/api/pricepool/procurement'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

const selectData = {
  unit: [
    {
      title: '台',
      value: 1
    },
    {
      title: '条',
      value: 2
    }
  ]
}

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    return {
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
      demo: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '材料名称',
          dataIndex: 'EquName'
        },
        {
          title: '规格型号',
          dataIndex: 'EquSpecs'
        }
      ],
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
      tableData: {
        success: true,
        code: 200,
        message: null,
        data: [
          {
            'EquCode ': '211321001',
            EquName: '柴油发动机',
            EquSpecs: 'R180',
            EquSortCode: '211321',
            EquSortName: '第五分类',
            IsEspecial: '1',
            Note: ''
          },
          {
            'EquCode ': '211321002',
            EquName: '污水泵',
            EquSpecs: '100L',
            EquSortCode: '211322',
            EquSortName: '第五分类',
            IsEspecial: '2',
            Note: ''
          },
          {
            'EquCode ': '211321003',
            EquName: '电力变压器',
            EquSpecs: 'S11-M-500/10	',
            EquSortCode: '211323',
            EquSortName: '第五分类',
            IsEspecial: '3',
            Note: ''
          },
          {
            'EquCode ': '211321004',
            EquName: '螺丝',
            EquSpecs: 'GB/T 846-85',
            EquSortCode: '211324',
            EquSortName: '第五分类',
            IsEspecial: '4',
            Note: ''
          }
        ]
      },
      activeTabKey: 'attach',
      fileList: [],
      selectData: selectData,
      columnTitle: ['材料名称', '规格型号', '单位', '数量', '使用对象', '备注'],
      selectFields: ['unit'],
      serial_number: '',
      inputFields: [
        // 'id',
        // 'material_name',
        // 'specification',
        // 'unit',
        'use_site',
        'remark'
      ],
      datePickerFields: [],
      popconfirmFields: ['material_name'],
      numberFields: ['number' /*'approved_rent_num', 'approved_purchase_num', 'approved_alloc_num'*/],
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
      title: ['材料名称', '规格型号', '单位', '数量', '使用对象', '备注'],
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
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '使用对象',
          dataIndex: 'use_site',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'use_site' }
        },
        // {
        //   title: '批复设备来源及数量',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '租赁',
        // dataIndex: 'approved_rent_num',
        // align: 'center',
        // scopedSlots: { customRender: 'approved_rent_num' }
        // },
        // {
        //       title: '采购',
        //       dataIndex: 'approved_purchase_num',
        //       align: 'center',
        //       scopedSlots: { customRender: 'approved_purchase_num' }
        //     },
        //     {
        //       title: '调拨',
        //       dataIndex: 'approved_alloc_num',
        //       align: 'center',
        //       key: 'approved_alloc_num',
        //       scopedSlots: { customRender: 'approved_alloc_num' }
        //     }
        //   ]
        // },
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
          fixed: 'right',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: [
        'material_name',
        'specification',
        'unit',
        'number',
        'use_site',
        // 'approved_rent_num',
        // 'approved_purchase_num',
        // 'approved_alloc_num',
        'remark'
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
      errors: []
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
  mounted() {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    handleTable(val, col, key) {
      const arr = this.tableData.data.filter(item => item.IsEspecial == val[0])
      console.log(val, '---', col, '---', key, '---', arr)
      if (val.length > 1) return this.noSelect()

      console.log(this.detailData.filter(x => x.key == key))
      this.detailData = this.detailData.map((x, i) => {
        if (x.key == key) {
          x.material_name = arr[0].EquName
          x.specification = arr[0].EquSpecs
        }
        return x
      })
      console.log(this.detailData)
    },
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

    handleGetInfo() {},

    loadEditInfo(data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        getDeviceList({ id: data.id }).then(res => {
          this.serial_number = res.responseObject.serial_number
          this.detailData = res.responseObject.detail.map((d, i) => {
            d.editable = true
            d.isNew = true
            // d.planned_date = moment(d.planned_date)
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
            return attachment
          })
        })

        const formData = pick(data, [
          'creator_user_name',
          'creator_org_name',
          'create_date',
          'serial_number',
          'order_number',
          'material_name',
          'specification',
          'unit',
          'number',
          'use_site',
          // 'approved_rent_num',
          // 'approved_purchase_num',
          // 'approved_alloc_num',
          'remark'
        ])
        formData.create_date = moment(data.create_date)
        // console.log('formData', formData)
        form.setFieldsValue(formData)
      } else {
        getSerialNumber().then(res => (this.serial_number = res))
        console.log(this.serial_number)
      }
    },
    newDevice() {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        order_number: length + 1,
        editable: true,
        isNew: true,
        material_name: '',
        specification: '',
        unit: 1,
        number: '',
        use_site: '',
        // approved_rent_num: '',
        // approved_purchase_num: '',
        // approved_alloc_num: '',
        remark: ''
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

        if (['rent_type', 'number'].includes(column)) {
          target.amount = (target.rent_type * target.number).toFixed(2)

          // this.form.setFieldsValue({
          //   total_amount: newData.reduce((total, d) => {
          //     return total + Number(d.amount)
          //   }, 0)
          // })
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
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData
              values.files = that.fileList

              if (that.recording) {
                values.id = that.recording.id
                values.serial_number = that.recording.serial_number
                values.creator_user_id = that.recording.creator_user_id
                values.creator_org_name = that.recording.creator_org_name
                values.flag = 2
              } else {
                // 联动参数
                // values.remark = '备注'
                values.serial_number = that.serial_number
                values.creator_user_id = '123'
                values.creator_org_id = '1111'
                // values.creator_org_name = '财务部'
                values.material_code = '123'
                values.sum = '123'
                values.flag = 1
              }
              values.module = '003'
              values.files.map(x => {
                x.module = '003'
                return x
              })
              values.details.map(x => {
                x.material_code = '123'
                x.approved_rent_num = '1'
                x.approved_purchase_num = '1'
                x.approved_alloc_num = '1'
                return x
              })
              values.status_description = '已保存'
              values.create_date = values.create_date.format('YYYY-MM-DD')

              return handleProcurement(
                values,
                type === 'save' ? (that.recording ? 'update' : 'create') : 'submit'
              ).then(res => {
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
        file.module = modules.procurement
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
</style>
