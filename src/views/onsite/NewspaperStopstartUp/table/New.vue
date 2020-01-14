<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card class="card" title="自有设备报停-新增" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  {
                     initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
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
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'create_date',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备名称" v-bind="formItemLayout">
              <a-input
                placeholder="请选择"
                v-decorator="[
                'name',
                  {
                    rules: [{ required: isrequired, message: '请选择设备名称' }]
                  }
              ]"
              @click="showTable(true)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理号码" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="选择设备名称"
                v-decorator="[
                'manage_code',
                  {
                    initialValue: ''
                  }
              ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="规格型号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="选择设备名称"
                v-decorator="[
                  'spec',
                    {
                      initialValue: ''
                    }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="购置日期" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                v-decorator="[
                  'purchase_time',
                  { initialValue: date,rules: [{ required: isrequired, message: '请输入购置日期' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生产厂家" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="生产厂家"
                v-decorator="[
                  'product_org',
                  {
                    rules: [{ required: isrequired, message: '输入生产厂家' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="原值(元)" v-bind="formItemLayout">
              <a-input
                placeholder="原值"
                v-decorator="[
                  'original_value',
                  {
                    rules: [{ required: isrequired, message: '输入原值' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="净值(元)" v-bind="formItemLayout">
              <a-input
                placeholder="净值"
                v-decorator="[
                  'net_value',
                  {
                    rules: [{ required: isrequired, message: '输入净值' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="产权单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="产权单位"
                v-decorator="[
                  'owner',
                  {
                    rules: [{ required: isrequired, message: '输入产权单位' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="存放地点" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="存放地点"
                v-decorator="[
                  'store_place',
                  {
                    rules: [{ required: isrequired, message: '输入存放地点' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="调入项目时间" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                showTime
                @change="onChange"
                @ok="onOk"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="[
                  'in_time',
                  { initialValue: date,rules: [{ required: isrequired, message: '请输入调入项目时间' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="报停起始时间" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                v-decorator="[
                  'stop_time',
                  { initialValue: date,rules: [{ required: isrequired, message: '请输入报停起始时间' }] }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="启用时间" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                v-decorator="[
                  'start_time',
                  { initialValue: date,rules: [{ required: isrequired, message: '请输入启用时间' }] }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item
              label="启用原因"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 3 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 21 }
              }"
            >
              <!-- v-bind="formItemLayout" -->
              <a-textarea
                placeholder="请输入启用原因, 1000字以内"
                v-decorator="[
                  'stop_reason',
                  {
                    rules: [{ required: isrequired,max: 1000, message: '1000字以内',}],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 选择设备名称 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        size="small"
        ref="Mtables"
        rowKey="id"
        bordered
        :columns="equipColumns"
        :data="loadTableData"
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
    

    <!-- 附件上传-->
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
          :withCredentials="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :beforeUpload="beforeUploaddata"
          :data="{model:mod, type: 0, menu_id:this.menu_id }"
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
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >保存</a-button>&nbsp;
      <a-button
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
import { STable, ZTree } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import {handleNewspaperStopstartUp,queryledger,selectCondInfo} from '@/api/onsite/newspaperStopstartUp'
import { model, queryByCategory,selectByProject } from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules,
queryProjectName } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
export default {
  name: 'TableNew',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    ZTree,
    FooterToolBar
  },
  data () {
    return {
      menu_id:39,
      scope_code: this.$store.state.menu_key,
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
      queryParam: {},
      sizeSum: 0,
      selectedRowKeys: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      isrequired: true,
      visible_name: false,
      col: '',
      activeTabKey: 'attach',
      fileList: [],
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
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'file_name',
          key: 'attachname'
        },
        {
          title: '附件大小',
          dataIndex: 'file_size',
          key: 'file_size'
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
          dataIndex: 'user_name',
          key: 'user_name'
        },
        {
          title: '审批意见',
          dataIndex: 'noted',
          key: 'noted'
        },
        {
          title: '审批环节',
          dataIndex: 'activity_inst_name',
          key: 'activity_inst_name'
        },
        {
          title: '审批人岗位',
          dataIndex: 'user_position_name',
          key: 'user_position_name'
        },
        {
          title: '审批时间',
          dataIndex: 'approval_time',
          key: 'approval_time'
        }
      ],
      errors: [],
      loadTableData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
          return queryledger(Object.assign(this.queryParam,
              {creator_org_id:this.$store.state.menu_key||0,pageNum: 1, pageSize: 13 })).then(res => {
            // 索引
            this.current = res.responsePageInfo.pageNum
            this.currentSize = res.responsePageInfo.pageSize
            this.contractData=res
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
      // 索引
      current: Number,
      currentSize: Number,
    }
  },
  computed: {
    mod() {
      return modules.onsite
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
    equipColumns () {
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
          title: '设备名称',
          dataIndex: 'equip_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_name'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specification'
          },
          onFilter: (value, record) => record.specification.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '出机单位',
          dataIndex: 'accept_from',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'accept_from'
          },
          onFilter: (value, record) => record.accept_from.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
      ]
    },
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/onsite/newspaperStopstartUpList') {
        this.isrequired = true
      }
    },
  },

  methods: {
    ...mapGetters(['nickname']),
    onChange(value, dateString) {
      debugger 
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    },
    onOk(value) {
      debugger
      console.log('onOk: ', value);
    },
    showTable (flag) {
      this.visible_name = true
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },

    handleName (val) {
      this.visible_name = false
      const arr = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.form.setFieldsValue({
        manage_code: arr[0].manage_code,
        name: arr[0].equip_name,
        spec: arr[0].specification,
        dispatch_org_name: arr[0].accept_from||"",
      })
    },
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    setFilterColumnScope (data) {
      // const { column } = data
      // this.customFilterColumn[column.dataIndex] = data
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('newspaperStopstartUpList')
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
    },
    handleNameReset (clearFilters, col) {
      clearFilters()
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:this.menu_id,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name,
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 附件删除
    removeAttachment (record) {
      delAttachment({
        filePath: record.file_path,
        fileName: record.file_name,
        type: 0,
        menu_id:this.menu_id
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

    // 最终全页面提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this
      if (type === 'save') {
        this.isrequired = false
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          values.creator_org_id = that.$store.state.menu_key //右上角编号
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code //编制单位编号
          values.supplier_code=that.supplier_code
          values.menu_id = that.menu_id 
          values.flag=1
          values.equip_code=this.equip_code
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))
          values.use_date = (values.use_date == undefined ? null : values.use_date.format('YYYY-MM-DD'))

          for (let key in values) {
            const isTrue = values[key] === '' || values[key] == undefined || values == null
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
                  that.submitLoading = true
                  return handleNewspaperStopstartUp(values, 'submit').then(res => {
                    that.submitLoading = false
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
                },

                onCancel () { }
              })
            }
          }
          if (type === 'save') {
            that.saveLoading = true
            return handleNewspaperStopstartUp(values, 'save').then(res => {
              that.saveLoading = false
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
    sumUpliad () {
      this.sizeSum=0
      this.fileList.map(x => {
        this.sizeSum += parseInt(x.file_size)
        return x
      })
      const isLt50M = this.sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
    },

    // 文件上传
    fileChange (info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        if(file.name){
          file.file_name = file.name
        }
        file.module = '020'
        if(file.size){
          file.file_size=file.size
        }
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
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
// /deep/ .ant-form-item .ant-calendar-picker-input {
//   width: 278px;
// }
/deep/ .ant-table-body .ant-select-selection--single {
  width: 130px;
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
