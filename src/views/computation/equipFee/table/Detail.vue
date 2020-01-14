<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card
      class="card"
      title="设备费用扣款基本信息"
      :bordered="false"
    >
      <detail-list>
        <detail-list-item term="单据编号">{{ recording.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ recording.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.create_date }}</detail-list-item>
        <detail-list-item term="分包商名称">{{ recording.subcontractor_name }}</detail-list-item>
        <detail-list-item term="扣款时间范围">{{ `${recording.deduction_start_date} ~ ${recording.deduction_end_date}` }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card
      class="card"
      title="扣款明细"
      :bordered="false"
    >
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
      >
        <template
          v-for="(col, i) in detailFields"
          :slot="col"
          slot-scope="text"
        >
          <template>{{ text }}</template>
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
      <div class="approval" v-if="activeTabKey === 'approval'">
        <a-table :columns="approvalColumns" :dataSource="approvalList" :pagination="false" rowKey="id"/>
        <br />
      </div>
    </a-card>

    <a-card :bordered="false" v-if="this.recording.type !== 'read'" title="审批意见">
      <a-textarea
        :maxlength="1000"
        placeholder="请输入审批意见, 1000字以内"
        @change="txtChange"
        :value="noted"
      />
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">
      <a-button v-if="recording.type!=='read'&& refusebile"
        type="primary"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>
      &nbsp;
      <a-button v-if="recording.type!=='read'&& refusebile"
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
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { STable,Ellipsis } from '@/components'
import DetailList from '@/components/tools/DetailList'
import { handleRefuse,
  handleApprove,handlePurchase, submitRequire, queryone, getSerialNumber} from '@/api/computation/equipFee'
import {modules, model, getAttachments, downloadAttachment, delAttachment, formStatus
  } from'@/api/computation/upload'
import { handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

export default {
  name: 'TableRead',
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
      noted: '',
      refusebile: true,
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
      approvalList: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'no',
          key: 'no',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '单号',
          dataIndex: 'odd_numbers',
          key: 'odd_numbers',
          width: '130px',
          align: 'center',
          scopedSlots: { customRender: 'odd_numbers' }
        },
        {
          title: '费用类别',
          dataIndex: 'cost_type',
          key: 'cost_type',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'cost_type' }
        },
       
        {
          title: '内容描述',
          dataIndex: 'content_description',
          key: 'content_description',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'content_description' }
        },
        {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '100px',
            align: 'center',
            scopedSlots: { customRender: 'quantity' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
  
        },
        {
          title: '单价（元）',
          dataIndex: 'price',
          key: 'price',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '扣款金额（元）',
          dataIndex: 'deduction_amount',
          key: 'deduction_amount',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'deduction_amount' }
  
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      detailFields: ['no', 'odd_numbers', 'cost_type', 'content_description', 'quantity', 'unit', 'price', 'deduction_amount', 'remark'],
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
          dataIndex: 'user_name',
          key: 'user_name'
        },
        {
          title: '审批状态',
          dataIndex: 'dic_enum_name',
          key: 'dic_enum_name'
        },
        {
          title: '审批意见',
          dataIndex: 'noted',
          key: 'noted'
        },
        {
          title: '审批岗位',
          dataIndex: 'user_position_name',
          key: 'user_position_name'
        },
        {
          title: '审批时间',
          dataIndex: 'approval_time',
          key: 'approval_time'
        }
      ],
      errors: []
    }
  },
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
    txtChange (e) {
      this.noted = e.target.value
    },
    loadEditInfo (data) {
      // console.log(`将加载 ${data.id} 信息到表单`)

      if (data.id) {
        queryone ({ id: data.id, menu_id: 66 }).then(res => {
            this.detailData = res.responseObject.details.map((d, i)=> {
              d.price = d.price.toFixed(2)
              d.deduction_amount = d.deduction_amount.toFixed(2)
              d.remark = d.remark
              d.editable = false
              d.isNew = true
              d.key = d.id
              d.no = i + 1
              return d
            })

            if(this.detailData.length > 0){
              this.detailData.push({
                  key: '0',
                  no: '合计',
                  odd_numbers: '',
                  cost_type: '',  
                  content_description: '',
                  quantity: '',
                  unit: '',
                  price: '',
                  deduction_amount: this.data_sum('deduction_amount'),
                  remark: '',
                  editable: false,
                  isNew: true,
              })
            }


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
        })

        if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 66, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
        }
      }
    },
    // 合计计算
    data_sum (attr) {
      let num = 0
      this.detailData.forEach(x => {
        if (x.no !== '合计') {
          num += parseInt(x[attr] * 100)
        }
      })
      return (num / 100).toFixed(2)
    },
    // 附件下载
    download (record) {
      downloadAttachment({
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
        }],
        type: 0,
        menu_id: 66
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 通过
    approve () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定通过当前审批?`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          that.submitLoading = true
          return handleApprove({
            creator_org_id: that.$store.state.menu_key,
            id: that.recording.id,
            menu_id: 66,
            process_inst_id: that.recording.process_inst_id,
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
        },
        onCancel () {
          that.submitLoading = false
        }
      })
    },
    // 拒绝
    refuse () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定打回当前审批?`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          that.saveLoading = true
          return handleRefuse({
            creator_org_id: that.$store.state.menu_key,
            id: that.recording.id,
            menu_id: 66,
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
        },
        onCancel () {
          that.saveLoading = false
        }
      })
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
