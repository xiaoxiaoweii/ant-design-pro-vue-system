<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="退场设备材料盘点" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ recording.serial_number }}</detail-list-item>
        <detail-list-item term="工程项目名称">{{ recording.creator_org_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.create_date }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.pro_unit }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card class="card" title="设备明细">
      <a-table
        size="small"
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="code"
        bordered
        class="line-table"
        :scroll="{ x: 800 }"
      ></a-table>
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
        <a-table :columns="approvalColumns" :dataSource="approvalList" :pagination="false" />
      </div>
    </a-card>
    <a-card :bordered="false" v-if="recording.type!=='read'" title="审批意见">
      <a-textarea placeholder="请输入审批意见, 1000字以内" @change="txtChange" :value="noted" />
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
        v-if="recording.type!=='read'"
        type="primary"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <!--  -->
      <a-button
        v-if="recording.type!=='read'"
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
import DetailList from '@/components/tools/DetailList'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { queryone, handleApprove, handleRefuse } from '@/api/equipExit/inventory'
import { EXIT_EQUIP_PLAN_Modules } from '@/api/equipExit/upload'
import { downloadAttachment, getImgView, handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

export default {
  name: 'ExitPlanDetail',
  mixins: [mixin, mixinDevice],
  components: {
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
      refusebile: true,
      noted: '',
      sizeSum: 0,
      picList: [],
      previewVisible: false,
      previewImage: '',
      isrequired: true,
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      approvalList: [],
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
      sizeable: false,
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

      // details table
      detailData: [],
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
          title: '设备材料名称',
          dataIndex: 'material_name',
          key: 'material_name',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'material_name' }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '结存数量',
          dataIndex: 'plan_num',
          key: 'plan_num',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'plan_num' }
        },
        {
          title: '实际数量',
          dataIndex: 'num',
          key: 'num',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '差额',
          dataIndex: 'variable',
          key: 'variable',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'variable' }
        },
        {
          title: '采购单价(元)',
          dataIndex: 'single_price',
          key: 'single_price',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'single_price' }
        },
        {
          title: '已摊销金额(元)',
          dataIndex: 'tanxiao_fee',
          key: 'tanxiao_fee',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'tanxiao_fee' }
        },
        {
          title: '净值单价(元)',
          dataIndex: 'netvalue_single',
          key: 'netvalue_single',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'netvalue_single' }
        },
        {
          title: '净值总价(元)',
          dataIndex: 'netvalue_sum',
          key: 'netvalue_sum',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'netvalue_sum' }
        },
        {
          title: '转让价格(元)',
          dataIndex: 'transfer_price',
          key: 'transfer_price',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'transfer_price' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          width: '200px',
          scopedSlots: { customRender: 'remark' }

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
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: '上传人',
          dataIndex: 'upload_user_name',
          key: 'upload_user_name'
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
        }
      ],
      errors: [],
    }
  },
  activated () {
    this.loadEditInfo(this.recording)
  },
  created () {
    this.queryParam = {}
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  computed: {
    ...mapGetters(['nickname', 'userId']),
    menuCode () {
      return this.$route.meta.menuCode
    },
    creatorOrgId () {
      return this.$store.state.menu_key
    },
    scope_code () {
      return this.creatorOrgId ? this.$store.state.user.first_key : ''
    }
  },

  mounted () {
    this.queryParam = {}
  },
  methods: {
    approve () {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定通过当前审批?`,
        onOk: () => {
          that.submitLoading = true
          handleApprove({
            id: that.recording.id,
           menu_id: this.menuCode,
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
        onOk: () => {
          that.saveLoading = true
          handleRefuse({
            id: that.recording.id,
           menu_id: this.menuCode,
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
    txtChange (e) {
      this.noted = e.target.value
    },
    async loadEditInfo (data) {
      const { form } = this
      if (data.id) {
        await queryone({ id: data.id, menu_id: this.menuCode }).then(res => {
          if (res.status === '0') {
            Object.assign(this.recording, res.responseObject)
            this.detailData = res.responseObject.details.map((detail, index) => {
              detail.code = index + 1
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
          }
        })
        if (this.recording.process_inst_id) {
          handleQueryApprover({ menu_id: this.menuCode, process_inst_id: this.recording.process_inst_id }).then(res => {
            this.approvalList = res.responseObject
          })
        }
      }
    },
    handleGoBack () {
      this.$emit('onGoBack')
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
        menu_id: 96
      }).then(res => {
        res.status ||
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
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
