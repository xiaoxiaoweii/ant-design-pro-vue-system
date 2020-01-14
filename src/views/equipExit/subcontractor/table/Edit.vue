<template>
  <div>
    <!-- 基本表单信息 -->
    <a-card class="card" title="分包商设备退场单" :bordered="false">
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
                v-decorator="[ 'pro_unit' ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker disabled v-decorator="[ 'create_date']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[ 'creator_user_name',{initialValue: $store.state.user.name}]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分包商" v-bind="formItemLayout">
              <a-input
                read-only
                @click="() => $refs.condInfoModal.add()"
                v-decorator="[
                  'subcontractor',
                   { 
                       rules: [{ required: isrequired, message: '请选择分包商' }]
                   }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
          <a-form-item label="退场日期" v-bind="formItemLayout">
              <a-date-picker
                v-decorator="[
                  'out_time'
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
        bordered
        :loading="memberLoading"
        rowKey="key"
        :scroll="{ x: 900 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            read-only
            v-if="col === 'name'"
            style="margin: -5px 0"
            :value="text"
            @click="selectEquipment(record)"
          />
          <a-input
            :key="col"
            v-else-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
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
            :min="1"
            :step="col === 'number' ? 1 : 0.01"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template
            v-else
          >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
            <a>
              <a-icon type="delete" />
            </a>
          </a-popconfirm>
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
    <condInfo-modal ref="condInfoModal" @ok="handleSelectcondInfo" />
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handleSubcontractor, queryone, queryEquip } from '@/api/equipExit/subcontractor'
import { uploadUrl, EXIT_EQUIP_PLAN_Modules, model, getAttachments, downloadAttachment, delAttachment, formStatus } from '@/api/equipExit/upload'
import { queryAllContract } from '@/api/equipmentMobilization/upload'
import { getEquipmentSupply } from '@/api/common'
import { getDictionaryEnum } from '@/api/system/dictionary'
import equipmentModal from '@/views/equipExit/modules/Equipment'
import condInfoModal from '@/views/equipExit/modules/CondInfo'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    equipmentModal,
    condInfoModal
  },
  data () {
    return {
      queryEquip: queryEquip,
      equipSupplyList: [], // 设备供应商列表
      myEquipment_code: '',
      input1: '',
      input2: '',
      params: {},
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      serial_number:'',
      subcontractor_code:'',
      previewImage: '',
      handleData: {},
      handleTreeData: {},
      filteredInfo: null,
      customFilterColumn: {},
      tabList: [
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
      options: [],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      sizeable: false,
      activeTabKey: 'attach',
      fileList: [],
      selectData: { unit: [] },
      detailFields: ['manage_code', 'name', 'spec', 'remark'],
      selectFields: [],
      inputFields: ['name', 'remark'],
      datePickerFields: ['contract_end_date'],
      numberFields: [],
      memberLoading: false,
      isrequired: true,
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
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          width: '200px',
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
      errors: [],
      currentRecord: null,
      record: null // 编辑对象
    }
  },
  computed: {
    ...mapGetters(['nickname', 'userId']),
    mod () {
      return EXIT_EQUIP_PLAN_Modules.subcontractor
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
    loadEditInfo (data) {
      this.detailData = []
      const { form } = this
      if (data.id) {
        queryone({ id: data.id, menu_id: this.menuCode }).then(res => {
          if (res.status === '0') {
            const formData = pick(res.responseObject, ['serial_number','subcontractor_code','subcontractor', 'creator_org_name', 'pro_unit', 'create_date', 'out_time'])

            this.detailData = res.responseObject.details.map((detail, index) => {
              detail.key = index + 1
              detail.code = length + 1
              detail.manage_code = detail.manage_code
              detail.name = detail.name
              detail.spec = detail.spec
              detail.remark = detail.remark
              detail.editable = true
              detail.isNew = true
              return detail
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

            formData.serial_number = formData.serial_number
            this.subcontractor_code = formData.subcontractor_code
            if (formData.subcontractor == undefined) {
              formData.subcontractor = ''
            }
            formData.subcontractor = formData.subcontractor
            formData.creator_org_name = formData.creator_org_name
            formData.pro_unit= formData.pro_unit
            formData.create_date = moment(formData.create_date)
            formData.out_time = moment(formData.out_time)
                                
            form.setFieldsValue(formData)
          }
        })
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
      this.$router.push('subcontractorExitList')
    },
    newDevice () {
      const length = this.detailData.length
      if (length > 0 && !this.detailData[this.detailData.length - 1].name)
        return this.noSelect('请填完上一条数据')
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        manage_code: '',
        name: '',
        spec: '',
        remark: '',
        editable: true,
        isNew: true
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

        this.detailData = newData
      }
    },
    handleSelectEquipment (equipment) {
      if (equipment) {
        this.handleChange(equipment.equip_name, this.currentRecord.key, 'name')
        this.handleChange(equipment.manage_code, this.currentRecord.key, 'manage_code')
        this.handleChange(equipment.specification, this.currentRecord.key, 'spec')
      }
    },
    handleSelectcondInfo (cond) {
      if (cond) {
        this.form.setFieldsValue({ subcontractor: cond.supName })
      }
    },
    selectEquipment (record) {
      this.currentRecord = record
      this.$refs.equipmentModal.add()
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
      validateFields((err, values) => {
        if (!err) {
          values.id =  this.record.id
          values.creator_org_name = this.$store.state.org_name
          values.subcontractor_code = this.subcontractor_code
          values.subcontractor = this.form.getFieldValue('subcontractor')
          if(values.subcontractor == undefined){
              values.subcontractor = ''
          }

          values.details = that.detailData.map(detail => {
                  if (detail.number) detail.number = detail.number.toString()
                  return detail
                })
          values.files = that.fileList

          if (type === 'submit') {
            this.$confirm({
              title: '提示',
              content: `确定${type === 'save' ? '保存' : '提交'}当前表单?`,
              onOk: () => {
                type === 'save' ? (that.saveLoading = true) : (that.submitLoading = true)
                values.details = that.detailData.map(detail => {
                  if (detail.number) detail.number = detail.number.toString()
                  return detail
                })
                values.files = that.fileList
                if (type === 'submit') {
                  values.flag = 2
                }

                // TODO: 编制单位,工程名称？
                return handleSubcontractor(type === 'save' ? 'update' : 'submit', Object.assign({ menu_id: this.menuCode },
                  values, {
                  id: this.record.id,
                  status: this.record.state,
                  out_time: values.out_time.format('YYYY-MM-DD'),
                  pro_unit_code: this.$store.state.pro_unit_code,
                  creator_org_id: this.scopeCode
                })).then(res => {
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
          } else {
              that.saveLoading = true
              return handleSubcontractor(type === 'save' ? 'update' : 'submit', Object.assign({ menu_id: this.menuCode }, values, { out_time: values.out_time.format('YYYY-MM-DD'), create_date: values.create_date.format('YYYY-MM-DD'), pro_unit_code: this.$store.state.pro_unit_code, creator_org_id: this.scopeCode })).then(res => {
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
    }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/equipExit/subcontractorEdit') {
        this.isrequired = true
        this.params = this.$route.params      
        this.loadEditInfo(this.params)
      }
    }
  },
  mounted () {
    getEquipmentSupply().then(res => {
      if (res.status === '0')
        this.equipSupplyList = res.responseList
    })
    this.record = this.$route.params
    this.loadEditInfo(this.record)
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
/deep/ div.ant-col-8 > div.ant-row > div.ant-col-sm-6 {
  width: 80px;
}
/deep/ div.ant-col-19 {
  width: 70%;
}
/deep/ div.ant-col-5 {
  width: 30%;
}
</style>
