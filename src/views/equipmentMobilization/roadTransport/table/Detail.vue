<template>
  <div>
    <!-- 基本设备需求计划信息 -->
    <a-card class="card" title="路用车进场验收单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 路用车明细 -->
    <a-card class="card" title="车辆明细">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
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
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <br />
        <a-table
          :columns="attachColumns"
          :dataSource="fileList"
          :pagination="false"
          :loading="memberLoading"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <template slot="operation" slot-scope="text, record">
            <span>
              <a @click="download(record)" title="下载">
                <a-icon type="cloud-download" />
              </a>
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div class="approval" v-if="activeTabKey === 'approval'">
        <br />
        <a-table :columns="approvalColumns" :dataSource="approvalList" :pagination="false" />
      </div>
    </a-card>

    <a-card :bordered="false" v-if="this.recording.type !== 'read'" title="审批意见">
      <a-textarea :maxlength="1000" placeholder="请输入审批意见, 1000字以内" @change="txtChange" :value="noted" />
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button
        type="primary"
        v-if="this.recording.type!=='read'&& refusebile"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <a-button
        v-if="this.recording.type!=='read'&& refusebile"
        type="primary"
        @click="approve"
        :loading="submitLoading"
      >通过</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { STable } from '@/components'
import { handleQueryApprover } from '@/api/common'
import {
  queryone,
  handleRefuse,
  handleApprove
} from '@/api/equipmentMobilization/roadTransport'
import { modules, getAttachments, downloadAttachment } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: 'TableEdit',
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
      noted: '',
      dataObj: {},
      refusebile: true,
      activeTabKey: 'attach',
      fileList: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,

      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '车辆名称',
          dataIndex: 'car_name',
          key: 'car_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'car_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'spec' }
        },

        {
          title: '车号',
          dataIndex: 'car_no',
          key: 'car_no',
          align: 'center',
          with: '150px',
          scopedSlots: { customRender: 'car_no' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          key: 'supplier_name',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'supplier_name' }
        },
        {
          title: '扣车时间',
          dataIndex: 'buckle_time',
          key: 'buckle_time',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'buckle_time' }
        },
        {
          title: '计划还车时间',
          dataIndex: 'planned_return_time',
          key: 'planned_return_time',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'planned_return_time' }

        },
        {
          title: '主要技术性能 ',
          key: 'reply',
          align: 'center',
          children: [
            {
              title: '厂段修到期时间',
              dataIndex: 'expire',
              key: "expire",
              align: 'center',
              width: '200px',
              scopedSlots: { customRender: 'expire' }
            },
            {
              title: '走行部分',
              dataIndex: 'running',
              key: "running",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'running' }
            },
            {
              title: '制动部分',
              dataIndex: 'braking',
              key: "braking",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'braking' }

            },
            {
              title: '车钩缓冲',
              dataIndex: 'coupling_buffer',
              key: "coupling_buffer",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'coupling_buffer' }
            },
            {
              title: '车体部分',
              dataIndex: 'car_body',
              key: "car_body",
              align: 'center',
              width: '150px',
              scopedSlots: { customRender: 'car_body' }
            }
          ]
        },
        {
          title: '其他',
          dataIndex: 'other',
          key: 'other',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'other' }
        },
        {
          title: '验收人',
          dataIndex: 'check_person',
          key: 'check_person',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'check_person' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          width: '150px',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      detailFields: ['code', 'car_name', 'spec', 'car_no', 'num', 'supplier_name', 'buckle_time', 'planned_return_time', 'expire', 'running', 'braking', 'coupling_buffer', 'car_body', 'other', 'check_person', 'remark'],
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
      approvalList: [],
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
          title: '审批环节',
          dataIndex: 'activity_inst_name',
          key: 'activity_inst_name'
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
            menu_id: 37,
            process_inst_id: that.recording.process_inst_id,
            noted: that.noted
          }).then(res => {
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.submitLoading = false
              that.handleGoBack() // 返回列表页
            }
          })
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
            menu_id: 37,
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

    loadEditInfo (data) {
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {

        queryone({ id: data.id, menu_id: 37 }).then(res => {
          this.dataObj = res.responseObject
          this.detailData = res.responseObject.details.map((d, i) => {
            d.num = d.num
            d.code = i + 1
            d.key = d.id + ''
            d.editable = true
            d.isNew = true
            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 37, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }
        })
        // getAttachments({ module: modules.roadTransport, id_in_module: data.id }).then(res => {
        //   this.fileList = res.responseList.map(attachment => {
        //     attachment.upload_user_id = attachment.upload_user_id.toString()
        //     attachment.file_size = attachment.file_size.toString()
        //     attachment.uid = attachment.id.toString()
        //     attachment.status = 'done'
        //     attachment.url = ''
        //     attachment.key = attachment.id.toString()
        //     attachment.name = attachment.file_name
        //     attachment.size = attachment.file_size.toString()
        //     attachment.file_size = attachment.file_size.toString()
        //     attachment.upload_user_id = attachment.upload_user_id.toString()
        //     attachment.username = attachment.upload_user_name
        //     return attachment
        //   })
        // })
      }
    },

    txtChange (e) {
      console.log(e)
      this.noted = e.target.value
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        type: 0,
        menu_id: 37,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
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
