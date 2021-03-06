<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="设备租赁申请单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ recording.serial_number }}</detail-list-item>
        
        <detail-list-item term="编制人">{{ recording.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.create_date }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.pro_unit }}</detail-list-item>
        <detail-list-item term="备注">{{ recording.remark }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card class="card" title="设备明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
        class="line-table"
        :scroll="{x:1500}"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text,record">
         
          <a-input
            :disabled="recording.type"
            :key="col"
            v-if=" inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :maxlength="1024"
            :placeholder="columnsTitle[i]"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template
            v-else
          >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.value === text))[0].title : text }}</template>
        </template>
      </a-table>
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
        <a-table
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
              <a @click="download(record)">
                <a-icon type="cloud-download" /></a>
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
          :dataSource="approvalList"
          :pagination="false"
        />
      </div>
    </a-card>
    <a-card :bordered="false" v-if="!recording.type" title="审批意见">
      <a-textarea placeholder="请输入审批意见, 1000字以内" @change="txtChange" :value="noted" />
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
      <a-button v-if="recording.type!=='read'"
        type="primary"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>
      &nbsp;
      <a-button v-if="recording.type!=='read'"
        type="primary"
        @click="approve"
        :loading="submitLoading"
      >通过</a-button>
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
import * as $ from 'jquery'
import moment from 'moment'
import pick from 'lodash.pick'
import STree from '@/components/Tree/Tree'
import { STable, ZTree } from '@/components'
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handleApprove, handleRefuse,exportToExcel,exportToPDF ,getDeviceList} from '@/api/planManagement/equipmentLease'
import {
  uploadUrl,
  getAttachments,
  downloadAttachment,
  delAttachment,
  formStatus,
  modules,
  formStatusArray,
  getImgView,
  queryAllEquipment,
  handleQueryApprover,
  queryAssetsCategory,
  queryByEquipment
} from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

if (!window.jQuery) {
  window.jQuery = $
}

const selectData = {
  catogery: [
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
    STable,
    STree,
    ZTree,
    FooterToolBar,
    DetailList,
    DetailListItem
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  data() {
    return {
      refusebile: this.nickname() !== this.recording.check_user_name,
      myEquipment_code:'',
      noted:'',
      input1:'',
      input2:'',
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      isrequired: true,
      handleData: {},
      handleTreeData: {},
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      formStatusArray: formStatusArray,
      showIndex: 0,
      treeData: [],
      settingTree: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'assets_type_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_code',
            idKey: 'assets_type_code'
          }
        }
      },
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'e_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_code',
            idKey: 'equipment_code'
          }
        }
      },
      approvalList:[],
      equipList: [],
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
      tableData: {},
      visible: false,
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
      loadChange(pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      },
      sizeable: false,
      activeTabKey: 'attach',
      fileList: [],
      selectData: selectData,
      selectEquData: [],
      selectFields: [],
      inputFields: ["approved_rent_num","approved_purchase_num","approved_alloc_num"],
      datePickerFields: [],
      numberFields: [],
      popconfirmFields: [],
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
      columnsTitle: [
        '设备需求计划单号',
        '供应商名称',
        '设备编码',
        '设备名称',
        '规格型号',
        '数量',
        '单位',
        '租赁方式',
        '计费方式',
        '不含税单价',
        '含税单价',
        '计划进场日期',
        '计划出厂日期',
        '计划租期/工作量',
        '税率(%)',
        '税额',
        '含税总额',
        '不含税总额',
        '备注'  
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '设备需求计划单号',
          dataIndex: 'rent_plan_sn',
          key: 'rent_plan_sn',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'rent_plan_sn' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'supplier_name' }
        },
        {
          title: '设备编码',
          dataIndex: 'equipment_code',
          key: 'equipment_code',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'equipment_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          key: 'name',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          key: 'specification',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '租赁方式',
          dataIndex: 'rent_type',
          width: '120px',
          key: 'rent_type',
          align: 'center',
          scopedSlots: { customRender: 'rent_type' }
        },
        {
          title: '计费方式',
          dataIndex: 'fee_type',
          width: '120px',
          key: 'fee_type',
          align: 'center',
          scopedSlots: { customRender: 'fee_type' }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax',
          key: 'price_without_tax',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'price_without_tax' }
        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          key: 'price_with_tax',
          width: '180px',
          align: 'center',
          scopedSlots: { customRender: 'price_with_tax' }
        },
        {
          title: '计划进场日期',
          width: '150px',
          dataIndex: 'planned_in_date',
          key: 'planned_in_date',
          align: 'center',
          scopedSlots: { customRender: 'planned_in_date' }
        },
        {
          title: '计划出厂日期',
          dataIndex: 'planned_out_date',
          key: 'planned_out_date',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'planned_out_date' }
        },
        {
          title: '计划租期/工作量',
          dataIndex: 'planned_quantity',
          key: 'planned_quantity',
          align: 'center',
          scopedSlots: { customRender: 'planned_quantity' }
        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额',
          dataIndex: 'tax_fee',
          key: 'tax_fee',
          align: 'center',
          scopedSlots: { customRender: 'tax_fee' }
        },
        {
          title: '含税总额',
          dataIndex: 'sum_with_tax',
          key: 'sum_with_tax',
          align: 'center',
          scopedSlots: { customRender: 'sum_with_tax' }
        },
        {
          title: '不含税总金额',
          dataIndex: 'sum_tax_fee',
          key: 'sum_tax_fee',
          align: 'center',
          scopedSlots: { customRender: 'sum_tax_fee' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '100px',
          key: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      detailFields: [
        'rent_plan_sn',
        'supplier_name',
        'equipment_code',
        'name',
        'specification',
        'num',
        'unit',
        'rent_type',
        'fee_type',
        'price_without_tax',
        'price_with_tax',
        'planned_in_date1',
        'planned_out_date1',
        'planned_quantity',
        'tax_rate',
        'tax_fee',
        'sum_with_tax',
        'sum_tax_fee',
        'remark'
      ],
      attachColumns: [
        {
          title: '附件名称',
          dataIndex: 'name',
          key: 'attachname'
        },
        {
          title: '附件大小(KB)',
          dataIndex: 'size',
          key: 'size'
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
          dataIndex: 'user_name',
          key: 'user_name'
        },
        {
          title: '审批意见',
          dataIndex: 'noted',
          key: 'noted'
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
        },
        {
          title: '审批环节',
          dataIndex: 'activity_inst_name',
          key: 'activity_inst_name'
        },
      ],
      errors: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        if (!this.queryParam.equipment_code) {
          this.queryParam = {
            equipment_code: '0'
          }
        }
        return queryByEquipment(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          this.currentSize = res.responsePageInfo.pageSize
          console.log(res)
          this.tableData = res

          return !res.Tag
            ? {}
            : res.result || {
                pageSize: res.responsePageInfo.pageSize,
                pageNo: res.responsePageInfo.pageNum,
                totalPage: res.responsePageInfo.pages,
                totalCount: res.responsePageInfo.total,
                data: res.responsePageInfo.list
              }
        })
      },
      // 索引
      selectNode: '',
      current: Number,
      currentSize: Number,
      dicTree: [],
      valTree: '',
      valTree2:''
    }
  },
  created() {
    this.queryParam = {}
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  computed: {
   
    mod() {
      return modules.purchase
    },
    date() {
      return moment()
    },
    uploadUrl() {
      return uploadUrl
    },
    formStatus() {
      return formStatus
    }
  },
  
  mounted() {
    this.queryParam = {}
  },
  methods: {
    approve () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定通过当前审批?`,
        onOk () {
          that.submitLoading = true
          handleApprove({
            id: that.recording.id,
            menu_id: 22,
            process_inst_id: that.recording.process_inst_id,
            money: 66,
            noted: that.noted
          }).then(res => {
            that.submitLoading = false
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.handleGoBack() // 返回列表页
            }
          })
        }
      })
    },

    refuse () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定打回当前审批?`,
        onOk () {
          that.saveLoading = true
          handleRefuse({
            id: that.recording.id,
            menu_id: 22,
            process_inst_id: that.recording.process_inst_id || 1,
            money: 66,
            noted: that.noted
          }).then(res => {
            that.saveLoading = false
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.handleGoBack() // 返回列表页
            }
          })
        }
      })
    },
    handleChange(value, key, column) {
      const newData = [...this.detailData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.detailData = newData
      }
    },
    txtChange(e) {
      this.noted = e.target.value
    },
    ...mapGetters(['nickname']),
    async loadEditInfo(data) {
      const { form } = this
      console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        await getDeviceList({ id: data.id, menu_id: 22 }).then(res => {
          // this.noted = this.dataObj.noted
          this.detailData = res.responseObject.details.map((d,i) => {
            d.code = i+1
            if (d.number===0) d.number = ''
            d.key = d.id

            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            // if (attachment.type === 0) {
              attachment.uid = attachment.id.toString()
              attachment.status = 'done'
              attachment.url = ''
              attachment.key = attachment.id.toString()
              attachment.name = attachment.file_name
              attachment.size = (attachment.file_size/1024).toFixed(0)
              attachment.username = attachment.upload_user_name
            // }
            return attachment
          })
          this.picList = res.responseObject.files.filter(attachment => {
            if (attachment.type === 1) {
              attachment.uid = attachment.id.toString()
              attachment.status = 'done'
              attachment.url = attachment.file_path + attachment.file_name
              attachment.key = attachment.id.toString()
              attachment.name = attachment.file_name
              attachment.size = attachment.file_size
              attachment.username = attachment.upload_user_name
            }
            return attachment.type === 1
          })
          if (this.picList.length === 0) return false
          const details = this.picList.map(x => {
            return { file_path: x.file_path + x.file_name }
          })
          getImgView({
            details
          }).then(res => {
            this.picList.map((x, i) => {
              const arr = res.responseList.filter(y => x.file_path + x.file_name === y.file_path)
              if (arr.length > 0) {
                // base64
                const data = 'data:image/png;base64,' + arr[0].base64
                // 文件流
                x.url = data
              }
              return x
            })
          })
        })
      if (this.recording.process_inst_id) {
          handleQueryApprover({ menu_id: 22, process_inst_id: this.recording.process_inst_id }).then(res => {
            this.approvalList = res.responseObject
          })
        } 
      }
    },
    // 限制上传图片的大小
    beforeUpload(file) {
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
    sumUpliad() {
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
    
    setFilterColumnScope(data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    valueChange(e) {
      console.log(e)
      this.valTree = e.target.value
      queryAllEquipment({ e_name: this.valTree }).then(res => (this.dicTree = res.responseList))
    },
    valueChange2(e) {
      this.valTree2 = e.target.value
      queryAssetsCategory({ assets_type_name: this.valTree2 }).then(res => (this.treeData = res.responseList))
    },
    
    onClick: function(evt, treeId, treeNode) {
      // 点击事件
      console.log(evt.type, treeNode)
      this.queryParam = {
        equipment_code: treeNode.equipment_code
      }
      this.myEquipment_code = treeNode.equipment_code
      this.$refs.tables.refresh(true)
    },
    onCheck: function(evt, treeId, treeNode) {
      // 选中事件
      console.log(evt.type, treeNode)
    },
    handleCreated: function(ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      console.log(ztreeObj)
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleCancel() {
      this.previewVisible = false
    },
    // 图片预览
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    // 图片上传
    picChange(info) {
      console.log(info)
      if (this.sizeable) {
        let fileList = [...info.fileList]

        fileList = fileList.map(file => {
          if (file.response) {
            const names = file.response.responseObject.fileName.split('.')
            file.file_path = file.response.responseObject.filePath
            file.file_name = file.response.responseObject.fileName
            file.file_ext = names[names.length - 1] || 'unknown'
          }
          file.key = file.uid
          file.module = modules.purchase
          file.file_size = file.size
          file.upload_user_id = '123' // 待修改
          file.upload_user_name = this.nickname()
          file.type = 1
          file.remark = '附件'

          return file
        })
        this.picList = fileList
      }
    },

    
    update: function() {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    },
   
    handleSaveClose() {},
    
    refresh (bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
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
    oncancel () {
      this.input1 = ''
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
    },
    showTree(selectedRowKeys, col, key, record) {
      queryAssetsCategory().then(res => (this.treeData = res.responseList))
      console.log(selectedRowKeys)
      this.handleTreeData.col = col
      this.handleTreeData.key = key
      this.handleTreeData.record = record
      // getAllEquip().then(res => (this.equipList = res.responseList))
      this.enameVisible = true
    },
    showModal (selectedRowKeys, col, key, record) {
      this.visible = true
      this.queryparam = {
      }
      queryAllEquipment().then(res => (this.dicTree = res.responseList))
      console.log(selectedRowKeys)
      this.handleData.col = col
      this.handleData.key = key
      this.handleData.record = record     
    },
    handleGoBack() {
      this.$emit('onGoBack')
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    },

    handleGetInfo() {},
    
    
    
    toggle(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel(key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    

    // 附件下载
    download(record) {
      downloadAttachment({
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
          }
        ],
        type:0,
        menu_id:22
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment(record) {
      const data = {
        filePath: record.file_path,
        fileName: record.file_name
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

   
    scrollToField(fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },

    // 文件上传
    fileChange(info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      console.log(fileList)

      fileList = fileList.map(file => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        // file = {
        //   key: file.uid,
        //   module: modules.purchase,
        //   file_size: (file.size / 1024).toFixed(0),
        //   upload_user_name: this.nickname(),
        //   upload_user_id: '123',
        //   type: 0
        // }
        file.key = file.uid
        file.module = modules.purchase
        file.file_size = file.size
        file.fileSize = (file.size / 1024).toFixed(0)
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        file.type = 0

        return file
      })

      this.fileList = fileList
    },

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


/deep/div.ant-col-18 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/deep/ div.ant-col-18 > div.ant-row > div.ant-col-sm-2 {
  width: 80px;
}

/deep/ div.ant-col-6 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-6 > div.ant-row > div.ant-col-sm-6 {
  width: 80px;
}
/deep/ div.ant-col-19{
  width: 70%
}
/deep/ div.ant-col-5{
  width: 30%
}
</style>
