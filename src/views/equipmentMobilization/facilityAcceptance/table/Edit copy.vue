<template>
  <div>
    <!-- 基本设备需求计划信息 -->
    <a-card class="card" title="临时设施验收单" :bordered="false">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="单据编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'serial_number'
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
                    initialValue: $store.state.pro_unit
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
                style="width: 100%"
                disabled
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
                  { initialValue: $store.state.pro_unit }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="合同编号" v-bind="formItemLayout">
              <a-input
                read-only
                @click="showTable"
                placeholder="选择合同编号信息"
                v-decorator="[
                  'contract_num',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="安装单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="选择合同编号带入"
                v-decorator="[
                  'install_org',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item disabled label="含税金额" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="选择合同编号带入"
                v-decorator="[
                  'fee_with_tax',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="验收日期" v-bind="formItemLayout">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'check_date',
                  {
                    initialValue: date,
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="安装工程" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                @change="handleChangeValue"
                v-decorator="[
                  'install_project',
                  {
                    rules: [{ required: true, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              >
                <a-select-option value="电力">电力</a-select-option>
                <a-select-option value="水力">水力</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="安装人" v-bind="formItemLayout">
              <a-input
                placeholder="安装单位人员"
                v-decorator="[
                  'install_person',
                  {
                    rules: [{ max: 32, required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="验收人" v-bind="formItemLayout">
              <a-input
                placeholder="验收单位人员"
                v-decorator="[
                  'check_person',
                  {
                    rules: [{ max: 32, required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
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
      @cancel="handleCancel"
    >
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        bordered
        :columns="contract_data"
        :customRow="dbClick"
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

    <!-- 分包商 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="userVisible"
      width="100%"
      @ok="handleUser(selectedRowKeys)"
      @cancel="cancelUserModal"
    >
      <s-table
        ref="Usertable"
        size="small"
        rowKey="id"
        :customRow="dbClick2"
        bordered
        :columns="user_data"
        :data="loadUser"
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

    <!-- WBS -->
    <wbs-modal ref="wbsModal" @ok="handleWbs" />
    <wbs-modal ref="wbsModalF" @ok="handleWbsF" />

    <!-- 分包商 -->
    <sub-modal ref="subModal" @ok="handleSub"></sub-modal>

    <!-- 设施明细 -->
    <a-card class="card" title="设施明细">
      <a-table
        childrenColumnName="'child'"
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
          slot-scope="record, index"
          :columns="columnsSon"
          :dataSource="detailData[index] ? detailData[index].waterElectricityDetails : []"
          :pagination="false"
          :loading="memberLoading"
          rowKey="key"
          bordered
          :scroll="{ x: 1100 }"
        >
          <template v-for="(col, i) in detailFields2" :slot="col" slot-scope="text, record">
            <!-- @click="showUseModal(record)" -->
            <a-input
              read-only
              :key="col"
              :maxlength="128"
              v-if="record.editable && inputFields.includes(col) && col === 'use_org'"
              style="margin: -5px 0"
              :value="text"
              @click="showSub(record)"
              :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
              @change="e => handleChange2(e.target.value, record, col)"
            />
            <a-input
              read-only
              :key="col"
              :maxlength="128"
              v-else-if="record.editable && inputFields.includes(col) && col === 'use_site'"
              style="margin: -5px 0"
              :value="text"
              @click="showWbs(record)"
              :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
              @change="e => handleChange2(e.target.value, record, col)"
            />
            <a-input
              :key="col"
              :maxlength="128"
              v-else-if="record.editable && inputFields.includes(col)"
              style="margin: -5px 0"
              :value="text"
              :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
              @change="e => handleChange2(e.target.value, record, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && selectFields.includes(col)"
              style="margin: -5px 0"
              :value="text"
              :placeholder="ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col]"
              @change="value => handleChange2(value, record, col)"
            >
              <a-select-option
                v-for="item in selectData[col]"
                :key="item.dic_enum_name"
              >{{ item.dic_enum_name }}</a-select-option>
            </a-select>
            <a-date-picker
              :key="col"
              :value="text"
              :placeholder="ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col]"
              v-else-if="record.editable && datePickerFields.includes(col)"
              @change="value => handleChange2(value, record, col)"
            />
            <a-input-number
              :key="col"
              :max="col === 'electric_meter_number' ? 9999999999999999999.9999 : 999999999"
              :value="text"
              :min="0"
              :placeholder="col === 'electric_meter_number' || col === 'water_meter_number' ? '根据右侧添加水电表数据生成' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
              :step="col === 'initial_number' ? 0.0001 : 1"
              v-else-if="record.editable && numberFields.includes(col)"
              @change="value => handleChange2(value, record, col)"
            />
            <template
              v-else
            >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
          </template>

          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a-popconfirm title="是否要删除此行？" @confirm="removeSon(record)">
                  <a>
                    <a-icon type="delete" />
                  </a>
                </a-popconfirm>
              </span>
            </template>
          </template>
        </a-table>
        <template v-for="(col, i) in detailFields" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable && inputFields.includes(col)  && col !== 'use_site'"
            :maxlength="128"
            style="margin: -5px 0"
            :value="text"
            :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input
            read-only
            :key="col"
            v-else-if="record.editable && popFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            @click="showModal(record.key)"
            :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input
            read-only
            :key="col"
            :maxlength="128"
            v-else-if="record.editable && inputFields.includes(col) && col === 'use_site'"
            style="margin: -5px 0"
            :value="text"
            @click="showWbsF(record)"
            :placeholder="col === 'remark' ? '备注' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
            @change="e => handleChange2(e.target.value, record, col)"
          />
          <a-select
            :key="col"
            v-else-if="record.editable && selectFields.includes(col)"
            style="margin: -5px 0"
            :value="text"
            :placeholder="ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col]"
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
            :placeholder="ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col]"
            v-else-if="record.editable && datePickerFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <a-input-number
            :key="col"
            :value="text"
            :max="col === 'electric_meter_number' ? 9999999999999999999.9999 : 999999999"
            :min="0"
            :placeholder="col === 'electric_meter_number' ? '根据右侧添加水点数据生成' :(ipValue === '水力' ? columnsTitle2[col] : columnsTitle1[col])"
            :step="col === 'initial_number' ? 0.0001 : 1"
            v-else-if="record.editable && numberFields.includes(col)"
            @change="value => handleChange(value, record.key, col)"
          />
          <template
            v-else
          >{{ selectFields.includes(col) ? (selectData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a-tooltip @click="addElectric(record.key)">
                <template slot="title">
                  <p>点击添加电表数量</p>
                </template>
                <a>
                  <a-icon type="plus" />
                </a>
              </a-tooltip>
              <!-- <a @click="saveRow(record)">添加</a> -->
              <a-divider type="vertical" />
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
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="newDevice"
      >新增设施</a-button>
    </a-card>

    <a-modal title="请选择" v-model="visible" width="100%" @ok="handleOk" @cancel="visibleCancel">
      <a-row :gutter="8">
        <a-col :span="6">
          <a-input-search v-model="valTree" placeholder="请输入要查询的名称并按回车进行搜索" @search="valueChange" />
          <ZTree
            class="z-tree"
            :setting="setting"
            :nodes="dicTree"
            @onClick="onClick"
            @onCreated="handleCreated"
          />
        </a-col>
        <a-col :span="18">
          <s-table
            class="s-table"
            ref="Etables"
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
          </s-table>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 验收内容 -->
    <a-card class="card" title="验收内容">
      <a-table
        bordered
        :columns="columns_result"
        :dataSource="result_detailData"
        :pagination="false"
        :loading="memberLoading"
        rowKey="key"
      >
        <template v-for="(col, i) in result_detailFields" :slot="col" slot-scope="text, record">
          <a-radio-group
            :key="col"
            v-if="radio_resultFields.includes(col)"
            :value="text"
            @change="e => result_handleChange(e.target.value, record.key, col)"
          >
            <a-radio
              v-for="item in queryLevel"
              :key="item.dic_enum_id"
              :value="item.dic_enum_name"
            >{{ item.dic_enum_name }}</a-radio>
          </a-radio-group>
          <template
            v-else
          >{{ select_resultFields.includes(col) ? (select_resultData[col].filter(c => c.dic_enum_name === text))[0].dic_enum_name : text }}</template>
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
          <template v-for="(col, i) in sumFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              v-if="record.editable && inputFields.includes(col)"
              style="margin: -10px 0"
              :value="text"
              placeholder="结论描述"
              @change="e => sumhandleChange(e.target.value, record.key, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && selectFields.includes(col)"
              style="margin: -10px 0;width:200px"
              :value="text"
              placeholder="验收总结论"
              @change="value => sumhandleChange(value, record.key, col)"
            >
              <a-select-option
                v-for="item in queryLevel"
                :key="item.dic_enum_name"
                :value="item.dic_enum_name"
              >{{ item.dic_enum_name }}</a-select-option>
            </a-select>
            <a-input-number
              :key="col"
              :value="text"
              :min="0"
              :step="col === 'number' ? 1 : 1"
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
          :data="{model:'B003', menu_id: 35, type: 0}"
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
import { STable, ZTree } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getCondInfo } from '@/api/common.js'
import { handlePurchase, queryone, getQueryResult, getQuerySource, getQueryCheckItem } from '@/api/equipmentMobilization/facilityAcceptance'
import { uploadUrl, modules, model, getAttachments, downloadAttachment, delAttachment, formStatus, queryAllContract, queryAllEquipment, queryByEquipment } from '@/api/equipmentMobilization/upload'
import { mapGetters } from 'vuex'
import wbsModal from '@/views/equipmentMobilization/modules/wbs'
import subModal from '@/views/equipmentMobilization/modules/sub'
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
    wbsModal,
    subModal,
    ZTree,
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
      equip_code: '',
      userVisible: false,
      clickObj: {},
      useOrgObj: {},
      params: {},
      valTree: '',
      dicTree: [],
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'e_name'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parent_code',
            idKey: 'equipment_code'
          }
        }
      },
      curExpandedRowKeys: [],
      isrequired: false,
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
      visible_name: false,
      visible: false,
      number: '',
      ipValue: '',
      queryLevel: [
        {
          dic_enum_id: '符合要求',
          dic_enum_name: '符合要求'
        },
        {
          dic_enum_id: '不符合要求',
          dic_enum_name: '不符合要求'
        }
      ],
      serial_number: '',
      activeTabKey: 'attach',
      fileList: [],
      selectData: {},
      selectFields: ['check_result'],
      popFields: ['name'],
      inputFields: ['source', 'spec', 'check_remark', 'name', 'remark', 'product_org', 'use_site', 'num', 'use_org'],
      // input_resultFields:[],
      number_resultFields: ['multiplying_power', 'initial_number'],
      radio_resultFields: ['result'],
      select_resultFields: [],
      datePickerFields: [],
      numberFields: ['multiplying_power', 'initial_number'],
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
      sizeable: true,
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
        return queryByEquipment(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          this.currentSize = res.responsePageInfo.pageSize
          this.tableData = res
          res.responsePageInfo.list.forEach(x => {
            x.code = x.equipment_code
          })
          return res.result || {
            pageSize: res.responsePageInfo.pageSize,
            pageNo: res.responsePageInfo.pageNum,
            totalPage: res.responsePageInfo.pages,
            totalCount: res.responsePageInfo.total,
            data: res.responsePageInfo.list
          }
        })
      },
      newDataKey: '',
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
      loadUser: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }

        parameter.current = parameter.pageNum
        parameter.size = parameter.pageSize
        delete parameter.pageSize
        delete parameter.pageNum
        return getCondInfo(Object.assign(parameter, this.queryParam, {
          "condition": {
            "supName": "",
            "organCode": "0000100002",
            "legalPersonName": ""
          }
        })).then(res => {
          // 索引
          this.current = res.responseObject.data.current
          this.currentSize = res.responseObject.data.size

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
      },

      // 设施 table
      detailData: [],
      waterElectricityDetails: [],
      columnsTitle1: {
        code: '序号',
        source: '来源',
        name: '名称',
        spec: '规格',
        num: '编号',
        multiplying_power: '初始读数',
        initial_number: '倍率',
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
          width: '120px',
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
        },
        {
          title: '操作',
          key: 'action',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      columnsTitle2: {
        code: '序号',
        name: '名称',
        spec: '规格',
        num: '编号',
        use_site: '使用部位',
        initial_number: '初始读数',
        multiplying_power: '倍率',
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
          width: '120px',
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
        },
        {
          title: '操作',
          key: 'action',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
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
        },
        {
          title: '操作',
          key: 'action',
          width: '60px',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      detailFields: ['electric_meter_number', 'spec', 'multiplying_power', 'initial_number', 'name', 'num', 'product_org', 'use_site', 'use_org', 'remark', 'source'],
      detailFields2: ['name', 'spec', 'num', 'multiplying_power', 'use_site', 'use_org', 'remark', 'initial_number'],
      // 验收数据
      result_Data: [],
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
      selectedRowKeys: [],
      selectedRows: [],
      customFilterColumn: []
    }
  },
  computed: {
    fields () {
      const field = {}

      this.user_data.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })
      return field
    },
    user_data () {
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
          title: '分包商名称',
          dataIndex: 'supName',
          scopedSlots: {
            customRender: 'supName'
          }
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'socialId',
          // width: '200px',
          scopedSlots: {
            customRender: 'socialId'
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
          title: '状态',
          dataIndex: 'state',
          scopedSlots: {
            customRender: 'state'
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
          dataIndex: 'equipment_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equipment_name'
          },
          onFilter: (value, record) => record.equipment_name.toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'material_model',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'material_model'
          },
          onFilter: (value, record) => record.material_model.toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'code',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'code'
          },
          onFilter: (value, record) => record.code.toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'unit_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.unit_name.toLowerCase().includes(value.toLowerCase()),
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
  watch: {
    $route (to, from) {
      if (to.path == '/equipmentMobilization/facilityAcceptanceEdit') {
        // this.resetForm()
        this.params = this.$route.params
        let a = true
        if (a) {
          this.$nextTick(() => {
            this.loadEditInfo(this.params)
            a = false
          })
        }

        this.isrequired = true
      }
    }
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

    showWbsF (record) {
      this.clickObj = record
      this.$refs.wbsModalF.add()
    },

    // wbs
    handleWbsF (record) {
      // console.log('确定', record, this.clickObj)
      this.detailData.forEach(x => {
        if (x.key === this.clickObj.key) {
          x.use_site = record
        }
      })
    },

    showWbs (record) {
      this.clickObj = record
      this.$refs.wbsModal.add()
    },

    // wbs
    handleWbs (record) {
      // console.log('确定', record, this.clickObj)
      this.detailData.forEach(x => {
        if (x.key === this.clickObj.pid) {
          console.log(x)
          x.waterElectricityDetails.forEach(d => {
            if (d.key === this.clickObj.key) {
              d.use_site = record
            }
          })
        }
      })
    },

    // 分包商
    showUseModal (record) {
      console.log(1, record)
      this.clickObj = record
      this.userVisible = true
      this.$refs.Usertable && this.refresh('Usertable')
    },
    cancelUserModal () {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.userVisible = false
    },
    handleUser () {
      const arr = this.selectedRows
      if (!arr.length) return
      if (arr.length > 1) return this.noSelect()

      this.useOrgObj = arr[0]
      this.detailData.forEach(x => {
        if (x.key === this.clickObj.pid) {
          x.waterElectricityDetails.forEach(d => {
            if (d.key === this.clickObj.key) {
              d.use_org = this.useOrgObj.supName
              d.use_org_code = this.useOrgObj.socialId
            }
          })
        }
      })

      this.cancelUserModal()
    },
    // 双击确定
    dbClick2 (record) {
      return {
        on: {
          dblclick: (e) => {
            this.selectedRows[0] = record
            this.handleUser(record.id)
          }
        }
      }
    },

    // 双击确定
    dbClick (record) {
      return {
        on: {
          dblclick: (e) => {
            this.selectedRows[0] = record
            this.handleName(record.id)
          }
        }
      }
    },

    // 设施明细选择设备
    showModal (key) {
      queryAllEquipment().then(res => {
        this.dicTree = res.responseList
      })
      this.valTree = ''
      this.newDataKey = key
      this.visible = true
      this.$refs.Etables && this.refresh('Etables')
    },

    // 设备树 选择数据确定
    handleOk () {
      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '提示',
          content: '您未选择任何数据'
        })
        return
      }
      const dataArr = this.selectedRows[0]
      if (this.ipValue === '水力') {

      } else {

      }
      if (this.newDataKey === '1') this.result_detailData = []
      this.detailData = this.detailData.map(x => {
        if (x.key === this.newDataKey) {
          x.name = dataArr.equipment_name
          x.spec = dataArr.material_model
          x.num = dataArr.equipment_code
        }
        return x
      })
      if (!this.result_detailData.length) {
        // 根据选择设备加载验收记录
        getQueryCheckItem({
          menu_id: 35,
          equip_name: dataArr.equipment_name,
          equipment_category_code: dataArr.equipment_category_code
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
      }
      this.visibleCancel()
    },

    // 设备弹窗 点击请求表格
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      console.log(evt.type, treeNode)
      this.queryParam = {
        equipment_code: treeNode.equipment_code
      }
      this.$refs.Etables.refresh(true)
    },

    // 展开设备树第一级
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },

    // 设备树 模糊搜索
    valueChange (e) {
      console.log(e)
      this.valTree = e
      queryAllEquipment({ e_name: this.valTree }).then(res => (this.dicTree = res.responseList))
    },
    showSub (record) {
      this.clickObj = record
      this.$refs.subModal.add()
    },
    handleSub (record) {
      this.detailData.forEach(x => {
        if (x.key === this.clickObj.pid) {
          x.waterElectricityDetails.forEach(d => {
            if (d.key === this.clickObj.key) {
              d.use_org = record.supName
              d.use_org_code = record.socialId
            }
          })
        }
      })
    },

    // 取消模态框
    visibleCancel () {
      this.visible = false
      this.selectedRowKeys = []
      this.selectedRows = []
    },

    // 重置刷新表格
    refresh (ref) {
      this.queryParam = {}
      this.selectedRowKeys = []
      this.selectedRows = []
      this.$refs[ref].clearSelected()
      this.$refs[ref].refresh(true)

      for (const key in this.customFilterColumn) {
        if (this.customFilterColumn.hasOwnProperty(key)) {
          this.customFilterColumn[key].clearFilters()
        }
      }

      // 清空了过滤内容
      this.filteredInfo = null
    },

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      confirm()
      // if (col) this.refresh(true)
    },

    handleReset (clearFilters, col) {
      clearFilters()
      // delete this.queryParam[col]
      // this.refresh(true)
    },

    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.result_detailData = []
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
      this.sumData[0]['check_result'] = ''
      this.sumData[0]['check_remark'] = ''
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    // 返回
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('facilityAcceptanceList')
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
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 显示合同弹窗
    showTable () {
      this.visible_name = true
      this.$refs.table && this.refresh('table')
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
        contract_num: arr[0].contract_code,
        install_org: arr[0].install_org,
        fee_with_tax: arr[0].fee_with_tax
      })
      this.handleCancel()
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
          const formData = pick(data, ['serial_number', 'pro_unit', 'creator_user_name', 'create_date', 'check_org', 'contract_num', 'install_org', 'fee_with_tax', 'check_date', 'install_project', 'install_person', 'check_person', 'check_result', 'check_remark'])
          formData.create_date = moment(data.create_date)
          formData.check_date = moment(data.check_date)
          console.log('formData', formData)
          form.setFieldsValue(formData)
          this.serial_number = res.responseObject.serial_number
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
            d.waterElectricityDetails.forEach((c, n) => {
              c.code = n + 1
            })

            return d
          })
          this.result_detailData = res.responseObject.detail.map((d, i) => {
            // d.result = d.result
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

    addElectric (key) {
      if (this.detailData.length > 0) {
        const numson = this.detailData[key - 1].waterElectricityDetails.length - 1
        if (this.detailData[key - 1].waterElectricityDetails.length > 0 && this.detailData[key - 1].waterElectricityDetails[numson].name === '') return this.noSelect('请填完上一条数据！')
      }
      // 控制当前添加的子表格的行展开
      this.curExpandedRowKeys = [key]
      // const length = this.detailData[key - 1].waterElectricityDetails.length
      let length = 0
      this.detailData.map(x => {
        if (x.key === key) {
          length = x.waterElectricityDetails.length
        }
      })
      this.detailData[key - 1].waterElectricityDetails.push({
        key: length === 0 ? '1' : (parseInt(this.detailData[key - 1].waterElectricityDetails[length - 1].key) + 1).toString(),
        code: length + 1,
        pid: key,
        name: '',
        spec: '',
        use_site: '',
        use_org: '',
        remark: '',
        num: '',
        editable: true,
        isNew: true
      })
      this.detailData[key - 1].waterElectricityDetails.forEach((x, i) => x.code = i + 1)
      if (this.ipValue === '水力') this.detailData[key - 1].water_meter_number = this.detailData[key - 1].waterElectricityDetails.length
      else this.detailData[key - 1].electric_meter_number = this.detailData[key - 1].waterElectricityDetails.length
    },

    newDevice () {
      const length = this.detailData.length
      if (length > 0 && this.detailData[length - 1].name === '') return this.noSelect('请填完上一条数据！')
      const data1 = { // 水
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        name: '',
        spec: '',
        use_site: '',
        use_org: '',
        remark: '',
        water_meter_number: 1,
        num: '',
        waterElectricityDetails: [
          {
            key: '1',
            code: 1,
            pid: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
            name: '',
            spec: '',
            initial_number: '',
            use_site: '',
            use_org: '',
            remark: '',
            num: '',
            editable: true,
            isNew: true
          }
        ],
        editable: true,
        isNew: true
      }
      const data2 = {
        key: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
        code: length + 1,
        name: '',
        spec: '',
        use_site: '',
        use_org: '',
        remark: '',
        electric_meter_number: 1,
        num: '',
        multiplying_power: '',
        product_org: '',
        source: '',
        waterElectricityDetails: [
          {
            key: '1',
            code: 1,
            pid: length === 0 ? '1' : (parseInt(this.detailData[length - 1].key) + 1).toString(),
            name: '',
            spec: '',
            initial_number: '',
            use_site: '',
            use_org: '',
            remark: '',
            num: '',
            editable: true,
            isNew: true
          }
        ],
        editable: true,
        isNew: true
      }
      if (this.ipValue === '水力') {
        this.detailData.push(data1)
      } else {
        this.detailData.push(data2)
      }
      // 控制添加的表格当前行展开
      this.curExpandedRowKeys = [this.detailData[length].key]
      this.detailData.forEach((x, i) => x.code = i + 1)
    },

    // 设施明细 表格展开事件 控制只有单独的行展开
    expand (expanded, record) {
      console.log('展开事件')
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

    remove (key) {
      const newData = this.detailData.filter(item => item.key !== key)
      newData.forEach((x, i) => {
        x.code = i + 1
      })
      if (!newData.length) this.result_detailData = []
      this.detailData = newData
    },
    removeSon (record) {
      this.detailData.forEach(x => {
        if (x.key === record.pid) {
          if (x.waterElectricityDetails.length === 1) return this.noSelect('需要至少填写一条数据')
          x.waterElectricityDetails = x.waterElectricityDetails.filter(item => item.key !== record.key)
          x.waterElectricityDetails.forEach((x, i) => {
            x.code = i + 1
          })
          if (this.ipValue === '水力') x.water_meter_number = x.waterElectricityDetails.length
          else x.electric_meter_number = x.waterElectricityDetails.length
        }
      })
      console.log(this.detailData)
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
        if (column === 'multiplying_power' && typeof target[column] === Number) target[column] = parseInt(target[column])
        this.detailData = newData
      }
    },
    handleChange2 (value, record, column) {
      const arrData = [...this.detailData]
      const target = arrData.filter(x => x.key === record.pid)[0].waterElectricityDetails.filter(item => record.key === item.key)[0]
      if (target) {
        target[column] = value
        if (column === 'multiplying_power' && typeof target[column] === Number) target[column] = parseInt(target[column])
        this.detailData = arrData
      }

    },
    result_handleChange (value, key, column) {
      const newresultData = [...this.result_detailData]
      const target = newresultData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.result_detailData = newresultData
        console.log(value)
      }
      console.log('result', this.result_detailData)
    },
    sumhandleChange (value, key, column) {
      const newsumData = [...this.sumData]
      const target = newsumData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.sumData = newsumData
        // console.log('sum',this.sumData)
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
    },
    // 附件删除
    removeAttachment (record) {
      const data = {
        menu_id: 35,
        type: 0,
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
                if (key != 'use_org' && !break1 && key != 'remark') {
                  (this.ipValue === '水力' ? this.columns2 : this.columns1).map(item => {
                    if (item.dataIndex == key) colname = item.title
                  })

                  this.$notification['warn']({
                    message: '提示',
                    description: `提交时第${d.code}行：${colname}不能为空`
                  })
                  break1 = true
                  return
                }
              } else {
                if (!break1) [
                  d.waterElectricityDetails.forEach(c => {
                    for (let k in c) {
                      if (!c[k] && c[k] !== 0 && k !== 'remark' && k !== 'aaaaa') {
                        this.columnsSon.forEach(item => {
                          if (item.dataIndex == k) colname = item.title
                        })
                        console.log(colname)
                        this.$notification['warn']({
                          message: '提示',
                          description: `提交时第${d.code}行下第${c.code}行：${colname}不能为空`
                        })
                        break1 = true
                        return
                      }
                    }
                  })
                ]
              }
            }
          }
        })
        if (break1) return
      }
      setTimeout(() => {

        validateFields((err, values) => {

          // values.waterElectricityDetails = that.detailData.map(x => x.waterElectricityDetails)
          const arr = that.detailData.map(x => {
            for (let key in x) {
              if (!x[key]) {
                delete x[key]
              }
            }
            x.waterElectricityDetails = x.waterElectricityDetails.map(d => {
              for (let k in d) {
                if (!d[k]) {
                  delete d[k]
                }
              }
              return d
            })
            return x
          })
          if (values.install_project === '水力') {
            values.details1 = arr
            // values.details1.forEach(x => delete x.waterElectricityDetails)
          } else if (values.install_project === '电力') {
            values.details = arr
            // values.details.forEach(x => delete x.waterElectricityDetails)
          }

          values.detail = that.result_detailData
          values.check_result = that.sumData[0]['check_result']
          values.check_remark = that.sumData[0]['check_remark']
          values.files = that.fileList
          values.equip_code = that.equip_code



          if (that.params.id) {
            values.creator_org_id = that.params.creator_org_id
            values.id = that.params.id
            // values.remark = that.params.remark
            values.serial_number = that.params.serial_number
            values.creator_user_id = that.params.creator_user_id
            // values.creator_org_name = that.params.creator_org_name
            values.flag = 2
            // values.manage_code=that.params,manage_code
            values.creator_org_id = that.params.creator_org_id
            values.status = that.params.status
          } else {
            values.flag = 1
          }
          // 日期格式转换
          values.menu_id = 35
          values.creator_org_id = that.$store.state.menu_key
          values.creator_org_name = that.$store.state.org_name
          values.pro_unit_code = that.$store.state.pro_unit_code

          values.create_date = values.create_date.format('YYYY-MM-DD')
          values.check_date = values.check_date.format('YYYY-MM-DD')
          for (let key in values) {
            const isTrue = values[key] === '' || values[key] === null || values[key] === undefined
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
