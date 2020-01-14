<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              label="单据编号"
              v-bind="formItemLayout"
            >
              <a-input
                disabled
                placeholder="请输入编号"
                v-decorator="[
                  'request_code',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="编制日期"
              v-bind="formItemLayout"
            >
              <a-date-picker
                disabled
                v-decorator="[
                  'create_date',
                  {
                    initialValue: date,
                    rules: [{ required: true, message: '请选择日期' }],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="编制人"
              v-bind="formItemLayout"
            >
              <a-input
                disabled
                placeholder="请输入编制人"
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
            <a-form-item
              label="金额"
              v-bind="formItemLayout"
            >
              <a-input-number
                disabled
                :min="0"
                :step="0.01"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                v-decorator="[
                  'total_amount',
                  {
                    initialValue: 0
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="18">
          <a-col :span="18">
            <a-form-item
              label="购置理由"
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
                placeholder="请输入购置理由, 1000字以内"
                v-decorator="[
                  'reason',
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
    <a-card
      class="card"
      title="设备明细"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text, record"
        >
          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
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
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :min="0"
            :step="col === 'number' ? 1 : 0.01"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ selectFields.includes(col) ? (selectData[col].filter(c => c.value === text))[0].title : text }}</template>
        </template>
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <!-- <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" /> -->
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="remove(record.key)"
              >
                <a><a-icon type="delete" /></a>
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
            <a-popconfirm
              title="是否要删除此行？"
              @confirm="remove(record.key)"
            >
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
      <div
        class="attachment"
        v-if="activeTabKey === 'attach'"
      >
        <a-upload-dragger
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
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
          <span
            slot="serial"
            slot-scope="text, record, index"
          >{{ index + 1 }}</span>
          <template
            slot="operation"
            slot-scope="text, record"
          >
            <span>
              <a @click="download(record.key)"><a-icon type="cloud-download" /></a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="removeFile(record.key)"
              >
                <a><a-icon type="delete" /></a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div
        class="approval"
        v-if="activeTabKey === 'approval'"
      >
        <a-table
          :columns="approvalColumns"
          :dataSource="[]"
          :pagination="false"
        />
        <br />
        <a-card
          :bordered="false"
          title="工作流进度"
        >
          <a-steps
            :direction="isMobile() && 'vertical' || 'horizontal'"
            :current="2"
            progressDot
          >
            <a-step title="开始">
            </a-step>
            <a-step title="部门初审">
            </a-step>
            <a-step title="财务复核">
            </a-step>
            <a-step title="完成">
            </a-step>
          </a-steps>
        </a-card>
      </div>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
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
              <a-icon
                type="cross-circle-o"
                class="antd-pro-pages-forms-style-errorIcon"
              />
              <div class="">{{ item.message }}</div>
              <div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>
            </li>
          </template>
          <span
            class="antd-pro-pages-forms-style-errorIcon"
            v-if="errors.length > 0"
          >
            <a-icon type="exclamation-circle" />{{ errors.length }}
          </span>
        </a-popover>
      </span>
      <a-button
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >保存</a-button>
      &nbsp;
      <a-button
        :disabled="!!recording.status"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >提交</a-button>
      &nbsp;
      <a-button
        type="primary"
        @click="handleGoBack"
        :loading="loading"
      >返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { submitPurchase, getDeviceList, handlePurchase } from '@/api/purchase'
import { mapGetters } from 'vuex'

const selectData = {
  'catogery': [
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
      activeTabKey: 'attach',
      fileList: [],
      selectData: selectData,
      selectFields: ['catogery'],
      inputFields: ['name', 'spec', 'model', 'remark'],
      datePickerFields: ['planned_date'],
      numberFields: ['estimated_price', 'number'],
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
          title: '资产类别',
          dataIndex: 'catogery',
          key: 'catogery',
          scopedSlots: { customRender: 'catogery' }
        },
        {
          title: '机械设备名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
          scopedSlots: { customRender: 'model' }
        },
        // {
        //   title: '单位',
        //   dataIndex: 'unit',
        //   key: 'unit',
        //   scopedSlots: { customRender: 'unit' }
        // },
        {
          title: '预计单价(元)',
          dataIndex: 'estimated_price',
          key: 'estimated_price',
          scopedSlots: { customRender: 'estimated_price' }
        },
        {
          title: '计划购置数量',
          dataIndex: 'number',
          key: 'number',
          scopedSlots: { customRender: 'number' }
        },
        {
          title: '计划金额(元)',
          dataIndex: 'amount',
          key: 'amount',
          width: '150px',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '计划购置日期',
          dataIndex: 'planned_date',
          key: 'planned_date',
          width: '150px',
          scopedSlots: { customRender: 'planned_date' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          width: '120px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: ['catogery', 'name', 'spec', 'model', 'estimated_price', 'number', 'amount', 'planned_date', 'remark'],
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
    date () {
      return moment()
    }
  },
  // beforeCreate () {
  //   this.form = this.$form.createForm(this)
  // },
  mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    handleGoBack () {
      this.$emit('onGoBack')
    },

    handleGetInfo () {

    },
    loadEditInfo (data) {
      const { form } = this
      // ajax
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        getDeviceList({ id: data.id }).then(res => {
          this.detailData = res.responseList.map(d => {
            d.editable = true
            d.isNew = true
            d.planned_date = moment(d.planned_date)
            return d
          })
        })

        const formData = pick(data, ['request_code', 'create_date', 'creator_user_name', 'total_amount', 'reason'])
        formData.create_date = moment(data.create_date)
        console.log('formData', formData)
        form.setFieldsValue(formData)
      }
    },
    newDevice () {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        order_number: length + 1,
        name: '',
        editable: true,
        isNew: true,
        catogery: 1,
        spec: '',
        model: '',
        estimated_price: 0,
        number: 0,
        amount: 0,
        planned_date: null,
        remark: '',
        equipment_code: 'w12',
        unit: '台'
      })
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

        if (['estimated_price', 'number'].includes(column)) {
          target.amount = (target.estimated_price * target.number).toFixed(2)

          this.form.setFieldsValue({
            total_amount: newData.reduce((total, d) => {
              return total + Number(d.amount)
            }, 0)
          })
        }
        this.detailData = newData
      }
    },

    // 附件上传
    download (key) {
      console.log(key)
    },
    removeFile (key) {
      const newData = this.fileList.filter(item => item.key !== key)
      this.fileList = newData
    },

    // 最终全页面提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this

      validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('111111111111Received values of form: ', values, type)
          this.$confirm({
            title: '提示',
            content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
            onOk () {
              type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
              values.details = that.detailData

              if (that.recording) {
                values.id = that.recording.id
                values.remark = that.recording.remark
                values.creator_user_id = that.recording.creator_user_id
                values.creator_org_code = that.recording.creator_org_code
                values.creator_org_name = that.recording.creator_org_name
              } else {
                // 联动参数
                values.remark = '备注'
                values.creator_user_id = '123'
                values.creator_org_code = '1111'
                values.creator_org_name = '财务部'
              }
              values.create_date = values.create_date.format('YYYY-MM-DD')

              // 日期格式转换
              return handlePurchase(values, that.recording ? 'update' : 'create').then(res => {
                type === 'save' ? (that.saveLoading = false) : (that.submitLoading = false)
                console.log(res, type)
                if (res.status === '0') {
                  if (type === 'save') {
                    that.$notification['success']({
                      message: '提示',
                      description: res.msg
                    })
                    that.handleGoBack() // 返回列表页
                  } else {
                    return submitPurchase({ id: that.recording.id || res.responseObject }).then(res => {
                      console.log(res, type)
                      if (res.status === '0') {
                        that.$notification['success']({
                          message: '提示',
                          description: res.msg
                        })
                      }
                      that.handleGoBack() // 返回列表页
                    })
                  }
                }
              })
            },
            onCancel () { }
          })
        }
      })
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 文件上传
    fileChange (info) {
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      // fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map((file) => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        file.key = file.uid

        return file
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
</style>
