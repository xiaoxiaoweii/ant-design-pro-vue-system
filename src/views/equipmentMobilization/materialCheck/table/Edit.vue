<template>
  <div>
    <!-- 基本设备临时设施信息 -->
    <a-card class="card" title="材料点验单" :bordered="false">
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
                     initialValue: params.serial_number
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="点验单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                'item_check_org',
                  {
                    initialValue: $store.state.pro_unit
                  }
              ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                disabled
                v-decorator="[
                  'create_date',
                  { initialValue: date }
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
                    initialValue: nickname(),
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="点验日期" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                v-decorator="[
                  'item_check_date',
                  {
                    rules: [{  required: isrequired, message: '请选择日期' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="合同名称" v-bind="formItemLayout">
              <a-input
                read-only
                placeholder="合同名称"
                v-decorator="[
                  'contract_name',
                  { rules: [{ max: 128, message: '请输入不超过128个字符', required: isrequired }] }
                ]"
                @click="showTable"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="供应商名称" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'supplier_name',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="合同编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'contract_no',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
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
              <!-- v-bind="formItemLayout" -->
              <a-textarea
                :maxlength="128"
                placeholder="请输入备注, 1024字以内"
                v-decorator="[
                  'remark'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 合同编号 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <s-table
        class="s-table"
        size="small"
        ref="Mtables"
        rowKey="id"
        bordered
        :columns="contract_data"
        :data="loadTable"
        :customRow="dbClick"
        :alert="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
      >
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          class="custom-filter-dropdown"
        >
          <!-- 获取自定义栏位相关作用域属性 -->
          {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
          <a-range-picker
            v-if="column.dataIndex === 'contract_sign_date'"
            v-model="range"
            @change="onChangeDate"
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
          <a-range-picker
            v-else-if="column.dataIndex === 'acceptance_date'"
            v-model="checkRange"
            @change="onChangeCheckDate"
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
          <a-input
            ref="input"
            :maxlength="128"
            v-ant-ref="c => searchInput = c"
            :placeholder="`${column.title}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
          >查询</a-button>
          <a-button
            @click="() => handleReset(clearFilters, column.dataIndex)"
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
    <!-- 材料明细 -->
    <a-card class="card" title="材料明细" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        :scroll="{ x: 2250 }"
        bordered
        class="line-table"
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            :maxlength="128"
            :placeholder="columns[i].title"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input
            read-only
            :key="col"
            :maxlength="128"
            :placeholder="columns[i].title"
            v-else-if="record.editable && col === 'name'"
            style="margin: -5px 0"
            :value="text"
            @click="showNewModal(record)"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="col === 'purchase_privi' ? '采购权限' : columns[i].title"
            @change="value => handleChange(value, record.key, col)"
          >
            <a-select-option
              v-for="item in selectData[col]"
              :key="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-select-option>
          </a-select>
          <a-date-picker
            :key="col"
            :value="text"
            :placeholder="columns[i].title"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :max="col === 'num' ? 999999999.99 : 999999999.99"
            :min="col === 'num' ? 0.00 : 0.00"
            :step="col === 'num' ? 0.01 : 0.01"
            :placeholder="col === 'num' ? '数量' :columns[i].title"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <!-- <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />-->
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>
                  <a-icon type="delete" />
                </a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancel(record.key)">取消</a>
            </span>
          </template>
          <!-- <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>-->
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
          :scroll="{ x: 2400 }"
          bordered
        >
          <template v-for="(col) in detailFields" :slot="col" slot-scope="text, record">
            <a-input
              :maxlengh="128"
              :key="col"
              v-if="record.editable && inputFields.includes(col)"
              style="margin: -10px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && selectFields.includes(col)"
              style="margin: -10px 0"
              :value="text"
              @change="value => handleChange(value, record.key, col)"
            >
              <a-select-option
                v-for="item in selectData[col]"
                :key="item.value"
                :value="item.value"
              >{{ item.title }}</a-select-option>
            </a-select>
            <a-input-number
              :key="col"
              :value="text"
              :max="col === 'number' ? 999999999 : 999999999.99"
              :min="0"
              :step="col === 'number' ? 1 : 0.01"
              v-else-if="record.editable && numberFields.includes(col)"
              @change="value => handleChange(value, record.key, col)"
            />
            <template
              v-else
            >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.value === text))[0].title : text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <!-- <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />-->
                <!-- <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                  <a>
                    <a-icon type="delete" />
                  </a>
                </a-popconfirm>-->
              </span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
            <!-- <span v-else>
              <a @click="toggle(record.key)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a></a>
              </a-popconfirm>
            </span>-->
          </template>
        </a-table>
      </div>

      <!-- 材料合同 -->
      <a-modal title="请选择" v-model="visible" width="100%" @ok="handleOk()" @cancel="visibleCancel">
        <a-row :gutter="8">
          <!-- <a-col :span="6">
            <a-input-search
              v-model="valTree"
              placeholder="请输入要查询的名称并按回车进行搜索"
              @search="valueChange"
            />
            <tree
              class="z-tree"
              :setting="setting"
              :nodes="dicTree"
              @onClick="onClick"
              @onCreated="handleCreated"
            />
          </a-col>-->
          <a-col :span="24">
            <s-table
              class="s-table"
              ref="tables"
              size="small"
              rowKey="id"
              bordered
              :columns="demo"
              :data="loadData"
              :alert="false"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
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
                  @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                  icon="search"
                  size="small"
                  :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date'  ? 15 : 0}px`"
                >查询</a-button>
                <a-button
                  @click="() => handleReset(clearFilters, column.dataIndex)"
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
              <!-- <span slot="action" slot-scope="text, record">
                      <template>
                        <a @click="handleEdit(record)">编辑</a>
                      </template>
              </span>-->
            </s-table>
          </a-col>
        </a-row>
      </a-modal>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增材料明细</a-button>
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
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'B002', type: 0, menu_id: 34}"
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
        <br />
        <a-card :bordered="false" title="工作流进度">
          <a-steps :direction="isMobile() && 'vertical' || 'horizontal'" :current="2" progressDot>
            <a-step title="开始"></a-step>
            <a-step title="部门初审"></a-step>
            <a-step title="财务复核"></a-step>
            <a-step title="完成"></a-step>
          </a-steps>
        </a-card>
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
        :disabled="![formStatus.saved, null, undefined, ''].includes(params.status)"
        type="primary"
        @click="saveOrSubmit('save')"
        :loading="saveLoading"
      >保存</a-button>&nbsp;
      <a-button
        :disabled="![formStatus.saved, null, undefined, ''].includes(params.status)"
        type="primary"
        @click="saveOrSubmit('submit')"
        :loading="submitLoading"
      >提交</a-button>&nbsp;
      <a-button type="primary" @click="handleGoBack" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getDictionaryEnum } from '@/api/dictionary'
import { getDeviceList, handlePurchase, submitRequire, queryone, queryTaxRate, getQueryPurchasePrivi, getQueryMaterialType, materialByContract } from '@/api/equipmentMobilization/materialCheck'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, formStatus, queryByEquipment, queryAllEquipment, queryAllCategory, queryByCategory, queryAllContract } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')
const selectData = {
  'amortize': [
    {
      dic_enum_name: '是'
    },
    {
      dic_enum_name: '否'
    }
  ],
}
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    STree,
    tree: resolve => require(['@/components/zTree/zTree.vue'], resolve),
    FooterToolBar
  },
  // props: {
  //   params: {
  //     type: [Object, String],
  //     default: ''
  //   }
  // },
  data () {
    return {
      params: {},
      contract_code: '',
      tabList: [
        {
          key: 'attach',
          tab: '附件上传'
        },
        // {
        //   key: 'approval',
        //   tab: '审批记录'
        // }
      ],
      queryParam: {},
      tableData: {},
      selectedRowKeys: [],
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'material_category_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_id',
            idKey: 'material_category_code'
          }
        }
      },
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      loadChange (pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      },
      customFilterColumn: {},
      isrequired: true,
      sizeable: true,
      dicTree: [],
      valTree: '',
      visible: false,
      visible_name: false,
      number: '',
      col: '',
      activeTabKey: 'attach',
      fileList: [],
      selectData: selectData,
      selectFields: ['purchase_privi', 'tax_rate', 'amortize'],
      inputFields: ['manufacturer', 'remark'],
      popconfirmFields: ['name'],
      datePickerFields: [],
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

      // details table
      detailData: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '设备材料名称',
          dataIndex: 'name',
          key: 'name',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          key: 'spec',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'spec' }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'unit' }
        },
        {
          title: '材料类别',
          dataIndex: 'material_type',
          key: 'material_type',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'material_type' }
        },
        {
          title: '采购权限',
          dataIndex: 'purchase_privi',
          key: 'purchase_privi',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'purchase_privi' }
        },
        {
          title: '数量',
          dataIndex: 'num',
          key: 'num',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax',
          key: 'price_without_tax',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'price_without_tax' }

        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          key: 'price_with_tax',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'price_with_tax' }

        },
        {
          title: '税率(%)',
          dataIndex: 'tax_rate',
          key: 'tax_rate',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'tax_rate' }
        },
        {
          title: '税额',
          dataIndex: 'tax',
          key: 'tax',
          width: '120px',
          align: 'center',
          scopedSlots: { customRender: 'tax' }

        },
        {
          title: '不含税总额',
          dataIndex: 'amount',
          key: 'amount',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'amount' }

        },
        {
          title: '含税总额',
          dataIndex: 'total_amount',
          key: 'total_amount',
          width: '120px',
          align: 'center',
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
          width: '100px',
          align: 'center',
          scopedSlots: { customRender: 'amortize' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          key: 'action',
          width: '80px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      columnsTitle: [
        '采购权限',
        '数量',
        '不含税单价',
        '税率',
        '生产厂家',
        '是否摊销',
        '备注'
      ],
      detailFields: ['code', 'name', 'spec', 'num', 'unit', 'material_type', 'purchase_privi', 'price_with_tax', 'price_without_tax', 'tax_rate', 'tax', 'amount', 'total_amount', 'manufacturer', 'amortize', 'remark'],
      sumData: [{
        code1: '合计',
        name1: '',
        spec1: '',
        num1: '',
        material_type1: '',
        purchase_privi: '',
        amount_without_tax1: '',
        amount1: '',
        manufacturer1: '',
        amortize1: '',
        remark1: '',
        unit1: '',
        tax1: '',
        price_with_tax1: '',
        price_without_tax1: '',
        tax_rate1: '',
        action1: '',
        editable: true,
        isNew: true,
      }],
      columnsSum: [
        {
          title: '序号',
          dataIndex: 'code1',
          key: 'code1',
          width: '80px',
          scopedSlots: { customRender: 'code1' }
        },
        {
          title: '设备材料名称',
          dataIndex: 'name1',
          key: 'name1',
          width: '150px',
          scopedSlots: { customRender: 'name1' }
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
          title: '含税单价',
          dataIndex: 'price_with_tax1',
          key: 'price_with_tax1',
          width: '150px',
          scopedSlots: { customRender: 'price_with_tax1' }

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
        },
        {
          title: '操作',
          key: 'action1',
          width: '80px',
          scopedSlots: { customRender: 'operation1' }
        }
      ],
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
          dataIndex: 'user',
          key: 'approvaluser'
        },
        {
          title: '审批意见',
          dataIndex: 'suggest',
          key: 'approvalsuggest'
        },
        {
          title: '审批人签名',
          dataIndex: 'signature',
          key: 'signature'
        },
        {
          title: '审批时间',
          dataIndex: 'date',
          key: 'approvaldate'
        }
      ],
      selectedRows: [],
      errors: [],
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        // if (!this.queryParam.material_category_code) {
        //   this.queryParam = {
        //     material_category_code: '0'
        //   }
        // }
        return materialByContract(Object.assign(parameter, this.queryParam, { contract_no: this.contract_code })).then(res => {
          // 索引
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          this.currentSize = res.responsePageInfo.pageSize
          this.tableData = res
          return res.result || {
            pageSize: res.responsePageInfo.pageSize,
            pageNo: res.responsePageInfo.pageNum,
            totalPage: res.responsePageInfo.pages,
            totalCount: res.responsePageInfo.total,
            data: res.responsePageInfo.list
          }
        })
      },
      loadTable: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryAllContract(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          console.log(res)
          this.contractData = res

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
      },
      // 索引
      newDataKey: '',
      current: Number,
      currentSize: Number,
      dicTree: [],
      valTree: '',
      matNum: Number
    }
  },
  computed: {
    fields () {
      const fields = {}

      this.demo.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return fields
    },
    demo () {
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
          title: '材料类型',
          dataIndex: 'material_type',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'material_type'
          },
          onFilter: (value, record) => record.material_type.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '材料名称',
          dataIndex: 'material_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'material_name'
          },
          onFilter: (value, record) => record.material_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '材料数量',
          dataIndex: 'num',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'num'
          },
          onFilter: (value, record) => record.num.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specification'
          },
          onFilter: (value, record) => record.specification.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '材料编码',
          dataIndex: 'material_code',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'material_code'
          },
          onFilter: (value, record) => record.material_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '单位',
          width: '150px',
          dataIndex: 'unit',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'unit'
          },
          onFilter: (value, record) => record.unit.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
      ]
    },
    fields () {
      const field = {}

      this.contract_data.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field
    },
    contract_data () {
      console.log(123123123)
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
          title: '设备名称',
          dataIndex: 'equipment_name',
          scopedSlots: {
            customRender: 'equipment_name'
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contract_name',
          scopedSlots: {
            customRender: 'contract_name'
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_code',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'contract_code'
          },
          onFilter: (value, record) => record.contract_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_name => {
            if (visible_name) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '供货商',
          dataIndex: 'supplier_name',
          // width: '200px',
          scopedSlots: {
            customRender: 'supplier_name'
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
    getSum () {
      let count_tax = 0
      for (let item of this.detailData) {
        count_tax += item.tax * 1
      }
      this.sumData[0].tax1 = count_tax
      return this.sumData
    }
  },
  activated () {
    this.isrequired = true
    this.params = this.$route.params
    this.loadEditInfo(this.params)
  },
  mounted () {
    this.isrequired = true
    this.params = this.$route.params

    // 存取编辑数据id
    let idObj = this.$route.name
    let obj = {}
    obj[idObj] = this.params
    if (this.params.id) this.$store.commit('SET_EDIT_ID', obj)
    this.params = this.$store.state.edit_id[idObj] || this.params

    this.$nextTick(() => {
      this.loadEditInfo(this.params)
    })
  },
  methods: {
    ...mapGetters(['nickname']),

    // 双击确定
    dbClick (record) {
      return {
        on: {
          dblclick: (e) => {
            console.log(record, '----', e)
            this.selectedRows[0] = record
            this.handleName(record.id)
          }
        }
      }
    },

    refresh (ref) {
      this.$refs[ref].clearSelected()
      this.$refs[ref].refresh(true)
      this.queryParam = {}
      this.selectedRowKeys = []
      this.selectedRows = []

      for (const key in this.customFilterColumn) {
        if (this.customFilterColumn.hasOwnProperty(key)) {
          this.customFilterColumn[key].clearFilters()
        }
      }

      // 清空了过滤内容
      this.filteredInfo = null
    },
    showTable () {
      this.visible_name = true
      this.$refs.Mtables && this.refresh('Mtables')
    },
    handleName (val) {
      this.visible_name = false
      console.log(this.contractData)
      // const arr = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
      const arr = this.selectedRows
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.contract_code = arr[0].contract_code
      this.form.setFieldsValue({
        contract_no: arr[0].contract_code,
        contract_name: arr[0].contract_name,
        supplier_name: arr[0].supplier_name
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
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('materialCheckList')
    },
    showModal () {
      this.visible = true
      this.$refs.tables && this.$refs.tables[0].refresh(true)
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      console.log(evt.type, treeNode)
      this.queryParam = {
        material_category_code: treeNode.material_category_code
      }
      this.$refs.tables.refresh(true)
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    // valueChange (e) {
    //   console.log(e)
    //   this.valTree = e
    //   queryAllCategory({ material_category_name: this.valTree }).then(res => (this.dicTree = res.responseList))
    // },
    showNewModal (col) {
      this.newDataKey = col.key
      this.visible = true
      this.queryParam = {}
      this.$refs.tables && this.refresh('tables')
      // queryAllCategory().then(res => (this.dicTree = res.responseList))
    },
    visibleCancel () {
      this.visible = false
      this.valTree = ''
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    handleOk () {
      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      const dataArr = this.selectedRows[0]
      let flag = false
      this.detailData.map(x => {
        const isTrue = x['material_code'] === dataArr['material_code'] && x['spec'] === dataArr['specification'] && x['name'] === dataArr['material_name']
        if (isTrue) {
          this.noSelect('不能选择相同的材料！')
          flag = true
        }
      })
      if (flag) return this.visibleCancel()
      this.matNum = dataArr.num
      this.detailData = this.detailData.map(x => {
        if (x.key === this.newDataKey) {
          x.name = dataArr.material_name
          x.spec = dataArr.specification
          x.unit = dataArr.unit
          x.num = dataArr.num
          x.material_type = dataArr.material_type
          x.material_code = dataArr.material_code
        }
        return x
      })
      this.visibleCancel()
    },
    // 提示框
    noSelect (title) {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: title || '您未选择任何数据！'
      })

      setTimeout(() => {
        modal.destroy()
      }, secondsToGo * 1000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    async loadEditInfo (data) {
      const { form } = this
      if (data.id) {
        await getDictionaryEnum({ pageNum: 1, pageSize: 13, dic_type_id: 1006 }).then(res => {
          this.selectData['tax_rate'] = res.responseList
        })
        await getDictionaryEnum({ pageNum: 1, pageSize: 13, dic_type_id: 1014 }).then(res => {
          this.selectData['purchase_privi'] = res.responseList
        })
        queryone({ id: data.id, menu_id: 34 }).then(res => {

          data = res.responseObject
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
          const formData = pick(data, [
            'serial_number',
            'pro_unit',
            'create_date',
            'creator_user_name',
            'item_check_date',
            'contract_name',
            'supplier_name',
            'contract_no',
            'remark'
          ])
          formData.item_check_date = moment((data.item_check_date == null ? {} : data.item_check_date))
          formData.create_date = moment((data.create_date == null ? {} : data.create_date))
          form.setFieldsValue(formData)
          this.number = true
          let oldNum = 0
          let oldTol = 0
          let oldAmount = 0
          let oldTax = 0
          let oldPrice = 0
          let oldPrice2 = 0
          this.detailData = res.responseObject.details.map((d, i) => {
            d.num && (oldNum += Number(d.num))
            d.total_amount && (oldTol += Number(d.total_amount))
            d.amount && (oldAmount += Number(d.amount))
            d.tax && (oldTax += Number(d.tax))
            d.price_without_tax && (oldPrice += Number(d.price_without_tax))
            d.price_with_tax && (oldPrice2 += Number(d.price_with_tax))
            d.item_check_date = moment(d.item_check_date)
            d.editable = true
            d.isNew = true
            d.code = i + 1
            d.key = d.id + ''
            return d
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
              price_with_tax: oldPrice2.toFixed(2),
              tax_rate: ''
            })
          }
        })
        // getAttachments({ id_in_module: data.id, module: modules.materialCheck }).then(res => {
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
        this.detailData = this.detailData.map((item, index) => {
          item.code = index
          return item
        })
        // setTimeout(()=>{
        //   form.setFieldsValue(formData)
        // },100)
      }
    },
    newDevice () {
      if (this.detailData.length) {
        if (!this.detailData[this.detailData.length - 2].name) return this.noSelect('请填完上一条数据')
      }
      this.detailData.forEach((x, i) => {
        if (x.code === '合计') {
          this.detailData.splice(i, 1)
        }
      })
      const length = this.detailData.length

      this.detailData.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        editable: true,
        isNew: true,
        name: '',
        spec: '',
        num: '',
        total_amount: '',
        amount: '',
        manufacturer: '',
        amortize: '',
        remark: '',
        unit: '',
        material_type: '',
        purchase_privi: '',
        tax: '',
        price_without_tax: '',
        price_with_tax: '',
        tax_rate: ''
      })
      this.detailData.push({
        key: '0',
        code: '合计',
        editable: false,
        isNew: true,
        name: '',
        spec: '',
        num: 0,
        total_amount: 0,
        amount: 0,
        manufacturer: '',
        amortize: '',
        remark: '',
        unit: '',
        material_type: '',
        purchase_privi: '',
        tax: 0,
        price_without_tax: 0,
        price_with_tax: 0,
        tax_rate: null
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
        if (['price_without_tax', 'tax_rate', 'num'].includes(column)) {
          if (target.num > this.matNum) target.num = this.matNum
          // target.tax = target.tax || 0
          // target.tax_rate = target.tax_rate || 0
          // target.price_without_tax = target.price_without_tax || 0
          // target.amount = target.amount || 0
          // target.num = target.num || 0
          if (target.price_without_tax && target.tax_rate && target.num) {
            target.tax = ((target.price_without_tax * target.tax_rate / 100) * target.num).toFixed(2)
          }
          if (target.num && target.tax && target.price_without_tax) {
            target.total_amount = ((target.price_without_tax * target.tax_rate / 100 + target.price_without_tax) * target.num).toFixed(2)

            target.price_with_tax = (target.price_without_tax * target.tax_rate / 100 + target.price_without_tax).toFixed(2)
          }
          if (target.price_without_tax && target.tax) {
            target.amount = (target.price_without_tax * target.num).toFixed(2)
          }
          if (!(target.price_without_tax && target.tax_rate && target.num)) {
            target.tax = 0
            target.total_amount = 0
            target.amount = 0
          }
          // this.form.setFieldsValue({
          //   total_amount: newData.reduce((total, d) => {
          //     return total + Number(d.amount)
          //   }, 0)
          // })
          const sumData = newData.filter(d => d.code !== '合计')
          newData.forEach(x => {
            if (x.code === '合计') {
              x.num = 0
              x.total_amount = 0
              x.amount = 0
              x.tax = 0
              x.price_without_tax = 0
              x.price_with_tax = 0
            }
          })
          newData.forEach(x => {
            if (x.code === '合计') {
              sumData.forEach(c => {
                c.num && (x.num += Number(c.num))
                c.total_amount && (x.total_amount += Number(c.total_amount))
                c.amount && (x.amount += Number(c.amount))
                c.tax && (x.tax += Number(c.tax))
                c.price_without_tax && (x.price_without_tax += Number(c.price_without_tax))
                c.price_with_tax && (x.price_with_tax += Number(c.price_with_tax))
              })
            }
          })
          newData.forEach(x => {
            if (x.code === '合计') {
              x.total_amount = x.total_amount.toFixed(2)
              x.amount = x.amount.toFixed(2)
              x.tax = x.tax.toFixed(2)
              x.price_without_tax = x.price_without_tax.toFixed(2)
              x.price_with_tax = x.price_with_tax.toFixed(2)
            }
          })
        }
        this.detailData = newData
      }
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
        menu_id: 34,
        type: 0,
        filePath: record.file_path,
        fileName: record.file_name,
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

    // 最终全页面提交
    saveOrSubmit (type) {
      const { form: { validateFields } } = this
      const that = this
      if (type === 'save') {
        this.isrequired = false
      } else {
        if (this.detailData.length === 0) {
          this.$notification['error']({
            message: '提示',
            description: '提交时明细不能为空'
          })
          return
        }
        let break1 = false
        let colname = ''
        this.detailData.forEach((d, i) => {
          if (d.code !== '合计') {
            for (var key in d) {
              if (!d[key] && d[key] !== 0) {
                if (key != 'remark') {
                  this.columns.map(item => {
                    if (item.dataIndex == key) colname = item.title
                  })
                  this.$notification['error']({
                    message: '提示',
                    description: `提交时第${d.code}行：${colname}不能为空`
                  })
                  break1 = true
                  return
                }
              }
            }
          }
        })
        if (break1) return
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.details = that.detailData
          values.details = values.details.filter(x => {
            x.price_without_tax = (x.price_without_tax - 0).toFixed(2)
            x.price_with_tax = (x.price_with_tax - 0).toFixed(2)
            x.total_amount = (x.total_amount - 0).toFixed(2)
            x.amount = (x.amount - 0).toFixed(2)
            x.tax = (x.tax - 0).toFixed(2)
            x.tax_rate && (x.tax_rate = x.tax_rate - 0)
            for (let key in x) {
              const isTrue = x[key] === '' || x[key] === undefined || x[key] === null || x[key] === 0 || x[key] === '0.00' || x[key] === NaN || x[key] === 'NaN'
              if (isTrue) {
                delete x[key]
              }
            }
            return x.code !== '合计'
          })
          values.files = that.fileList.map(x => {
            x.type = 0
            return x
          })

          if (that.params) {
            values.id = that.params.id
            values.serial_number = that.params.serial_number
            values.creator_org_id = that.params.creator_org_id
            values.creator_org_name = that.params.creator_org_name
            values.flag = 2
            values.status = that.params.status
          } else {
            // 联动参数
            // values.remark = '备注'
            values.creator_org_id = that.$store.state.menu_key
            values.creator_org_name = that.$store.state.org_name
            values.pro_unit_code = that.$store.state.pro_unit_code
            values.flag = 1
          }
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code

          values.menu_id = 34
          // 日期格式转换
          values.create_date = (values.create_date == undefined ? null : values.create_date.format('YYYY-MM-DD'))
          values.item_check_date = (values.item_check_date == undefined ? null : values.item_check_date.format('YYYY-MM-DD'))

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
                  document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
                  that.submitLoading = true
                  return handlePurchase(values, 'submit').then(res => {
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
          if (type === 'save') {
            that.saveLoading = true
            return handlePurchase(values, 'update').then(res => {
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
    beforeUploaddata (file) {
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
      let sizeSum = 0
      this.fileList.map(x => {
        sizeSum += x.file_size
        return x
      })
      this.picList.map(x => {
        sizeSum += x.file_size
        return x
      })
      const isLt50M = sizeSum / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传的总文件大小不能超过50M！')
        this.sizeable = false
      }
    },

    // 文件上传
    fileChange (info) {
      if (!this.sizeable) return false
      let fileList = [...info.fileList]
      fileList = fileList.filter(file => {
        if (file.status === 'error') this.$message.error('上传文件过大或不支持该格式的文件！')
        else if (file.response && file.response.status === '0') {
          const names = file.response.responseObject.fileName.split('.')
          file.file_path = file.response.responseObject.filePath
          file.file_name = file.response.responseObject.fileName
          file.file_ext = names[names.length - 1] || 'unknown'
          file.id_in_module = file.length
          file.key = file.uid
          file.module = modules.siteAccept
          file.file_size = file.size.toString()
          file.upload_user_id = '123' // 待修改
          file.upload_user_name = this.nickname()
          file.remark = '附件'
          file.model = model.siteAccept
          file.type = 0
        }
        return file.status !== 'error'
      })
      this.fileList = fileList
    },

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      confirm()
      // if (col) this.refresh(true)
    },

    handleReset (clearFilters, col) {
      // this.queryParam = {}
      clearFilters()
      // this.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
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
