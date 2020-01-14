<template>
  <div>
    <!-- 基本信息 -->
    <a-card class="card" title="材料点验单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="点验单位">{{ dataObj.item_check_org }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="点验日期">{{ dataObj.item_check_date }}</detail-list-item>
        <detail-list-item term="合同名称">{{ dataObj.contract_name }}</detail-list-item>
        <detail-list-item term="供应商名称">{{ dataObj.supplier_name }}</detail-list-item>
        <detail-list-item term="合同编号">{{ dataObj.contract_no }}</detail-list-item>
        <detail-list-item term="备注">{{ dataObj.remark }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设备明细 -->
    <a-card class="card" title="材料明细" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
        :scroll="{ x: 2400 }"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
          <template>{{ text }}</template>
        </template>
      </a-table>
      <div v-if="0">
        <a-table
          :columns="columnsSum"
          :dataSource="getSum"
          :pagination="false"
          :loading="memberLoading"
          :showHeader="false"
          rowKey="all_total"
          :scroll="{ x: 2250 }"
          bordered
        >
          <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
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
              <!-- <a-divider type="vertical" />
              <a-popconfirm
                title="是否要删除此行？"
                @confirm="removeAttachment(record)"
              >
                <a>
                  <a-icon type="delete" /></a>
              </a-popconfirm>-->
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
      <a-textarea
        :maxlength="1000"
        placeholder="请输入审批意见, 1000字以内"
        @change="txtChange"
        :value="noted"
      />
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
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import DetailList from '@/components/tools/DetailList'
import { getDeviceList, handlePurchase, submitRequire, queryone, getRead, queryTaxRate, getQueryPurchasePrivi, getQueryAmortize, handleRefuse, handleApprove } from '@/api/equipmentMobilization/materialCheck'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, formStatus } from '@/api/equipmentMobilization/upload'
import { handleQueryApprover } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const DetailListItem = DetailList.Item

const selectData = {
  'equipment_unit': [
    {
      title: '台',
      value: '台'
    },
    {
      title: '车',
      value: '车'
    },
    {
      title: '船',
      value: '船'
    }
  ]
}

export default {
  name: 'TableRead',
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
      remark: '',
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
      approvalList: [],
      noted: '',
      activeTabKey: 'attach',
      fileList: [],
      selectData: selectData,
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      buttonCol: {
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12, offset: 5 }
        }
      },
      id: 0,

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
          title: '设备材料名称',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
          width: '150px',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          align: 'center',
          key: 'spec',
          width: '150px',
          scopedSlots: { customRender: 'spec' }
        },

        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          key: 'unit',
          width: '150px',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '材料类别',
          dataIndex: 'material_type',
          align: 'center',
          key: 'material_type',
          width: '150px',
          scopedSlots: { customRender: 'material_type' }
        },
        {
          title: '采购权限',
          dataIndex: 'purchase_privi',
          align: 'center',
          key: 'purchase_privi',
          width: '150px',
          scopedSlots: { customRender: 'purchase_privi' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width: '150px',
          align: 'right',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax',
          key: 'price_without_tax',
          width: '150px',
          align: 'right',
          scopedSlots: { customRender: 'price_without_tax' }

        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          key: 'price_with_tax',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'price_with_tax' }

        },

        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'tax_rate' }

        },
        {
          title: '税额',
          dataIndex: 'tax',
          key: 'tax',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'tax' }

        },
        {
          title: '价税合计（元）',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '总额',
          dataIndex: 'total_amount',
          key: 'total_amount',
          width: '150px',
          align: 'right',
          scopedSlots: { customRender: 'total_amount' }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          key: 'manufacturer',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'manufacturer' }
        },
        {
          title: '是否摊销',
          dataIndex: 'amortize',
          key: 'amortize',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'amortize' }
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
      detailFields: ['code', 'name', 'spec', 'num', 'unit', 'price_without_tax', 'amount_without_tax', 'tax_rate', 'tax', 'amount', 'manufacturer', 'amortize', 'remark'],
      sumData: [{
        code1: '合计',
        spec1: '',
        num1: '',
        amount_without_tax1: '',
        amount1: '',
        manufacturer1: '',
        amortize1: '',
        remark1: '',
        unit1: '',
        tax1: '',
        price_without_tax1: '',
        tax_rate1: '',
        editable: true,
        isNew: true,
      }],
      columnsSum: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '80px',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '设备材料名称',
          dataIndex: 'code1',
          key: 'code1',
          width: '150px',
          scopedSlots: { customRender: 'code1' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec1',
          key: 'spec1',
          width: '150px',
          scopedSlots: { customRender: 'spec1' }
        },

        {
          title: '单位',
          dataIndex: 'unit1',
          key: 'unit1',
          width: '150px',
          scopedSlots: { customRender: 'unit1' }
        },
        {
          title: '材料类别',
          dataIndex: 'material_type1',
          key: 'material_type1',
          width: '150px',
          scopedSlots: { customRender: 'material_type1' }
        },
        {
          title: '采购权限',
          dataIndex: 'purchase_privi1',
          key: 'purchase_privi1',
          width: '150px',
          scopedSlots: { customRender: 'purchase_privi1' }
        },
        {
          title: '数量',
          dataIndex: 'num1',
          key: 'num1',
          width: '150px',
          scopedSlots: { customRender: 'num1' }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax1',
          key: 'price_without_tax1',
          width: '150px',
          scopedSlots: { customRender: 'price_without_tax1' }

        },

        {
          title: '税率(%)',
          dataIndex: 'tax_rate1',
          key: 'tax_rate1',
          width: '150px',
          scopedSlots: { customRender: 'tax_rate1' }

        },
        {
          title: '税额',
          dataIndex: 'tax1',
          key: 'tax1',
          width: '150px',
          scopedSlots: { customRender: 'tax1' }

        },
        {
          title: '价税合计（元）',
          dataIndex: 'amount1',
          key: 'amount1',
          width: '150px',
          scopedSlots: { customRender: 'amount1' }

        },
        {
          title: '不含税金额（元）',
          dataIndex: 'amount_without_tax1',
          key: 'amount_without_tax1',
          width: '150px',
          scopedSlots: { customRender: 'amount_without_tax1' }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer1',
          key: 'manufacturer1',
          width: '150px',
          scopedSlots: { customRender: 'manufacturer1' }
        },
        {
          title: '是否摊销',
          dataIndex: 'amortize1',
          key: 'amortize1',
          width: '150px',
          scopedSlots: { customRender: 'amortize1' }
        },
        {
          title: '备注',
          dataIndex: 'remark1',
          key: 'remark1',
          width: '150px',
          scopedSlots: { customRender: 'remark1' }
        }
      ],
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
  computed: {
    mod () {
      return modules.purchase
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
    getSum () {
      let count_tax = 0
      for (let item of this.detailData) {
        count_tax += item.tax * 1
      }
      this.sumData[0].tax1 = count_tax
      return this.sumData
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
            menu_id: 34,
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
            menu_id: 34,
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
      this.noted = e.target.value
    },

    handleGetInfo () {

    },
    loadEditInfo (data) {
      if (data.id) {
        queryone({ id: data.id, menu_id: 34 }).then(res => {
          this.dataObj = res.responseObject
          let oldNum = 0
          let oldTol = 0
          let oldAmount = 0
          let oldTax = 0
          let oldPrice = 0
          this.detailData = res.responseObject.details.map((d, i) => {
            d.num && (oldNum += Number(d.num))
            d.total_amount && (oldTol += Number(d.total_amount))
            d.amount && (oldAmount += Number(d.amount))
            d.tax && (oldTax += Number(d.tax))
            d.price_without_tax && (oldPrice += Number(d.price_without_tax))
            d.item_check_date = moment(d.item_check_date)
            d.editable = false
            d.isNew = false
            // d.planned_date = moment(d.planned_date)
            d.key = d.id
            d.code = i + 1

            if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
              handleQueryApprover({ menu_id: 34, process_inst_id: this.recording.process_inst_id }).then(res => {
                this.approvalList = res.responseObject
              })
            }

            return d
          })
          this.fileList = res.responseObject.files.map(attachment => {
            attachment.uid = attachment.id + ''
            attachment.status = 'done'
            attachment.url = ''
            attachment.key = attachment.id + ''
            attachment.name = attachment.file_name
            attachment.size = attachment.file_size
            attachment.username = attachment.upload_user_name
            return attachment
          })
          if (this.detailData.length) {

            this.detailData.push({
              key: '0',
              code: '合计',
              editable: false,
              isNew: true,
              name: '',
              spec: '',
              num: oldNum,
              total_amount: oldTol.toFixed(2),
              amount: oldAmount.toFixed(2),
              manufacturer: '',
              amortize: '',
              remark: '',
              unit: '',
              material_type: '',
              purchase_privi: '',
              tax: oldTax,
              price_without_tax: oldPrice.toFixed(2),
              tax_rate: ''
            })
          }
        })

        // getAttachments({ module: modules.purchase, id_in_module: data.id }).then(res => {
        //   this.fileList = res.responseList.map(attachment => {
        //     attachment.uid = attachment.id + ''
        //     attachment.status = 'done'
        //     attachment.url = ''
        //     attachment.key = attachment.id + ''
        //     attachment.name = attachment.file_name
        //     attachment.size = attachment.file_size
        //     attachment.username = attachment.upload_user_name
        //     return attachment
        //   })
        // })
      }
    },
    newDevice () {
      const length = this.detailData.length
      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        name: '',
        spec: 0,
        num: 0,
        amount_without_tax: '',
        amount: '',
        manufacturer: '',
        amortize: '是',
        remark: '',
        unit: '台',
        tax: 0,
        price_without_tax: 0,
        tax_rate: '6',
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

        if (['estimated_price', 'number'].includes(column)) {
          target.amount = (target.estimated_price * target.number).toFixed(2)
          if (isNaN(target.amount)) target.amount = 0

          this.form.setFieldsValue({
            total_amount: newData.reduce((total, d) => {
              return total + Number(d.amount)
            }, 0)
          })
        }

        if (column === 'name') {
          const equipment = this.selectEquData.filter(equ => equ.id === value)[0]
          target.spec = equipment.equSpecs
          target.model = equipment.equModel
          target.equipment_code = equipment.equCode
        }
        this.detailData = newData
      }
    },
    handleSearch (value) {
      getEquList({ equName: value }).then(res => {
        this.selectEquData = res.responseList.map(d => {
          d.title = d.equName
          d.value = d.id
          return d
        })
      })
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 34,
        type: 0,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },

    // 附件删除
    removeAttachment (record) {
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
