<template>
  <div>
    <a-card class="card" title="公司固资设备折旧管理" :bordered="false">
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
              <a-select
                disabled
                v-decorator="[
                  'creator_org_name',
                  {
                    initialValue: $store.state.org_name
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
          <a-col :span="8">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'creator_user_name',
                  {
                    initialValue: this.nickname()
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
        :scroll="{ x: 2200 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
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
        <template slot="depreciationFixed" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
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
          :data="{model:'E001'}"
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
          <template slot="depreciationFixed" slot-scope="text, record">
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
import {
  getDeviceList,
  handleDepreciationFixed,
  getSerialNumber,
  // getSchedule,
  // getPurchase,
  // getMaterialType
} from '@/api/settlement/depreciationFixed'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

export default {
  name: 'depreciationFixedNew',
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
        idle_inuse: [
          {
            dic_enum_name: '闲置',
            dic_enum_id: 1
          },
          {
            dic_enum_name: '在用',
            dic_enum_id: 2
          }
        ]
      },
      columnTitle: [
        '设备名称',
        '规格型号',
        '功率（kw）',
        '管理号码',
        '原值（元）',
        '净值',
        '当月折旧金额（元）',
        '本项目累计折旧',
        '生产厂家',
        '出厂日期',
        '技术状态',
        '闲置/在用',
        '使用单位（工作地点）',
        '调入时间',
        '来源项目',
        '计划调出时间'
      ],
      selectFields: [
        'idle_inuse'
      ],
      serial_number: '',
      inputFields: [
        'equip_name',
        'spec',
        'management_code',
        'original_value',
        'net_value',
        'depreciation_amount',
        'accumulative_depreciation',
        'manufacturer',
        'technical_state',
        'use_org',
        'source_project'
      ],
      rangePickerFields: [],
      datePickerFields: [
        'production_date',
        'planned_out_date',
        'tuning_in_date',
      ],
      numberFields: [
        'power'
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
          fixed: 'left',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '功率（kw）',
          dataIndex: 'power',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'power' }
        },
        {
          title: '管理号码',
          dataIndex: 'management_code',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'management_code' }
        },
        {
          title: '原值（元）',
          dataIndex: 'original_value',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'original_value' }
        },
        {
          title: '净值',
          dataIndex: 'net_value',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'net_value' }
        },
        {
          title: '当月折旧金额（元）',
          dataIndex: 'depreciation_amount',
          align: 'center',
          width: '180px',
          scopedSlots: { customRender: 'depreciation_amount' }
        },
        {
          title: '本项目累计折旧',
          dataIndex: 'accumulative_depreciation',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'accumulative_depreciation' }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'manufacturer' }
        },
        {
          title: '出厂日期',
          dataIndex: 'production_date',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'production_date' }
        },
        {
          title: '技术状态',
          dataIndex: 'technical_state',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'technical_state' }
        },
        {
          title: '闲置/在用',
          dataIndex: 'idle_inuse',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'idle_inuse' }
        },
        {
          title: '使用单位（工作地点）',
          dataIndex: 'use_org',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'use_org' }
        },
        {
          title: '调入时间',
          dataIndex: 'tuning_in_date',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'tuning_in_date' }
        },
        {
          title: '来源项目',
          dataIndex: 'source_project',
          align: 'center',
          width: '120px',
          scopedSlots: { customRender: 'source_project' }
        },
        {
          title: '计划调出时间',
          dataIndex: 'planned_out_date',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'planned_out_date' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: '90px',
          align: 'center',
          scopedSlots: { customRender: 'depreciationFixed' }
        }
      ],
      detailFields: [
        'equip_name',
        'spec',
        'power',
        'management_code',
        'original_value',
        'net_value',
        'depreciation_amount',
        'accumulative_depreciation',
        'manufacturer',
        'production_date',
        'technical_state',
        'idle_inuse',
        'use_org',
        'tuning_in_date',
        'source_project',
        'planned_out_date'
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
          scopedSlots: { customRender: 'oper' }
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
        this.serialable = true

        getDeviceList({ id: data.id }).then(res => {
          this.detailData = res.responseObject.detail.map((d, i) => {
            d.editable = true
            d.isNew = true
            console.log(d.issue_time)
            d.issue_time = d.issue_time ? d.issue_time.moment(d.issue_time) : null
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
          'creator_org_name',
          'creator_user_name',
          
        ])
        formData.create_date = moment(data.create_date)
        // console.log('formData', formData)
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
        equip_name: '',
        spec: '',
        power: '',
        management_code: '',
        original_value: '',
        net_value: '',
        depreciation_amount: '',
        accumulative_depreciation: '',
        manufacturer: '',
        production_date: null,
        technical_state: '',
        idle_inuse: '',
        use_org: '',
        tuning_in_date: null,
        source_project: '',
        planned_out_date: null
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

        if (['single_price', 'num'].includes(column)) {
          target.single_price = target.single_price ? target.single_price : '0'
          target.num = target.num ? target.num : '0'

          target.sum = (target.single_price * target.num).toFixed(2) + ''

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
                values.creator_org_id = that.recording.creator_org_id
                // values.creator_org_name = that.recording.creator_org_name
                values.status = that.recording.status
                values.flag = 2
              } else {
                // 联动参数
                values.flag = 1
              }
              // values.files.map(x => {
              //   x.module = '003'
              //   return x
              // })
              values.details.map(x => {
                x.single_price = x.single_price + ''
                x.num = x.num + ''
                return x
              })
              values.status_description = '已保存'
              console.log(values.create_date)
              values.create_date = values.create_date.format('YYYY-MM-DD')

              return handleDepreciationFixed(values, type === 'save' ? (that.recording ? 'update' : 'create') : 'submit').then(
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
        file.module = modules.depreciationFixed
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
</style>
