<template>
  <div>
    <a-card class="card" title="安装验收申请单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="验收单位">{{ dataObj.check_org }}</detail-list-item>
        <detail-list-item term="合同编号">{{ dataObj.contract_no }}</detail-list-item>
        <detail-list-item term="安装单位">{{ dataObj.install_org }}</detail-list-item>
        <detail-list-item term="含税合同金额">{{ dataObj.fee_with_tax }}</detail-list-item>
        <detail-list-item term="管理号码">{{ dataObj.manage_code }}</detail-list-item>
        <detail-list-item term="设备名称">{{ dataObj.equip_name}}</detail-list-item>
        <detail-list-item term="合同编号">{{ dataObj.contract_no }}</detail-list-item>
        <detail-list-item term="规格型号">{{ dataObj.spec }}</detail-list-item>
        <detail-list-item term="验收日期">{{ dataObj.check_date }}</detail-list-item>
        <detail-list-item term="安装单位人员">{{ dataObj.install_person }}</detail-list-item>
        <detail-list-item term="验收单位人员">{{ dataObj.check_person}}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 明细 -->
    <a-card class="card" title="验收内容">
      <a-table
        :columns="columns"
        :dataSource="detailData"
          :rowClassName="setRowClassName"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
          <template>{{ text }}</template>
        </template>
      </a-table>

      <div v-if="detailData.length > 0">
        <a-table
          :columns="columnsSum"
          :dataSource="sumData"
          :pagination="false"
          :loading="memberLoading"
          :showHeader="false"
          rowKey="all_total"
        >
          <template v-for="(col, i) in sumFields" :slot="col" slot-scope="text">
            <template>{{ text }}</template>
          </template>
        </a-table>
      </div>
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
        <br />
      </div>
    </a-card>

    <a-card :bordered="false" v-if="this.recording.type !== 'read'" title="审批意见">
      <a-textarea :maxlength="1000" placeholder="请输入审批意见, 1000字以内" @change="txtChange" :value="noted" />
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
        v-if="this.recording.type!=='read'&& refusebile"
        :loading="saveLoading"
        @click="refuse"
      >打回</a-button>&nbsp;
      <a-button
        type="primary"
        v-if="this.recording.type!=='read'&& refusebile"
        @click="approve"
        :loading="submitLoading"
      >通过</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>&nbsp;
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getDeviceList, handlePurchase, submitRequire, queryone, getQueryResult, getQueryCheckItem, queryByCode, handleRefuse, handleApprove } from '@/api/equipmentMobilization/InstallationAcceptance'
import { modules, model, getAttachments, downloadAttachment, delAttachment, queryByEquipment, queryAllEquipment, queryAllContract, queryAllName, queryByName } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
import { handleQueryApprover } from '@/api/common'
const FileSaver = require('file-saver')
import DetailList from '@/components/tools/DetailList'
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
      dataObj: {},
      refusebile: true,
      visible: false,
      visible_name: false,
      visible_true: false,
      value_name: false,
      selectedRowKeys: [],
      number: '',
      activeTabKey: 'attach',
      fileList: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      form: this.$form.createForm(this),

      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          scopedSlots: { customRender: 'code' }
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
            obj.attrs.rowSpan = mergeCells(row.check_item, this.detailData, 'check_item')

            return obj
          }
        },
        {
          title: '验收内容',
          dataIndex: 'content',
          key: 'content',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          width: '500px',
          scopedSlots: { customRender: 'result' }
        }
      ],
      detailFields: ['code', 'inspect_name', 'check_item', 'content', 'result'],
      sumData: [{
        all_total: '验收总结论：',
        check_result: '',
        content1: '结论描述：',
        result1: '',
        editable: true,
        isNew: true
      }],
      columnsSum: [
        {
          title: '序号',
          dataIndex: 'all_total',
          key: 'all_total',
          align: 'center',
          scopedSlots: { customRender: 'all_total' }
        },
        {
          title: '类别',
          dataIndex: 'check_result',
          key: 'check_result',
          // width: '200px',
          scopedSlots: { customRender: 'check_result' }
        },
        {
          title: '验收内容',
          dataIndex: 'content1',
          key: 'content1',
          align: 'center',
          scopedSlots: { customRender: 'content1' }
        },
        {
          title: '验收结果',
          dataIndex: 'check_remarks',
          key: 'check_remarks',
          width: '500px',
          scopedSlots: { customRender: 'check_remarks' }
        }
      ],
      sumFields: ['all_total', 'check_result', 'content1', 'check_remarks'],
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
      errors: [],
      approvalList: [],
      // 索引
      current: Number,
      currentSize: Number,
      noted: ''
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
            menu_id: 36,
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
            menu_id: 36,
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

    txtChange (e) {
      console.log(e)
      this.noted = e.target.value
    },
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
      this.sumData[0]['check_remarks'] = ''
      this.sumData[0]['check_result'] = ''
    },

    setRowClassName(){
      return 'setRowClassName'
    },
    loadEditInfo (data) {
      const { form } = this
      console.log(data)
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        queryone({ id: data.id, menu_id: 36 }).then(res => {
          console.log("一查三", res)
          this.dataObj = res.responseObject
          this.number = true
          this.detailData = res.responseObject.details.map((d, i) => {
            // const arr = d.content.split('丨')
            // d.inspect_name = arr[0]
            // d.check_item = arr[1]
            d.editable = true
            d.isNew = true
            d.code = i + 1
            d.key = d.id + ''
            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            attachment.uid = attachment.id.toString()
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id.toString()
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size.toString()
            attachment.upload_user_id = attachment.upload_user_id.toString()
            attachment.file_size = attachment.file_size.toString()
            attachment.username = attachment.upload_user_name
            return attachment
          })
          this.sumData[0]['check_result'] = res.responseObject.check_result
          this.sumData[0]['check_remarks'] = res.responseObject.check_remarks

          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 36, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }
        })
        // getAttachments({ id_in_module: data.id, module: modules.InstallationAcceptance }).then(res => {
        //   console.log(res)
        //   this.fileList = res.responseList.map(attachment => {
        //     attachment.uid = attachment.id.toString()
        //     attachment.status = 'done'
        //     attachment.url = ''
        //     attachment.key = attachment.id.toString()
        //     attachment.name = attachment.file_name
        //     attachment.size = attachment.file_size.toString()
        //     attachment.upload_user_id = attachment.upload_user_id.toString()
        //     attachment.file_size = attachment.file_size.toString()
        //     attachment.username = attachment.upload_user_name
        //     return attachment
        //   })
        // })
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        type: 0,
        menu_id: 36,
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

// 去掉表格高亮
.setRowClassName {
  background-color: #fff;
}
/deep/ .ant-table-tbody > .setRowClassName:hover > td {
  background-color: #fff;
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
