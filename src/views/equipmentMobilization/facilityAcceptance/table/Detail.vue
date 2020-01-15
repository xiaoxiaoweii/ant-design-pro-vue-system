<template>
  <div>
    <!-- 基本设备需求计划信息 -->
    <a-card class="card" title="临时设施验收单" :bordered="false">
      <detail-list>
        <detail-list-item term="单据编号">{{ dataObj.serial_number }}</detail-list-item>
        <detail-list-item term="编制单位">{{ dataObj.pro_unit }}</detail-list-item>
        <detail-list-item term="编制人">{{ dataObj.creator_user_name }}</detail-list-item>
        <detail-list-item term="编制日期">{{ dataObj.create_date }}</detail-list-item>
        <detail-list-item term="验收单位">{{ dataObj.check_org }}</detail-list-item>
        <detail-list-item term="合同编号">{{ dataObj.contract_num }}</detail-list-item>
        <detail-list-item term="安装单位">{{ dataObj.install_org }}</detail-list-item>
        <detail-list-item term="含税合同金额">{{ dataObj.fee_with_tax }}</detail-list-item>
        <detail-list-item term="验收日期">{{ dataObj.check_date }}</detail-list-item>
        <detail-list-item term="临时设施工程">{{ dataObj.install_project }}</detail-list-item>
        <detail-list-item term="安装单位人员">{{ dataObj.install_person }}</detail-list-item>
        <detail-list-item term="验收单位人员">{{ dataObj.check_person }}</detail-list-item>
      </detail-list>
    </a-card>

    <!-- 设施明细 -->
    <a-card class="card" title="设施明细">
      <a-table
        :expandedRowKeys="curExpandedRowKeys"
        :columns="ipValue === '水力' ? columns2 : columns1"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        @expand="expand"
        rowKey="key"
        bordered
        :scroll="ipValue === '水力' ? { x: 1100 } : { x: 1700 }"
      >
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="columnsSon"
          :dataSource="detailData[record.key - 1].waterElectricityDetails"
          :pagination="false"
          :loading="memberLoading"
          rowKey="key"
          bordered
          :scroll="{ x: 1100 }"
        >
          <template v-for="(col, i) in detailFields2" :slot="col" slot-scope="text">
            <template>{{ text }}</template>
          </template>
        </a-table>
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text">
          <template>{{ text }}</template>
        </template>
      </a-table>
    </a-card>

    <!-- 验收内容 -->
    <a-card class="card" title="验收内容">
      <a-table
        bordered
        :columns="columns_result"
        :dataSource="result_detailData"
          :rowClassName="setRowClassName"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
      >
        <template v-for="(col, i) in result_detailFields" :slot="col" slot-scope="text">
          <template>{{ text }}</template>
        </template>
      </a-table>
      <div>
        <a-table
          v-if="result_detailData.length > 0"
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
import pick from 'lodash.pick'
import { STable, ZTree } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { handlePurchase, queryone, getQueryResult, getQuerySource, getQueryCheckItem, handleRefuse, handleApprove } from '@/api/equipmentMobilization/facilityAcceptance'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, queryAllContract, queryAllEquipment, queryByEquipment } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
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
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
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
  data () {
    return {
      dataObj: {},
      approvalList: [],
      noted: '',
      refusebile: true,
      curExpandedRowKeys: [],
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
      number: '',
      ipValue: '',
      serial_number: '',
      activeTabKey: 'attach',
      fileList: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      queryList: [],
      form: this.$form.createForm(this),
      id: 0,

      // 设施 table
      detailData: [],
      columnsTitle1: {
        code: '序号',
        source: '来源',
        name: '名称',
        spec: '规格',
        num: '编号',
        multiplying_power: '倍率',
        product_org: '生产厂家',
        use_site: '使用部位',
        use_org: '使用单位',
        electric_meter_number: '电表数量',
        remark: '备注'
      },
      columns1: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '来源',
          dataIndex: 'source',
          key: 'source',
          align: 'center',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '编号',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '初始读数',
          dataIndex: 'initial_number',
          key: 'initial_number',
          align: 'center',
          scopedSlots: { customRender: 'initial_number' }
        },
        {
          title: '倍率',
          dataIndex: 'multiplying_power',
          key: 'multiplying_power',
          align: 'center',
          scopedSlots: { customRender: 'multiplying_power' }
        },
        {
          title: '生产厂家',
          dataIndex: 'product_org',
          key: 'product_org',
          align: 'center',
          scopedSlots: { customRender: 'product_org' }
        },
        {
          title: '使用部位',
          dataIndex: 'use_site',
          key: 'use_site',
          align: 'center',
          scopedSlots: { customRender: 'use_site' }
        },
        // {
        //   title: '使用单位',
        //   dataIndex: 'use_org',
        //   key: 'use_org',
        //   align: 'center',
        //   scopedSlots: { customRender: 'use_org' }
        // },
        {
          title: '电表数量',
          dataIndex: 'electric_meter_number',
          key: 'electric_meter_number',
          align: 'center',
          scopedSlots: { customRender: 'electric_meter_number' }
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
      columnsTitle2: {
        code: '序号',
        name: '名称',
        spec: '规格',
        num: '编号',
        use_site: '使用部位',
        use_org: '使用单位',
        electric_meter_number: '水电数量',
        remark: '备注'
      },
      columns2: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          align: 'center',
          width: '100px',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '编号',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '初始读数',
          dataIndex: 'initial_number',
          key: 'initial_number',
          align: 'center',
          scopedSlots: { customRender: 'initial_number' }
        },
        {
          title: '使用部位',
          dataIndex: 'use_site',
          key: 'use_site',
          align: 'center',
          scopedSlots: { customRender: 'use_site' }
        },
        // {
        //   title: '使用单位',
        //   dataIndex: 'use_org',
        //   key: 'use_org',
        //   align: 'center',
        //   scopedSlots: { customRender: 'use_org' }
        // },
        {
          title: '水电数量',
          dataIndex: 'water_meter_number',
          key: 'water_meter_number',
          align: 'center',
          scopedSlots: { customRender: 'water_meter_number' }
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

      columnsSon: [],
      columnsSon2: [
        {
          title: '',
          dataIndex: 'ppp',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'ppp' }
        },
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '初始读数',
          dataIndex: 'initial_number',
          key: 'initial_number',
          align: 'center',
          scopedSlots: { customRender: 'initial_number' }
        },
        {
          title: '倍率',
          dataIndex: 'multiplying_power',
          key: 'multiplying_power',
          align: 'center',
          scopedSlots: { customRender: 'multiplying_power' }
        },
        {
          title: '计量表编号',
          dataIndex: 'num',
          key: 'num',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '使用部位',
          dataIndex: 'use_site',
          key: 'use_site',
          align: 'center',
          scopedSlots: { customRender: 'use_site' }
        },
        {
          title: '使用单位',
          dataIndex: 'use_org',
          key: 'use_org',
          align: 'center',
          scopedSlots: { customRender: 'use_org' }
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
      detailFields: ['electric_meter_number', 'spec', 'multiplying_power', 'initial_number', 'name', 'num', 'product_org', 'use_site', 'use_org', 'remark', 'source'],
      detailFields2: ['name', 'spec', 'num', 'multiplying_power', 'use_site', 'use_org', 'remark', 'initial_number'],
      // 验收数据
      result_Data: [
        {
          'check_code': '001',
          code: '1',
          check_item: '发动机',
          content: '声响，排烟情况',
          result: '符合要求'
        },
        {
          'check_code': '00101',
          code: '2',
          check_item: '变压器',
          content: '主机情况',
          result: '符合要求'
        },
        {
          'check_code': '00102',
          code: '3',
          check_item: '配电室',
          content: '跑、冒、滴、漏情况',
          result: '符合要求'
        },
        {
          'check_code': '00103',
          code: '4',
          check_item: '配电线路',
          content: '清洁、润滑及其它',
          result: '符合要求'
        },
        {
          'check_code': '002',
          code: '5',
          check_item: '底盘',
          content: '整体情况',
          result: '符合要求'
        },
        {
          'check_code': '00201',
          code: '6',
          check_item: '配电箱',
          content: '调整紧固、声响情况',
          result: '符合要求'
        }
      ],
      result_detailData: [],
      columns_result: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          align: 'center',
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
            obj.attrs.rowSpan = mergeCells(row.check_item, this.result_detailData, 'check_item')

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
        }
      ],
      result_detailFields: ['code', 'check_item', 'content', 'result'],
      sumData: [{
        all_total: '验收总结论：',
        check_result: '符合要求',
        content1: '结论描述：',
        check_remark: '',
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
          // align: 'center',
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
          dataIndex: 'check_remark',
          key: 'check_remark',
          // align: 'center',
          scopedSlots: { customRender: 'check_remark' }
        }
      ],
      sumFields: ['all_total', 'check_result', 'content1', 'check_remark'],
      attachColumns: [
        // {
        //   title: '序号',
        //   dataIndex: 'id_in_module',
        //   key: 'id_in_module'
        // },
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
      ]
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
            menu_id: 35,
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
            menu_id: 35,
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

    setRowClassName(){
      return 'setRowClassName'
    },
    txtChange (e) {
      console.log(e)
      this.noted = e.target.value
    },
    // 返回
    handleGoBack () {
      this.$emit('onGoBack')
    },
    handleChangeValue (e) {
      console.log(e)
      this.ipValue = e
      if (e === '电力') {
        this.equip_code = '391804561'
        this.columnsSon = this.columnsSon2
      } else if (e === '水力') {
        this.equip_code = '391802745'
        this.columnsSon = this.columnsSon2.filter(x => {
          return x.dataIndex !== 'multiplying_power'
        })
      }
      this.detailData = []
      this.result_detailData = []
      // 根据选择安装工程类型加载验收记录
      getQueryCheckItem({
        menu_id: 35,
        equip_code: this.equip_code
        // equip_name: dataArr.equipment_name,
        // equipment_category_code: dataArr.equipment_category_code
      }).then(res => {
        this.result_detailData = res.responseList.map((d, i) => {
          d.check_item = d.inspect_name || '--'
          d.content = d.inspect_content || '--'
          d.result = '符合要求'
          d.editable = true
          d.isNew = true
          d.key = i + 1
          d.code = i + 1
          return d
        })
      })
    },

    async loadEditInfo (data) {
      const { form } = this
      // console.log(data)
      console.log(`将加载 ${data.id} 信息到表单`)
      // this.result_detailData = this.result_Data.map((d, i) => {
      //   d.key = i
      //   // d.code = d.code
      //   // d.check_item = d.check_item
      //   // d.content = d.content
      //   // d.result = d.result
      //   d.editable = true
      //   d.isNew = true
      //   return d
      // })
      if (data.id) {
        await queryone({ id: data.id, menu_id: 35 }).then(res => {
          this.number = true
          data = res.responseObject
          this.handleChangeValue(data.install_project)
          if (data.install_project === '水力') res.responseObject.details = res.responseObject.details1
          this.dataObj = res.responseObject
          this.serial_number = res.responseObject.serial_number

          if (this.recording.process_inst_id && this.recording.process_inst_id !== '--') {
            handleQueryApprover({ menu_id: 35, process_inst_id: this.recording.process_inst_id }).then(res => {
              this.approvalList = res.responseObject
            })
          }
          this.handleChangeValue(data.install_project)

          this.detailData = res.responseObject.details.map((d, i) => {
            d.editable = true
            d.isNew = true
            d.code = i + 1
            d.key = i + 1
            d.waterElectricityDetails = []
            if (i === 0) this.curExpandedRowKeys[0] = d.key

            res.responseObject.waterElectricityDetails.forEach((x, index) => {
              if (x.temp_facility_check_id === d.id) {
                x.editable = true
                x.isNew = true
                x.code = index + 1
                x.key = index + 1
                x.pid = d.key

                d.waterElectricityDetails.push(x)
              }
            })
            console.log(d.waterElectricityDetails, '121212')
            d.waterElectricityDetails.forEach((c, n) => {
              c.code = n + 1
            })

            return d
          })
          console.log(this.detailData)
          this.result_detailData = res.responseObject.detail.map((d, i) => {
            // d.result = d.result
            console.log(d.result)
            d.editable = true
            d.isNew = true
            d.code = i + 1
            d.key = d.id + ''
            return d
          })
          this.sumData[0]['check_result'] = res.responseObject.check_result
          this.sumData[0]['check_remark'] = res.responseObject.check_remark
        })
        getAttachments({ id_in_module: data.id, module: modules.facilityAcceptance }).then(res => {
          console.log(res)
          this.fileList = res.responseList.map(attachment => {
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
        })
      }
    },

    // 设施明细 表格展开事件 控制只有单独的行展开
    expand (expanded, record) {
      if (this.curExpandedRowKeys.length > 0) {
        let index = this.curExpandedRowKeys.indexOf(record.key);
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1);
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length);
          this.curExpandedRowKeys.push(record.key);
        }
      } else {
        this.curExpandedRowKeys.push(record.key);
      }
    },

    // 附件下载
    download (record) {
      downloadAttachment({
        menu_id: 35,
        type: 0,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
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


// 去掉表格高亮
.setRowClassName {
  background-color: #fff;
}
/deep/ .ant-table-tbody > .setRowClassName:hover > td {
  background-color: #fff;
}
</style>
