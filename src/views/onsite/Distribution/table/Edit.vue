<template>
  <div>
    <!-- 基本设备材料列销信息 -->
    <a-card class="card" title="设备材料列销管理-编辑" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number',
                  {
                     initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                'pro_unit',
                  {
                    initialValue: ''
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'create_date',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'creator_user_name',
                    {
                      initialValue: ''
                    }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item
              label="备注"
              :labelCol="{
                xs: { span: 24 },
                sm: { span: 3 }
              }"
              :wrapperCol="{
                xs: { span: 24 },
                sm: { span: 21 }
              }"
            >
              <a-textarea
                placeholder="请输入摘要, 1000字以内"
                v-decorator="[
                  'remark',
                  {
                    rules: [{ maxlength: 1000, message: '1000字以内',}],
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row> -->
      </a-form>
    </a-card>

    <!-- 选择设备名称 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        size="small"
        ref="Mtables"
        rowKey="id"
        bordered
        :columns="columnsTable?equipColumns:fengbaoColumns"
        :data="loadTableData"
        :alert="false"
        :rowSelection="columnsTable?{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}:
            {selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
      >
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          class="custom-filter-dropdown"
        >
          <!-- 获取自定义栏位相关作用域属性 -->
          {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
          <a-input
            ref="input"
            v-ant-ref="c => searchInput = c"
            :placeholder="`${column.title}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleNameSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
          >查询</a-button>
          <a-button
            @click="() => handleNameReset(clearFilters, column.dataIndex)"
            size="small"
            style="width: 90px"
          >重置</a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <span
          slot="serial"
          slot-scope="text, record, index"
        >{{ index + 1 + (current - 1) * currentSize }}</span>
        <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
      </s-table>
    </a-modal>

    <!-- 选择工程名称 -->
   

    <!-- 列销单 -->
    <a-card title="列销单明细">
      <a-table
        :columns="detailColumns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="order_number"
        :scroll="{ x: 2220 }"
        bordered
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            maxlengh="128"
            :placeholder="columnTitle[i]"
            v-if="inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.order_number, col)"
          />
          <a-select
            :key="col"
            v-else-if="selectFields.includes(col)"
            :defaultValue="record.col"
            style="margin: -5px 0"
            :placeholder="columnTitle[i]"
            @change="value => handleChange(value, record.order_number, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key=" item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-input-number
            :key="col"
            :value="text"
            :min="0.00"
            :step="0.01"
            :placeholder="columnTitle[i]"
            v-else-if="numberFields.includes(col)"
            @change="value => handleChange(value, record.order_number, col)"
          />
          <template
            v-else
          >{{selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.order_number)">
              <a>
                <a-icon type="delete" />
              </a>
            </a-popconfirm>
        </template>
      </a-table>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="getDeliveryList"
      >引入发料单</a-button>
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
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :action="uploadUrl"
          :multiple="true"
          :withCredentials="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :beforeUpload="beforeUploaddata"
          :data="{model:'020', type: 0, menu_id:44 }"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽进行文件上传</p>
        </a-upload-dragger>
        <br />
        <a-table
          v-if="fileList.length > 0"
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
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="removeAttachment(record)">
                <a>
                  <a-icon type="delete" />
                </a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </div>
      <!-- 审批记录 -->
      <div class="approval" v-if="activeTabKey === 'approval'">
        <a-table :columns="approvalColumns" :dataSource="[]" :pagination="false" />
      </div>
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
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('update')"
        :loading="saveLoading"
      >保存</a-button>&nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(recording.status)"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >提交</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>
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
import { mixin, mixinDevice } from '@/utils/mixin'
import {handleDistribution,queryOne,selectCondInfo,queryDeliveryNumber} from '@/api/onsite/distribution'
import { model, queryByCategory } from '@/api/onsite/upload'
import { uploadUrl, downloadAttachment, delAttachment, formStatus, modules,
queryProjectName } from '@/api/common'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    FooterToolBar
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
      params:{},
      dataFrom:{},
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
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      },
      isrequired: true,
      visible: false,
      visible_name: false,
      number: '',
      col: '',
      activeTabKey: 'attach',
      fileList: [],
      newArr:[],
      selectData: {
        'deduct': [
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
        'deduct',//是否使用
      ],
      disableFields: [ 
        'total_amount',
        'tax',
      ],
      popconfirmFields: ['name'],
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
      columnsTable: true,       
      detailData: [],
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
          title: '发料单号',
          dataIndex: 'issue_code',
          key: 'issue_code',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'issue_code' }
        },
        {
          title: '发料时间',
          dataIndex: 'issue_time',
          key: 'issue_time',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'issue_time' }
        },
        {
          title: '材料名称',
          dataIndex: 'material_name',
          key: 'material_name',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'material_name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '含税单价',
          dataIndex: 'single_price',
          key: 'single_price',
          align: 'right',
          width: '60px',
          scopedSlots: { customRender: 'single_price' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          align: 'center',
          width: '80px',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width: '60px',
          align: 'right',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '含税总额',
          dataIndex: 'sum',
          key: 'sum',
          width: '60px',
          align: 'right',
          scopedSlots: { customRender: 'sum' }
        },
        {
          title: '使用设备或使用部位',
          dataIndex: 'use_site',
          key: 'use_site',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'use_site' }
        },
        {
          title: '领用单位',
          dataIndex: 'usr_org',
          key: 'usr_org',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'usr_org' }
        },
        {
          title: '是否扣款',
          dataIndex: 'deduct',
          key: 'deduct',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'deduct' }
        },
        {
          title: '操作',
          key: 'action',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
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
      loadTableData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        if(this.columnsTable){
          return queryDeliveryNumber(Object.assign({pageNum: 1, pageSize: 13 ,creator_org_id:this.$store.state.menu_key})).then(res => {
            // 索引
            this.current = res.responsePageInfo.pageNum
            this.currentSize = res.responsePageInfo.pageSize
            this.contractData=res
            return (
              res.result || {
                pageSize: res.responsePageInfo.pageSize,
                pageNo: res.responsePageInfo.pageNum,
                totalPage: res.responsePageInfo.pages,
                totalCount: res.responsePageInfo.total,
                data: res.responsePageInfo.list
              }
            )
          })
        }else{
          return selectCondInfo(Object.assign({condition:{organCode:"0000100002"}
              ,current: 1, size: 13 })).then(res => {
            // 索引
            //给每条数据添加id
            res.responseObject.data.records=res.responseObject.data.records.map((item,index)=>{
              item['id']=index+1
              return item
            })
            this.current = res.responseObject.data.current
            this.currentSize = res.responseObject.data.size
            this.fenbaoData=res
            return (
              res.result || {
                pageSize: res.responseObject.data.size,
                pageNo: res.responseObject.data.current,
                totalPage: res.responseObject.data.pages,
                totalCount: res.responseObject.data.total,
                data: res.responseObject.data.records
              }
            )
          })
        }
      },
      // 索引
      current: Number,
      currentSize: Number,
    }
  },
  computed: {
    equipColumns () { //发料单
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '发料单号',
          dataIndex: 'serial_number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'serial_number'
          },
          onFilter: (value, record) => record.serial_number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '发料时间',
          dataIndex: 'create_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'create_date'
          },
          onFilter: (value, record) => record.create_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.create_date.split('-').join('') - b.create_date.split('-').join('')
        },
        {
          title: '材料名称',
          dataIndex: 'name',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'name'
          },
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'spec'
          },
          onFilter: (value, record) => record.spec.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'price_with_tax'
          },
          onFilter: (value, record) => record.price_with_tax.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'unit'
          },
          onFilter: (value, record) => record.unit.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '数量',
          dataIndex: 'number',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'number'
          },
          onFilter: (value, record) => record.number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '含税总额',
          dataIndex: 'fee_whithout_tax',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'fee_whithout_tax'
          },
          onFilter: (value, record) => record.fee_whithout_tax.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '是否扣款',
          dataIndex: 'deduct',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'deduct'
          },
          onFilter: (value, record) => record.deduct.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
      ]
    },
    fengbaoColumns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '供应商名称',
          dataIndex: 'supName',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supName'
          },
          onFilter: (value, record) => record.supName.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'socialId',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'socialId'
          },
          onFilter: (value, record) => record.socialId.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '法人姓名',
          dataIndex: 'legalPersonName',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'legalPersonName'
          },
          onFilter: (value, record) => record.legalPersonName.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '法人身份证号码',
          dataIndex: 'legalPersonCode',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'legalPersonCode'
          },
          onFilter: (value, record) => record.legalPersonCode.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'state'
          },
          onFilter: (value, record) => record.state.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
      ]
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
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if(this.$route.params.type === 2){
        if (from.path === '/onsite/distributionList') {
          this.isrequired = true
          this.params=this.$route.params.selectedRows
          this.loadEditInfo(this.params)
        }
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      if(this.$route.params.type === 2){
        this.params=this.$route.params.selectedRows
        this.loadEditInfo(this.params)
      }
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    //将数据加载到数据表
    loadEditInfo (data) {
      const { form } = this
      let that=this
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        queryOne({id:data.id,menu_id:44}).then(res => {
          that.dataFrom=res.responseObject
          const formData = pick(that.dataFrom, 
          [
            'serial_number',//单据编号
            'pro_unit',//编制单位
            'create_date',//编制日期
            'creator_user_name',//编制人
            'remark',//备注
          ])
          formData.create_date = moment((that.dataFrom.create_date == null ? {} : that.dataFrom.create_date))
          form.setFieldsValue(formData)
          if(res.responseObject.files){
            that.fileList=res.responseObject.files.map(file=>{
              file['key']=file.id
              return file
            })
          }
          if(res.responseObject.details){
            let detailData=res.responseObject.details
            detailData.map((item,index)=>{
              item['order_number']=index+1
              item['single_price']=item['price_with_tax']
              item['sum']=item['fee_whithout_tax']
            })
            that.detailData=detailData
          }
        })   
      }
    },
    getDeliveryList () {//拉起发料单
      this.showTable (true)
    },
    showTable (flag) {
      this.columnsTable=flag //columnsTable为ture拉起点验单，为false拉起分包商接口
      this.visible_name = true
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    handleName (val) {
      this.visible_name = false
      if(this.columnsTable){ //拉起发料单
        if (!this.selectedRows.length) return
        this.detailData=this.selectedRows.map((item,index)=>{
          item['order_number']=index+1
          item['issue_code']=item['serial_number']
          item['issue_time']=item['create_date']
          item['material_name']=item['name']
          item['single_price']=item['price_with_tax']
          item['sum']=item['fee_whithout_tax']
          item['num']=item['number']
          item['materId']=item['id']  //将id转为metetID
          item['use_site']=item['equip']
          item['usr_org']=item['rec_org']
          return item
        })
        this.selectedRowKeys = []
        this.selectedRows = []
      }else{ //收料单位-分包商
        const arr = this.fenbaoData.responseObject.data.records.filter(item => item.id === val[0])
        this.selectedRowKeys = []
        this.selectedRows = []
        if (!arr.length) return
        if (val.length > 1) return this.noSelect()
        this.form.setFieldsValue({
          rec_org: arr[0].supName,
        })
        this.supplier_code=arr[0].socialId
      }
    },
    handleProjectName(val){
      this.project_name = false
    },
    handleChange (value, order_number, column) { //发料单明细更改
      this.detailData=this.detailData.map(item=>{ 
        if(order_number == item.order_number){
          if(column=='number'&&!isNaN(value)){
            item['number'] = value
            item['fee_without_tax']=(parseFloat(item['price_with_tax']*value)).toFixed(2)
            item['sum_with_tax']=(parseFloat(item['price_without_tax']*value)).toFixed(2)
            item['tax_fee']=(parseFloat(item['fee_without_tax'])-parseFloat(item['sum_with_tax'])).toFixed(2)
          }else{
            item[column] = value
          }
        }
        return item
      })
    },
    onClick (value, key, column) { //点击单位工程名称
      // if(column=="car_name"){ //获取单位工程
      //   let that=this
      //   queryProjectName().then(res=>{
      //     if(res.status==0&&res.responseList.length>0){
      //       that.newArr=res.responseList
      //       that.getZTreeData(that.newArr)
      //     }
      //   })
      // }
    },
    getZTreeData(arr){
      arr.forEach(item=>{
        if(item.children.length>0){
          this.getZTreeData(item)
        }else{
          this.newArr.push(item)
        }
      })
    },
    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    setFilterColumnScope (data) {
      // const { column } = data
      // this.customFilterColumn[column.dataIndex] = data
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('distributionList')
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
    onSelectChange (selectedRowKeys,selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows=selectedRows
    },
    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
    },
    handleNameReset (clearFilters, col) {
      clearFilters()
      this.$refs.Mtables && this.$refs.Mtables.refresh(true)
    },
    //明细操作
    remove(order_number) {
      const newData = this.detailData.filter(item => item.order_number !== order_number)
      this.detailData = newData.map((item,index)=>{
         item['order_number']=index+1
         return item
      })
    },
    // 附件下载
    download (record) {
      downloadAttachment({
        type:0,
        menu_id:44,
        details: [{
          filePath: record.file_path,
          fileName: record.file_name,
        }]
      }).then(res => {
        res.status || FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), record.file_name)
      })
    },
    // 附件删除
    removeAttachment (record) {
      delAttachment({
        filePath: record.file_path,
        fileName: record.file_name,
        type: 0,
        menu_id:44
      }).then(res => {
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

    // 最终全页面提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this
      if (type === 'update') {
        this.isrequired = false
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.details = that.detailData
          values.details = values.details.map(x => {
            for (let key in x) {
              const isTrue = x[key] === '' || x[key] === undefined || x === null
              if (isTrue) {
                delete x[key]
              }
            }
            return x
          })
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          values.creator_org_id = that.$store.state.menu_key //右上角编号
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code //编制单位编号
          values.rec_org_code=that.supplier_code
          values.menu_id = 44 
          values.flag=2
          values.equip_code=this.equip_code
          values.id=this.params.id
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))
          values.use_date = (values.use_date == undefined ? null : values.use_date.format('YYYY-MM-DD'))

          for (let key in values) {
            const isTrue = values[key] === '' || values[key] == undefined || values == null
            if (isTrue) {
              delete values[key]
            }
          }
          if (!err) {
            if (type === 'submit') {
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  that.submitLoading = true
                  return handleDistribution(values, 'submit').then(res => {
                    that.submitLoading = false
                    if (res.status === '0') {
                      that.$notification['success']({
                        message: '提示',
                        description: res.msg
                      })
                      that.handleGoBack() // 返回列表页
                    }
                  }).finally(() => {
                    that.submitLoading = false
                  })
                },

                onCancel () { }
              })
            }
          }
          if (type === 'update') {
            that.saveLoading = true
            return handleDistribution(values, 'update').then(res => {
              that.saveLoading = false
              if (res.status === '0') {
                that.$notification['success']({
                  message: '提示',
                  description: res.msg
                })
                that.handleGoBack() // 返回列表页
              }
            }).finally(() => {
              that.submitLoading = false
            })
          }
        })
      }, 100)
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
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
    sumUpliad () {
      this.sizeSum=0
      this.fileList.map(x => {
        this.sizeSum += parseInt(x.file_size)
        return x
      })
      const isLt50M = this.sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
    },

    // 文件上传
    fileChange (info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response) {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
        }
        file.key = file.uid
        if(file.name){
          file.file_name = file.name
        }
        file.module = '020'
        if(file.size){
          file.file_size=file.size
        }
        file.fileSize = (file.file_size / 1024).toFixed(0)
        file.upload_user_id = '123' // 待修改
        file.upload_user_name = this.nickname()
        file.remark = '附件'
        return file
      })
      this.fileList = fileList
    }
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
/deep/ .ant-table-body .ant-select-selection--single {
  width: 130px;
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
