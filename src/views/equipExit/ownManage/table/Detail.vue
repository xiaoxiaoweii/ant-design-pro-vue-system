<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="自有设备鉴定单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ recording.serial_number }}</detail-list-item>
        <detail-list-item term="工程项目名称">{{ recording.creator_org_name }}</detail-list-item>
        <detail-list-item term="编制单位">{{ recording.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ recording.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ recording.create_date }}</detail-list-item>
        <detail-list-item term="设备名称">{{ recording.name }}</detail-list-item>
        <detail-list-item term="设备编码">{{ recording.equip_code || '--' }}</detail-list-item>
        <detail-list-item term="管理号码">{{ recording.manage_code }}</detail-list-item>
        <detail-list-item term="规格型号">{{ recording.spec }}</detail-list-item>
        <detail-list-item term="单位">{{ recording.unit || '--' }}</detail-list-item>
        <detail-list-item term="生产厂家">{{ recording.manufacturer }}</detail-list-item>
        <detail-list-item term="购置日期">{{ recording.purchase_date }}</detail-list-item>
        <detail-list-item term="出厂日期">{{ recording.prod_date }}</detail-list-item>
        <detail-list-item term="原值(元)">{{ recording.original_value }}</detail-list-item>
        <detail-list-item term="净值(元)">{{ recording.net_value }}</detail-list-item>
        <detail-list-item term="折旧年限">{{ recording.depreciation_period }}年</detail-list-item>
        <detail-list-item term="使用单位">{{ recording.use_org }}</detail-list-item>
        <detail-list-item term="产权单位">{{ recording.owner_org }}</detail-list-item>
        <detail-list-item term="鉴定日期">{{ recording.check_date }}</detail-list-item>
        <detail-list-item term="所在地">{{ recording.location }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- file upload and approval record-->
    <a-card
      class="card"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <!-- 验收结果 -->
      <div class="accept" v-if="activeTabKey === 'accept'">
        <a-table
          ref="table"
          :columns="acceptColumns"
          :pagination="false"
          :dataSource="acceptData"
          :loading="memberLoading"
          rowKey="key"
          :scroll="{ x: 1100 }"
          bordered
        ></a-table>
        <div v-if="acceptData.length > 0">
          <a-table
            :columns="acceptColumnsSum"
            :dataSource="sumData"
            :pagination="false"
            :loading="memberLoading"
            :showHeader="false"
            rowKey="key"
          ></a-table>
        </div>
      </div>
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
        v-if="recording.type!=='read'&& refusebile"
        type="primary"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <!--  -->
      <a-button
        v-if="recording.type!=='read'&& refusebile"
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
import { queryone, handleApprove, handleRefuse } from '@/api/equipExit/own'
import { downloadAttachment, getImgView, handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item
let temp = {} // 当前重复的值,支持多列
const mergeCells = (text, array, columns) => {
  let i = 0
  if (temp[columns] !== text) {
    temp[columns] = text
    array.forEach(item => {
      if (item.check_item === temp[columns]) {
        i += 1
      }
    })
  }
  return i
}

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
          key: 'accept',
          tab: '验收记录'
        },
        {
          key: 'attach',
          tab: '附件上传'
        },
        {
          key: 'approval',
          tab: '审批记录'
        }
      ],
      visible: false,
      sizeable: false,
      activeTabKey: 'accept',
      fileList: [],
      acceptData: [],
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
      acceptColumns: [
        {
          title: '序号',
          dataIndex: 'key',
          key: 'key'
        },
        {
          title: '验收项目',
          dataIndex: 'check_item',
          key: 'check_item',
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = mergeCells(row.check_item, this.acceptData, 'check_item')

            return obj
          }
        },
        {
          title: '验收内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: { customRender: 'result' }
        },

        {
          title: '评价说明',
          width: '400px',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' }
        }
      ],
      acceptColumnsSum: [
        {
          title: '序号',
          dataIndex: 'code2',
          key: 'code2',
          width: '300px',
          align: 'center'
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: '项目',
          dataIndex: 'check_item1',
          key: 'check_item1',
          align: 'center'
        },
        {
          title: '评价说明',
          width: '400px',
          dataIndex: 'check_remark',
          key: 'check_remark',
          scopedSlots: { customRender: 'check_remark' }
        }
      ],
      sumData: [
        {
          key: '1',
          code2: '验收总结论：',
          check_item1: '结论描述：',
          result: '良好',
          check_remark: '备注',
          editable: true,
          isNew: true
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
      let details = []
      for (let i in this.detailData) {
        details.push({})
        if (this.detailData[i].approved_rent_num === null || this.detailData[i].approved_rent_num === '' || this.detailData[i].approved_rent_num === undefined) return this.$notification['warning']({
          message: '提示',
          description: '租赁数量必填'
        })

        if (this.detailData[i].approved_purchase_num === null || this.detailData[i].approved_purchase_num === '' || this.detailData[i].approved_purchase_num === undefined) return this.$notification['warning']({
          message: '提示',
          description: '采购数量必填'
        })
        if (this.detailData[i].approved_alloc_num === null || this.detailData[i].approved_alloc_num === '' || this.detailData[i].approved_alloc_num === undefined) return this.$notification['warning']({
          message: '提示',
          description: '调拨数量必填'
        })

        details[i].approved_alloc_num = this.detailData[i].approved_alloc_num
        details[i].approved_purchase_num = this.detailData[i].approved_purchase_num
        details[i].approved_rent_num = this.detailData[i].approved_rent_num
        details[i].id = this.detailData[i].id
      }
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
            noted: that.noted,
            details
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
            this.sumData[0]['result'] = res.responseObject.check_result
            this.sumData[0]['check_remark'] = res.responseObject.check_remark
            this.acceptData = res.responseObject.details.map((d, i) => {
              d.key = i + 1
              return d
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
        menu_id: 15
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

/deep/ div.ant-col-6 > div.ant-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/deep/ div.ant-col-6 > div.ant-row > div.ant-col-sm-6 {
  width: 80px;
}
/deep/ div.ant-col-19 {
  width: 70%;
}
/deep/ div.ant-col-5 {
  width: 30%;
}
</style>
