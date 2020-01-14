<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card
      class="card"
      title="基本信息"
      :bordered="false"
    >
      <detail-list>
        <detail-list-item term="编制单位">{{ dataFrom.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataFrom.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataFrom.create_date|dayjs }}</detail-list-item>
        <detail-list-item term="盘点开始日期">{{ dataFrom.start_date|dayjs }}</detail-list-item>
        <detail-list-item term="盘点结束日期">{{ dataFrom.end_date|dayjs  }}</detail-list-item>
      </detail-list>
    </a-card>
    
    <a-card title="盘点明细">
      <a-table
        :columns="detailColumns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
         rowKey="key"
        bordered
      >
      </a-table>
    </a-card>

    <!-- 附件上传-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <a-table
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
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div class="approval" v-if="activeTabKey === 'approval'">
        <a-table 
        :columns="approvalColumns" 
        :dataSource="approvalList" 
        :pagination="false" />
        <br />
      </div>
    </a-card>

    <a-card :bordered="false" v-if="this.recording.type !== 'read'" title="审批意见">
      <a-textarea placeholder="请输入审批意见, 1000字以内" @change="txtChange" :value="noted" />
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
        v-if="this.recording.type!=='read'"
        :loading="loading"
        @click="refuse"
      >打回</a-button>
      &nbsp;
      <a-button
        type="primary"
        v-if="this.recording.type!=='read'"
        @click="aPProve"
        :loading="saveLoading"
      >通过</a-button>
      &nbsp;
      <a-button 
        type="primary" 
        @click="handleGoBack" 
        :loading="loading">返回</a-button>
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
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import DetailList from '@/components/tools/DetailList'
import { mixin, mixinDevice } from '@/utils/mixin'
import { fuzzySearchById,handleQueryApprover } from '@/api/common'
import {queryOne,approve,reject} from '@/api/onsite/inventory'
import { model, queryByCategory,queryEquip } from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules,
queryProjectName } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

export default {
  name: 'TableDetail',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
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
  data () {
    return {
      scope_code: this.$store.state.menu_key,
      refusebile: true,
      params:{},
      dataFrom:{},
      noted: '',


      selectData: {
        'is_subcontract': [
          {
            dic_enum_name: '是',
            dic_enum_id: 1
          },
          {
            dic_enum_name: '否',
            dic_enum_id: 2
          }
        ]
      },
      selectFields: [
        'is_subcontract' //是否分包商合同内
      ],
      inputFields: [ 
        'car_name', 
        'type',
        'unit',
        'worktime',
      ],
      datePickerFields:[ //
        'start_time',
        'end_time',
      ],
      detailData: [],
      columnTitle: [
        '单位工程名称',
        '工作内容',
        '核定工作持续时间',
        '核定工作持续时间',
        '单位',
        '合计工作时间/工作量',
        '请选择',
      ],
      detailFields: [
        'car_name', 
        'type', 
        'start_time', 
        'end_time',
        'unit', 
        'worktime', 
        'is_subcontract', 
      ],
      detailColumns: [
        {
          title: '序号',
          dataIndex: 'order_number',
          key: 'order_number',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'order_number' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          key: 'manage_code',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'manage_code' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          key: 'equip_name',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'equip_name' }
        },
        {
          title: '型号',
          dataIndex: 'spec',
          key: 'spec',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        // {
        //   title: '购置日期',
        //   dataIndex: 'purchase_time',
        //   key: 'purchase_time',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'purchase_time' }
        // },
        // {
        //   title: '生产厂家',
        //   dataIndex: 'product_org',
        //   align: 'center',
        //   width: '120px',
        //   scopedSlots: { customRender: 'product_org' }
        // },
        // {
        //   title: '原值',
        //   dataIndex: 'original_value',
        //   key: 'original_value',
        //   width: '150px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'original_value' }
        // },
        // {
        //   title: '已提折旧',
        //   dataIndex: 'deprec_value',
        //   key: 'deprec_value',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'deprec_value' }
        // },
        // {
        //   title: '净值',
        //   dataIndex: 'net_value',
        //   key: 'net_value',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'net_value' }
        // },
        // {
        //   title: '残值',
        //   dataIndex: 'residual_value',
        //   key: 'residual_value',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'residual_value' }
        // },
        // {
        //   title: '折旧方法',
        //   dataIndex: 'deprec_method',
        //   key: 'deprec_method',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'deprec_method' }
        // },
        // {
        //   title: '重量(t)',
        //   dataIndex: 'weight',
        //   key: 'weight',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'weight' }
        // },
        // {
        //   title: '功率(kw)',
        //   dataIndex: 'single_power',
        //   key: 'single_power',
        //   width: '80px',
        //   align: 'center',
        //   scopedSlots: { customRender: 'single_power' }
        // },
        {
          title: '技术状况',
          dataIndex: 'technical_condition',
          key: 'technical_condition',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'technical_condition' }
        },
        {
          title: '所在地点',
          dataIndex: 'site_name',
          key: 'site_name',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'site_name' }
        },
        {
          title: '资产有无',
          dataIndex: 'asset',
          key: 'asset',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'asset' }
        },
        {
          title: '图片',
          dataIndex: 'img',
          align: 'center',
          customRender: () => (<img src="http://www.crcc.cn/images/79/logo.png" style="width: 200px" />)
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '130px',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
      ],     
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
      tableData: {},
      selectedRowKeys: [],
      isrequired: true,
      visible: false,
      visible_name: false,
      columnsTable:true,
      dataTale:true,
      approvalList: [],
      col: '',
      activeTabKey: 'attach',
      fileList: [],
      popconfirmFields: ['name'],
      numberFields: ['num', 'price_without_tax'],
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
      // 索引
      current: Number,
      currentSize: Number,
    }
  },
  computed: {
    date () {
      return moment()
    },
    formStatus () {
      return formStatus
    },
  },
  // watch: {
  //   $route (to, from) {
  //     if (this.$route.params.type === 1) {
  //       this.resetForm()
  //     }
  //     if(this.$route.params.type==="read"){
  //       this.loadEditInfo(this.recording)
  //     }
  //   }
  // },
  mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    loadEditInfo (data) {
      const { form } = this
      let that=this
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        queryOne({id:data.id,menu_id:45}).then(res => {
          that.dataFrom=res.responseObject
          const formData = pick(that.dataFrom, 
          [
            'serial_number',//单据编号
            'pro_unit',//编制单位
            'creator_user_name',//编制人
            'create_date',//编制日期
            'start_date',//盘点开始日期
            'end_date',//盘点结束日期
            'remark',//备注
          ])
          formData.create_date = moment((that.dataFrom.create_date == null ? {} : that.dataFrom.create_date))
          formData.end_date = moment((that.dataFrom.end_date == null ? {} : that.dataFrom.end_date))
          formData.start_date = moment((that.dataFrom.start_date == null ? {} : that.dataFrom.start_date))
          form.setFieldsValue(formData)
          if(res.responseObject.files){
            that.fileList=res.responseObject.files
          }
          if(res.responseObject.details){
            let detailData=res.responseObject.details
            detailData.map((item,index)=>{
              item['order_number']=index+1
            })
            that.detailData=detailData
          }
          if (that.recording.process_inst_id&&that.recording.process_inst_id!="--") {
            handleQueryApprover({ menu_id: 45, process_inst_id: this.recording.process_inst_id }).then(res => {
              that.approvalList = res.responseObject
            })
          }

        })   
      }
    },
    txtChange (e) {
      this.noted = e.target.value
    },
     // 通过
    aPProve() {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定通过当前审批?`,
        onOk() {
          that.saveLoading = true
          approve({
            id: that.recording.id,
            menu_id: 45,
            process_inst_id: that.recording.process_inst_id,
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

    // 拒绝
    refuse() {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定打回当前审批?`,
        onOk() {
          console.log(that)
          that.loading = true
          reject({
            id: that.recording.id,
            menu_id: 45,
            process_inst_id: that.recording.process_inst_id,
            noted: that.noted
          }).then(res => {
            that.loading = false
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
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    handleGoBack () {
      this.$emit('onGoBack')
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

    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:45,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name,
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },
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
