<template>
  <div>
    <a-card class="card" title="安装验收申请单" :bordered="false">
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
                     initialValue: params.serial_number,
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编制单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="编制单位"
                v-decorator="[
                  'pro_unit',
                  {
                     initialValue: $store.state.pro_unit,
                  }
                ]"
              />
            </a-form-item>
          </a-col>
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
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编制日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                style="width: 100%"
                v-decorator="[
                  'create_date',
                  { initialValue: date }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="验收单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="验收单位"
                v-decorator="[
                  'check_org',
                  {
                    initialValue: $store.state.pro_unit
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item read-only label="合同编号" v-bind="formItemLayout">
              <a-input
                read-only
                placeholder="请输入编号"
                v-decorator="[
                  'contract_no',
                  {
                    rules: [{  required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
                @click="showTable"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="安装单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'install_org',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="含税合同金额" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'fee_with_tax',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="管理号码" v-bind="formItemLayout">
              <a-input
                placeholder="管理号码"
                @click="showModal"
                v-decorator="[
                  'manage_code',
                  {
                    rules: [{ max:128, required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item read-only label="设备名称" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                    'equip_name'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="规格型号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'spec',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="验收日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                style="width: 100%"
                v-decorator="[
                  'check_date',
                  {
                    initialValue: date
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="安装人" v-bind="formItemLayout">
              <a-input
                placeholder="安装单位人员"
                v-decorator="[
                  'install_person',
                  { rules: [{ max: 32, message: '内容未输入或超过字符长度限制', required: isrequired }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item read-only label="验收人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="验收单位人员"
                v-decorator="[
                  'check_person',
                  {
                    initialValue: nickname()
                  }
                ]"
              />
              <!-- @click="showName" -->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <!--设备名称树形 -->
    <div>
      <a-modal
        title="请选择"
        v-model="visible"
        width="100%"
        @ok="handleOk(selectedRowKeys)"
        @cancel="handleNameCancel"
      >
        <a-row :gutter="8">
          <!-- <a-col :span="6">
            <a-input-search placeholder="请输入要查询的名称" @search="valueChange" />
            <ZTree
              class="z-tree"
              :setting="setting"
              :nodes="dicTree"
              @onClick="onClick"
              @onCheck="onCheck"
              @onCreated="handleCreated"
            />
          </a-col>-->
          <a-col :span="24">
            <s-table
              class="s-table"
              ref="Etables"
              size="small"
              rowKey="id"
              :customRow="dbClick2"
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
            </s-table>
          </a-col>
        </a-row>
      </a-modal>
    </div>
    <!-- 合同编号 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
      @cancel="handleCancel"
    >
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        bordered
        :customRow="dbClick"
        :columns="contract_data"
        :data="loadTable"
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
    <!-- 验收人HR树 -->
    <div>
      <a-modal
        title="请选择"
        v-model="visible_true"
        width="100%"
        @cancel="handleNameCancel"
        @ok="handleNameOk(selectedRowKeys)"
      >
        <a-row :gutter="8">
          <a-col :span="5">
            <a-input :value="nameTree" placeholder="请输入要查询的名称" @change="nameChange" />
            <ZTree
              class="z-tree"
              :setting="name_setting"
              :nodes="name_dicTree"
              @onClick="onNameClick"
              @onCheck="onNameCheck"
              @onCreated="handleNameCreated"
            />
          </a-col>
          <a-col :span="19">
            <s-table
              ref="tables"
              size="small"
              rowKey="id"
              bordered
              :columns="name_demo"
              :data="name_Data"
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
            </s-table>
          </a-col>
        </a-row>
      </a-modal>
    </div>

    <!-- 明细 -->
    <a-card class="card" title="验收内容">
      <a-table
        :columns="columns"
        :dataSource="detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
        bordered
      >
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-radio-group
            :key="col"
            v-if="radioFields.includes(col)"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-radio
              v-for="item in queryLevel"
              :key="item.value"
              :value="item.value"
            >{{ item.value }}</a-radio>
          </a-radio-group>
          <a-input-number
            :key="col"
            :value="text"
            :min="0"
            :step="col === 'num' ? 1 : 0.01"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template
            v-else
          >{{selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
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
          <span v-else>
            <a @click="toggle(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
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
          <template v-for="(col, i) in sumFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              v-if="record.editable && inputFields.includes(col)"
              style="margin: -10px 0"
              :value="text"
              @change="e => sumhandleChange(e.target.value, record.key, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && selectFields.includes(col)"
              style="margin: -10px 0;width:200px"
              :value="text"
              @change="value => sumhandleChange(value, record.key, col)"
            >
              <a-select-option
                v-for="item in queryLevel"
                :key="item.value"
                :value="item.value"
              >{{ item.value }}</a-select-option>
            </a-select>
            <a-input-number
              :key="col"
              :value="text"
              :min="0"
              :step="col === 'number' ? 1 : 0.01"
              v-else-if="record.editable && numberFields.includes(col)"
              @change="value => sumhandleChange(value, record.key, col)"
            />
            <template
              v-else
            >{{ selectFields.includes(col) ? (queryLevel.filter(c => c.value === text))[0].title : text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew"></span>
              <span v-else>
                <a @click="saveRow(record)">保存</a>
                <a-divider type="vertical" />
                <a @click="cancel(record.key)">取消</a>
              </span>
            </template>
            <span v-else>
              <a @click="toggle(record.key)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
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
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'B004', type: 0, menu_id: 36}"
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
import * as $ from 'jquery'
if (!window.jQuery) {
  window.jQuery = $
}
import moment from 'moment'
import pick from 'lodash.pick'
import STree from '@/components/Tree/Tree'
import { STable, ZTree } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { queryDictionaries } from '@/api/dictionary'
import { getDeviceList, handlePurchase, submitRequire, queryone, getQueryResult, getQueryCheckItem, queryByCode } from '@/api/equipmentMobilization/InstallationAcceptance'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, queryByEquipment, queryAllEquipment, queryAllContract, queryAllName, queryByName, formStatus } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
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

const queryLevel = [
  {
    label: '良好',
    value: '良好'
  },
  {
    label: '一般',
    value: '一般'
  },
  {
    label: '较差',
    value: '较差'
  },
]
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    STree,
    ZTree,
    FooterToolBar
  },
  data () {
    return {
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
      params: {},
      customFilterColumn: {},
      visible: false,
      visible_name: false,
      visible_true: false,
      value_name: false,
      selectedRowKeys: [],
      isrequired: true,
      // custom table alert & rowSelection
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
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'e_name'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_code',
            idKey: 'equipment_code'
          }
        }
      },
      name_setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'name'
          },
          simpleData: {
            enable: true
          }
        }
      },
      equip_code: '',
      selectedRows: [],
      sizeable: true,
      number: '',
      queryLevel: queryLevel,
      activeTabKey: 'attach',
      fileList: [],
      selectData: [],
      selectFields: ['check_result'],
      inputFields: ['check_remarks'],
      radioFields: ['result'],
      numberFields: [],
      memberLoading: false,
      loading: false,
      saveLoading: false,
      submitLoading: false,
      queryList: [],
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
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 }
        }
      },

      // details table
      detailData: [],
      detail_Data: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'code',
          key: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '验收类型',
          dataIndex: 'check_item',
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
      detailFields: ['code', 'inspect_name', 'check_item', 'result'],
      sumData: [{
        all_total: '验收总结论',
        check_result: '',
        content1: '结论描述',
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
      errors: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        // if (!this.queryParam.equipment_code) {
        //   this.queryParam = {
        //     equipment_code: '0'
        //   }
        // }
        return queryByCode(Object.assign(parameter, this.queryParam, { menu_id: 36, scope_code: this.$store.state.menu_key })).then(res => {
          // 索引
          // console.log('aaaa',res)
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          this.currentSize = res.responsePageInfo.pageSize
          console.log(res)
          this.tableData = res

          return res.result || { pageSize: res.responsePageInfo.pageSize, pageNo: res.responsePageInfo.pageNum, totalPage: res.responsePageInfo.pages, totalCount: res.responsePageInfo.total, data: res.responsePageInfo.list }
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
        return queryAllContract(parameter, this.queryParam, { menu_id: 36 }).then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
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
      queryName: {},
      name_Data: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryByName(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          console.log('aaaa', res)
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          console.log(res)
          this.hrData = res
          res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
            // x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
            if (x.gender === 1) {
              x.gender = '男'
            } else if (x.gender === 2) {
              x.gender = '女'
            }
            return x
          })
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
      current: Number,
      currentSize: Number,
      dicTree: [],
      name_dicTree: [],
      valTree: '',
      nameTree: ''
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.params.type === 1) {
        this.resetForm()
      }
      if (from.path === '/equipmentMobilization/InstallationAcceptanceList') {
        this.isrequired = true
        this.$nextTick(() => {
          this.loadEditInfo(this.recording)
        })
      }
    }
  },
  created () {
    this.queryParam = {
      equipment_code: '0'
    }
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })
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
          title: '设备名称',
          dataIndex: 'equip_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_name'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '型号规格',
          dataIndex: 'specification',
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
          title: '设备编码',
          dataIndex: 'equip_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_code'
          },
          onFilter: (value, record) => record.equip_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase()),
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
            customRender: 'customRender'
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
          title: '安装单位',
          dataIndex: 'install_org',
          scopedSlots: {
            customRender: 'install_org'
          }
        },
        {
          title: '含税合同金额',
          dataIndex: 'fee_with_tax',
          // width: '200px',
          scopedSlots: {
            customRender: 'customRender'
          }
        }
      ]
    },
    fields () {
      const field_name = {}

      this.name_demo.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field_name
    },
    name_demo () {
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
          title: '姓名',
          dataIndex: 'name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'name'
          },
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_true => {
            if (visible_true) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '性别',
          dataIndex: 'gender',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'gender'
          },
          onFilter: (value, record) => record.gender.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_true => {
            if (visible_true) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '岗位状态',
          dataIndex: 'positionStatus',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.positionStatus.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible_true => {
            if (visible_true) {
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
    }
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

    // 双击确定
    dbClick2 (record) {
      return {
        on: {
          dblclick: (e) => {
            console.log(record, '----', e)
            this.selectedRows[0] = record
            this.handleOk(record.id)
          }
        }
      }
    },
    // 合同表格
    showTable () {
      this.visible_name = true
      this.$refs.table && this.refresh('table')
    },

    refresh (ref) {
      this.$refs[ref].clearSelected()
      this.$refs[ref].refresh(true)
      this.selectedRowKeys = []
      this.queryParam = {}
      this.selectedRows = []

      for (const key in this.customFilterColumn) {
        if (this.customFilterColumn.hasOwnProperty(key)) {
          this.customFilterColumn[key].clearFilters()
        }
      }

      // 清空了过滤内容
      this.filteredInfo = null
    },
    handleCancel () {
      this.visible_name = false
    },
    handleName (val) {
      // const arr = this.contractData.responsePageInfo.list.filter(item => item.id === val[0])
      const arr = this.selectedRows
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.form.setFieldsValue({
        contract_no: arr[0].contract_code,
        install_org: arr[0].install_org,
        fee_with_tax: arr[0].fee_with_tax
      })
      this.handleCancel()
    },
    // HR树
    showName () {
      this.visible_true = true
    },
    nameChange (e) {
      console.log(e)
      this.nameTree = e.target.value
      queryAllName({ name: this.nameTree }).then(res => (this.name_dicTree = res.responseList))
    },
    onNameClick: function (evt, treeId, treeNode) {
      // 点击事件
      // console.log(evt.type, treeNode)
      this.queryParam = {
        id: treeNode.id,
        type: treeNode.type
      }
      // console.log(this.queryParam)
      this.$refs.tables.refresh(true)
    },
    onNameCheck: function (evt, treeId, treeNode) {
      // 选中事件
      console.log(evt.type, treeNode)
    },
    handleNameCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      console.log(ztreeObj)
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleNameCancel () {
      this.visible_true = false
      this.refresh('Etables')
    },
    handleNameOk (val) {
      const arr = this.hrData.responsePageInfo.list.filter(item => item.id === val[0])
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.form.setFieldsValue({
        check_person: arr[0].name
      })
      this.handleNameCancel()
    },
    // 设备名称树
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    valueChange (e) {
      console.log(e)
      // this.valTree = e.target.value
      queryAllEquipment({ e_name: e }).then(res => (this.dicTree = res.responseList))
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      // console.log(evt.type, treeNode)
      this.queryParam = {
        equipment_code: treeNode.equipment_code
      }
      // console.log(this.queryParam)
      this.$refs.Etables.refresh(true)
    },
    onCheck: function (evt, treeId, treeNode) {
      // 选中事件
      console.log(evt.type, treeNode)
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      console.log(ztreeObj)
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    update: function () {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    },
    handleTitleClick (item) {
      console.log('handleTitleClick', item)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    handleSaveClose () { },
    handleOk (val) {
      this.visible = false
      // const arr = this.tableData.responsePageInfo.list.filter(item => item.id === val[0])
      const arr = this.selectedRows
      console.log(val, '---', arr)
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (val.length > 1) return this.noSelect()
      this.equip_code = arr[0].equip_code
      this.form.setFieldsValue({
        manage_code: arr[0].manage_code,
        equip_name: arr[0].equip_name,
        spec: arr[0].specification
      })
      // 验收项目动态加载
      getQueryCheckItem({
        menu_id: 36,
        equip_name: arr[0].equip_name,
        equipment_category_code: arr[0].equipment_category_code
      }).then(res => {
        this.detailData = res.responseList.map((d, i) => {
          d.check_item = d.inspect_name || '--'
          d.content = d.inspect_content || '--'
          d.result = '良好'
          d.remark = '测试默认'
          d.editable = true
          d.isNew = true
          d.key = i + 1
          d.code = i + 1
          return d
        })
      })
      this.handleCancel()
    },
    showModal () {
      this.visible = true
      this.$refs.Etables && this.refresh('Etables')
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
    handleGoBack () {
      // this.$emit('onGoBack')
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('InstallationAcceptanceList')
    },
    handleGetInfo () {
    },
    loadEditInfo (data) {
      const { form } = this
      queryAllName().then(res => (this.name_dicTree = [res.responseObject]))
      queryDictionaries({ dic_type_id: 1012 }).then(res => {
        this.queryLevel = res.responseList.map(x => {
          x.label = x.dic_type_name
          x.value = x.dic_type_name
          return x
        })
      })
      console.log(`将加载 ${data.id} 信息到表单`)
      if (data.id) {
        queryone({ id: data.id }).then(res => {
          console.log("一查三", res)
          this.number = true
          this.detailData = res.responseObject.detail.map((d, i) => {
            d.editable = true
            d.isNew = true
            d.code = i + 1
            d.key = d.id + ''
            return d
          })
          this.sumData[0]['check_result'] = res.responseObject.check_result
          this.sumData[0]['check_remarks'] = res.responseObject.check_remarks
        })
        getAttachments({ id_in_module: data.id, module: modules.InstallationAcceptance }).then(res => {
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
        // this.detailData = this.detailData.map((item, index) => {
        //   item.code = index
        //   return item
        // })
        const formData = pick(data, ['creator_org_id', 'check_result', 'check_remarks', 'serial_number', 'creator_org_name', 'creator_user_name', 'create_date', 'check_org', 'contract_no', 'install_org', 'fee_with_tax', 'manage_code', 'equip_name', 'spec', 'check_date', 'install_person', 'check_person'])
        formData.create_date = moment(data.create_date)
        formData.check_date = moment(data.check_date)
        console.log('formData', formData)
        form.setFieldsValue(formData)
      }
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
        this.detailData = newData
      }
    },
    sumhandleChange (value, key, column) {
      const newsumData = [...this.sumData]
      const target = newsumData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.sumData = newsumData
        console.log(this.sumData)
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
    // 附件删除
    removeAttachment (record) {
      const data = {
        type: 0,
        menu_id: 36,
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
          values.equip_code = this.equip_code
          values.details = that.detailData
          values.files = that.fileList
          values.check_remarks = that.sumData[0]['check_remarks']
          values.check_result = that.sumData[0]['check_result']
          console.log(that.params)

          if (that.params.id) {
            values.creator_org_id = that.params.creator_org_id
            values.id = that.params.id
            // values.remark = that.params.remark
            values.creator_user_id = that.params.creator_user_id
            values.creator_org_name = that.params.creator_org_name
            values.creator_org_code = that.params.creator_org_code
            // values. =that.params.client_code
            values.flag = 2
            values.client = that.params.client
            values.status = that.params.status
            // values.creator_org_name=that.params.creator_org_name
          } else {
            values.flag = 1
          }
          // 日期格式转换
          values.menu_id = 36
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code
          values.create_date && (values.create_date = values.create_date.format('YYYY-MM-DD'))
          values.check_date && (values.check_date = values.check_date.format('YYYY-MM-DD'))
          for (let key in values) {
            const isTrue = values[key] === '' || values[key] === undefined || values[key] === null
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

            return handlePurchase(values, 'create').then(res => {
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
        console.log(file)
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
    },

    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
      // if (col) this.refresh(true)
    },

    handleNameReset (clearFilters, col) {
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
