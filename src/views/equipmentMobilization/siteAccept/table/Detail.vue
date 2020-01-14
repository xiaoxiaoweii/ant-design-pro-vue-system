<template>
  <div>
    <!-- 进场验收单 -->
    <a-card class="card" title="进场验收单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="设备类型">{{ dataObj.equip_type }}</detail-list-item>
        <detail-list-item term="设备来源">{{ dataObj.equip_source }}</detail-list-item>
        <detail-list-item term="设备名称">{{ dataObj.equip_name }}</detail-list-item>
        <detail-list-item term="型号规格">{{ dataObj.specification }}</detail-list-item>
        <detail-list-item :term="reName">{{ dataObj.requisition }}</detail-list-item>
        <detail-list-item term="管理号码">{{ dataObj.manage_code }}</detail-list-item>
        <detail-list-item term="功率（KW）">{{ dataObj.power }}</detail-list-item>
        <detail-list-item term="生产厂家">{{ dataObj.manufacturer }}</detail-list-item>

        <detail-list-item v-if="value === '调拨单号'" term="购置日期">{{ dataObj.purchase_date }}</detail-list-item>
        <detail-list-item v-if="value === '调拨单号'" term="所在地">{{ dataObj.location }}</detail-list-item>
        <detail-list-item v-if="value === '调拨单号'" term="使用单位">{{ dataObj.use_org }}</detail-list-item>

        <detail-list-item term="出厂日期">{{ dataObj.production_time }}</detail-list-item>
        <detail-list-item term="原值（元）">{{ dataObj.original_value }}</detail-list-item>
        <detail-list-item term="净值（元）">{{ dataObj.net_value }}</detail-list-item>
        <detail-list-item term="进场日期">{{ dataObj.in_date }}</detail-list-item>
        <detail-list-item term="退场日期">{{ dataObj.out_date }}</detail-list-item>
        <detail-list-item term="被验收单位">{{ dataObj.accept_from }}</detail-list-item>
        <detail-list-item term="被验收人">{{ dataObj.acceptance_from_person }}</detail-list-item>
        <detail-list-item term="使用部位">{{ dataObj.use_site }}</detail-list-item>
        <detail-list-item term="验收单位">{{ dataObj.accept_to }}</detail-list-item>
        <detail-list-item term="验收日期">{{ dataObj.accept_date }}</detail-list-item>
        <detail-list-item term="验收人">{{ dataObj.accept_to_person }}</detail-list-item>
        <detail-list-item term="技术状况">{{ dataObj.technical_condition }}</detail-list-item>
        <detail-list-item term="车牌号">{{ dataObj.car_num }}</detail-list-item>
        <detail-list-item v-if="dataObj.equip_source === '租赁设备'" term="租赁单价">{{ dataObj.lease_price }}</detail-list-item>
        <detail-list-item term="设备编码">{{ dataObj.equip_code }}</detail-list-item>
        <detail-list-item term="单位">{{ dataObj.unit }}</detail-list-item>
        <detail-list-item term="备注">{{ dataObj.remark }}</detail-list-item>
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
          bordered
        ></a-table>
        <div v-if="acceptData.length > 0">
          <a-table
            :columns="acceptColumnsSum"
            :dataSource="sumData"
            :pagination="false"
            :loading="memberLoading"
            :showHeader="false"
            rowKey="all_total"
          ></a-table>
        </div>
      </div>
      <!-- 人员证件 -->
      <div v-if="activeTabKey === 'name'">
          <a-table
            :columns="columns"
            :dataSource="nameData"
            :pagination="false"
            :loading="memberLoading"
            rowKey="key"
            bordered
          ></a-table>
      </div>
      <!-- 设备证件 -->
      <div v-if="activeTabKey === 'equipment'">
          <a-table
            :columns="columns_equip"
            :dataSource="equipData"
            :pagination="false"
            :loading="memberLoading"
            rowKey="key"
            bordered
          ></a-table>
      </div>

      <!-- 资质附件 -->
      <div v-if="activeTabKey === 'attach'">
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
      <a-button
        type="primary"
        v-if="this.recording.type!=='read'&& refusebile"
        @click="refuse"
        :loading="saveLoading"
      >打回</a-button>&nbsp;
      <a-button
        type="primary"
        v-if="this.recording.type!=='read'&& refusebile"
        @click="approve"
        :loading="submitLoading"
      >通过</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import { mapGetters } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  queryone,
  handleRefuse,
  handleApprove
} from '@/api/equipmentMobilization/siteAccept'
import {
  modules,
  getAttachments,
  downloadAttachment
} from '@/api/equipmentMobilization/upload'
import { handleQueryApprover } from '@/api/common'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
const FileSaver = require('file-saver')

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
  name: '进场验收单',
  mixins: [mixin, mixinDevice],
  components: {
    DetailList,
    DetailListItem,
    FooterToolBar
  },
  props: {
    recording: {
      type: [Object, String],
      default: ''
    }
  },
  computed: {
    reName () {
      return this.dataObj.equip_source === '自有设备' ? '调拨单号' : '合同号'
    }
  },
  data () {
    return {
      tabList: [
        {
          key: 'accept',
          tab: '验收记录'
        },
        {
          key: 'name',
          tab: '人员证件'
        },
        {
          key: 'equipment',
          tab: '设备证件'
        },
        {
          key: 'attach',
          tab: '资质附件'
        },
        {
          key: 'approval',
          tab: '审批记录'
        }
      ],
      dataObj: {},
      noted: '',
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
      refusebile: true,
      value: '调拨单号',
      number: '',
      approvalList: [],
      serial_number: '',
      activeTabKey: 'accept',
      fileList: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      form: this.$form.createForm(this),
      id: 0,
      acceptData: [],
      acceptColumns: [
        {
          title: '序号',
          dataIndex: 'code',
          align: 'center',
          key: 'code'
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
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' },
          width: '400px'
        }
      ],

      sumData: [
        {
          code2: '验收总结论：',
          check_item1: '结论描述：',
          result: '良好',
          check_remark: '备注',
          editable: true,
          isNew: true
        }
      ],
      acceptColumnsSum: [
        {
          title: '序号',
          dataIndex: 'code2',
          key: 'code2',
          width: '300px',
          align: 'center'
          // scopedSlots: { customRender: 'code2' }
        },
        {
          title: '验收结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: { customRender: 'result' }
          // width:'150px'
        },
        {
          title: '项目',
          dataIndex: 'check_item1',
          key: 'check_item1',
          align: 'center'
          // scopedSlots: { customRender: 'check_item1' },
        },
        {
          title: '评价说明',
          dataIndex: 'check_remark',
          key: 'check_remark',
          scopedSlots: { customRender: 'check_remark' },
          width: '400px'
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: 'name_code',
          key: 'naname_code',
          scopedSlots: { customRender: 'name_code' }
        },
        {
          title: '操作手姓名',
          dataIndex: 'operator_name',
          key: 'operator_name',
          scopedSlots: { customRender: 'operator_name' }
        },
        {
          title: '身份证号码',
          dataIndex: 'identity_no',
          key: 'identity_no',
          scopedSlots: { customRender: 'identity_no' }
        },
        {
          title: '联系电话',
          dataIndex: 'telephone',
          key: 'telephone',
          scopedSlots: { customRender: 'telephone' }
        },
        {
          title: '操作证名称',
          dataIndex: 'certificate_name',
          key: 'certificate_name',
          scopedSlots: { customRender: 'certificate_name' }
        },
        {
          title: '操作证编号',
          dataIndex: 'certificate_no',
          key: 'certificate_no',
          scopedSlots: { customRender: 'certificate_no' }
        },
        {
          title: '操作证到期日期',
          dataIndex: 'certificate_expire_on',
          key: 'certificate_expire_on',
          scopedSlots: { customRender: 'certificate_expire_on' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '是否默认使用',
          dataIndex: 'employ',
          key: 'employ',
          scopedSlots: { customRender: 'employ' }
        }
      ],
      nameData: [],
      nameFields: [
        'name_code',
        'operator_name',
        'identity_no',
        'telephone',
        'certificate_name',
        'certificate_no',
        'certificate_expire_on',
        'state',
        'employ'
      ],
      columns_equip: [
        {
          title: '序号',
          dataIndex: 'equip_code',
          key: 'equip_code',
          scopedSlots: { customRender: 'equip_code' }
        },
        {
          title: '证件名称',
          dataIndex: 'cetificate_name',
          key: 'cetificate_name',
          scopedSlots: { customRender: 'cetificate_name' }
        },
        {
          title: '证件编号',
          dataIndex: 'cetificate_no',
          key: 'cetificate_no',
          scopedSlots: { customRender: 'cetificate_no' }
          // width:'150px'
        },
        {
          title: '检验到期日期',
          dataIndex: 'check_expire_date',
          key: 'check_expire_date',
          scopedSlots: { customRender: 'check_expire_date' }
        },
        {
          title: '检验机构',
          dataIndex: 'check_org_name',
          key: 'check_org_name',
          scopedSlots: { customRender: 'check_org_name' }
        },
        {
          title: '检验周期',
          dataIndex: 'check_interval',
          key: 'check_interval',
          scopedSlots: { customRender: 'check_interval' }
        },
        {
          title: '周期单位',
          dataIndex: 'interval_unit',
          key: 'interval_unit',
          scopedSlots: { customRender: 'interval_unit' }
          // width:'150px'
        },
        {
          title: '保险到期日期',
          dataIndex: 'insurance_expire_date',
          key: 'insurance_expire_date',
          scopedSlots: { customRender: 'insurance_expire_date' }
        },
        {
          title: '是否默认使用',
          dataIndex: 'employ',
          key: 'employ',
          scopedSlots: { customRender: 'employ' }
        },
        // {
        //   title: '操作',
        //   key: 'action',
        //   width: '80px',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
      equipData: [],
      equipFields: [
        'equip_code',
        'cetificate_name',
        'cetificate_no',
        'check_expire_date',
        'check_org_name',
        'check_interval',
        'interval_unit',
        'insurance_expire_date',
        'employ'
      ],
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
      errors: [],

      // 索引
      current: Number,
      currentSize: Number
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
  },
  methods: {
    ...mapGetters(['nickname']),
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
            menu_id: 33,
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
            menu_id: 33,
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
    handleGoBack () {
      this.$emit('onGoBack')
    },

    async loadEditInfo (data) {
      const { form } = this
      console.log(data)
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        await queryone({ id: data.id, menu_id: 33 }).then(res => {
          console.log('一查三', res)
          this.dataObj = res.responseObject
          this.number = true
          this.value = res.responseObject.equip_source || '调拨单号'
          this.serial_number = res.responseObject.serial_number
          this.sumData[0]['result'] = res.responseObject.result
          this.sumData[0]['check_remark'] = res.responseObject.check_remark
          this.acceptData = res.responseObject.details.map((d, i) => {
            // const arr = d.check_item.split('丨')
            // d.inspect_name = arr[0]
            // d.check_item = arr[1]
            d.result = d.result
            d.editable = true
            d.isNew = true
            d.key = d.id + ''
            d.code = i + 1
            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
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
            handleQueryApprover({ menu_id: 33, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }
          this.nameData = res.responseObject.details1.map((d, i) => {
            // d.certificate_expire_on = moment(d.certificate_expire_on)
            d.editable = true
            d.isNew = true
            d.name_code = i + 1
            d.key = d.id + ''
            return d
          })
          this.equipData = res.responseObject.details2.map((d, i) => {
            // d.check_expire_date = moment(d.check_expire_date)
            // d.insurance_expire_date = moment(d.insurance_expire_date)
            d.editable = true
            d.isNew = true
            d.equip_code = i + 1
            d.key = d.id + ''
            return d
          })
        })
        // getAttachments({ id_in_module: data.id, module: modules.siteAccept }).then(res => {
        //   // console.log(res)
        //   this.fileList = res.responseList.map(attachment => {
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
        this.nameData = this.nameData.map((item, index) => {
          item.code = index
          return item
        })
        this.equipData = this.equipData.map((item, index) => {
          item.code = index
          return item
        })
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 33,
        type: 0,
        details: [
          {
            filePath: record.file_path,
            fileName: record.file_name
          }
        ]
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
/deep/ .ant-table-body .ant-select-selection--single {
  width: 100px;
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
