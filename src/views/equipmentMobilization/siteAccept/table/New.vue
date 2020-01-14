<template>
  <div>
    <!-- 进场验收信息 -->
    <a-card class="card" title="进场验收单" :bordered="false">
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
                    initialValue: recording.serial_number
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
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'create_date',
                  { initialValue: date }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备类型" v-bind="formItemLayout">
              <a-select
                placeholder="请选择"
                v-decorator="[
                  'equip_type',
                  {
                    rules: [{ required: isrequired, message: '请选择' }]
                  }
                ]"
              >
                <a-select-option value="通用设备">通用设备</a-select-option>
                <a-select-option value="指挥车辆">指挥车辆</a-select-option>
                <a-select-option value="特种设备">特种设备</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备来源" v-bind="formItemLayout">
              <a-select
                placeholder="请选择设备来源"
                v-decorator="[
                  'equip_source',
                  {
                    rules: [{ required: isrequired, message: '请选择' }]
                  }
                ]"
                @change="handleRequisition"
              >
                <a-select-option value="自有设备">自有设备</a-select-option>
                <a-select-option value="租赁设备">租赁设备</a-select-option>
                <a-select-option value="分包商设备">分包商设备</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="设备名称" v-bind="formItemLayout">
              <a-input
                read-only
                :disabled="value === '调拨单号' ? true : false"
                :placeholder="value === '调拨单号' ? '自动带入' : '请选择'"
                v-decorator="[
                  'equip_name',
                  {
                    rules: [{ required: isrequired, message: '请选择' }]
                  }

                ]"
                @click="value === '调拨单号' ? '' : showModal()"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="规格型号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'specification'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="value" v-bind="formItemLayout">
              <a-input
                read-only
                :placeholder="`请输入${value}`"
                v-decorator="[
                  'requisition',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
                @click="showTable"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="管理编号" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'manage_code',
                  { rules: [{ max: 128, message: '内容未输入或超过字符长度限制' }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="功率" v-bind="formItemLayout">
              <a-input-number
                :max="999999999"
                :min="0"
                :step="1"
                placeholder="请输入功率"
                style="width: 100%"
                v-decorator="[
                  'power',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="生产厂家" v-bind="formItemLayout">
              <a-input
                placeholder="请输入生产厂家"
                v-decorator="[
                  'manufacturer',
                  { rules: [{ max: 128, message: '内容未输入或超过字符长度限制',required: isrequired }] }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="value === '调拨单号'">
          <a-col :span="8">
            <a-form-item label="购置日期" v-bind="formItemLayout">
              <a-date-picker
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'purchase_date'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所在地" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'location'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="使用单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                style="width:100%"
                v-decorator="[
                  'use_org'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="出厂日期" v-bind="formItemLayout">
              <a-date-picker
                placeholder="请选择出厂日期"
                style="width:100%"
                v-decorator="[
                  'production_time',
                  {
                    rules: [{ required: isrequired, message: '请选择' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="原值" v-bind="formItemLayout">
              <a-input-number
                placeholder="自动生成"
                :max="999999999999999.99"
                :min="0"
                :step="0.01"
                style="width:100%"
                v-decorator="[
                  'original_value'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="净值" v-bind="formItemLayout">
              <a-input-number
                placeholder="请输入净值（元）"
                :max="999999999999999.99"
                :min="0"
                :step="0.01"
                style="width:100%"
                v-decorator="[
                  'net_value'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="进场日期" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                @change="startChange"
                v-decorator="[
                  'in_date',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="退场日期" v-bind="formItemLayout">
              <a-date-picker
                style="width:100%"
                @change="endChange"
                v-decorator="[
                  'out_date',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="被验收单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'accept_from'
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="被验收人" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动生成"
                v-decorator="[
                  'acceptance_from_person'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="使用部位" v-bind="formItemLayout">
              <a-input
                read-only
                @click="() => $refs.wbsModal.add()"
                placeholder="请选择使用部位"
                v-decorator="[
                  'use_site',
                  { rules: [{ message: '内容未输入或超过字符长度限制' ,required: isrequired }] }
                ]"
              />
              <!-- <a-select
                @click="() => $refs.wbsModal.add()"
                placeholder="请选择使用部位"
                v-decorator="[
                  'use_site',
                  {
                    rules: [{ required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              >
                <a-select-option
                  v-for="item in projectName"
                  :key="item.project_name"
                  :value="item.project_name"
                >{{ item.project_name }}</a-select-option>
              </a-select>-->
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="验收单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="请输入验收单位"
                v-decorator="[
                  'accept_to',
                  { 
                    initialValue: $store.state.pro_unit
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="验收日期" v-bind="formItemLayout">
              <a-date-picker
                style="width: 100%"
                v-decorator="[
                  'accept_date',
                  {
                    rules: [{ required: isrequired, message: '请选择' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item read-only label="验收人" v-bind="formItemLayout">
              <a-input
                placeholder="请选择验收人"
                v-decorator="[
                  'accept_to_person',
                  {
                    initialValue: nickname(),
                    rules: [{ required: isrequired, message: '请选择' }]
                  }
                ]"
                @click="showName"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item read-only label="单位" v-bind="formItemLayout">
              <a-input
                placeholder="请输入单位"
                v-decorator="[
                  'unit',
                  { rules: [{ max: 32, message: '内容未输入或超过字符长度限制',required: isrequired }] }
                ]"
              />
            </a-form-item>
          </a-col>-->
          <a-col :span="8">
            <a-form-item label="技术状况" v-bind="formItemLayout">
              <!-- <a-input
                style="width: 100%"
                placeholder="请输入技术状况"
                v-decorator="[
                  'technical_condition',
                  {
                    rules: [{ max: 32, required: isrequired, message: '内容未输入或超过字符长度限制' }]
                  }
                ]"
              />-->
              <a-select
                style="width: 100%"
                placeholder="请选择技术状况"
                v-decorator="[
                  'technical_condition',
                  {
                    rules: [{ max: 32, required: isrequired, message: '请选择技术状况' }]
                  }
                ]"
              >
                <a-select-option
                  v-for="item in selectDetailData"
                  :key="item.dic_enum_name"
                  :value="item.dic_enum_name"
                >{{ item.dic_enum_name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item read-only label="车牌号" v-bind="formItemLayout">
              <!-- { rules: [{ max: 32, message: '内容未输入或超过字符长度限制' ,required: isrequired }] } -->
              <a-input
                placeholder="请输入车牌号"
                v-decorator="[
                  'car_num',
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" v-if="leaseVisible">
            <a-form-item read-only label="租赁单价" v-bind="formItemLayout">
              <a-input-number
                placeholder="请输入租赁单价"
                :max="999999999999999.99"
                :min="0"
                :step="0.01"
                style="width:100%"
                v-decorator="[
                  'lease_price',
                  { rules: [{ message: '内容未输入或超过字符长度限制' ,required: isrequired }] }
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item read-only label="设备编码" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动带入"
                style="width:100%"
                v-decorator="[
                  'equip_code'
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item read-only label="单位" v-bind="formItemLayout">
              <a-input
                disabled
                placeholder="自动带入"
                style="width:100%"
                v-decorator="[
                  'unit',
                  { rules: [{ max: 32, message: '内容未输入或超过字符长度限制' ,required: isrequired }] }
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
              <!-- {
                    rules: [{ max: 1024, message: '内容未输入或超过字符长度限制', required: isrequired }],
              }-->
              <a-textarea
                placeholder="请输入备注, 1000字以内"
                v-decorator="[
                  'remark',
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- WBS -->
    <wbs-modal ref="wbsModal" @ok="handleWbs" />

    <equ-modal ref="equModal" @ok="handleEqu" />

    <!-- 合同名称树形 -->
    <div>
      <a-modal
        title="请选择"
        v-model="visible"
        width="100%"
        @ok="handleOk(selectedRowKeys)"
        @cancel="handleCancel"
      >
        <a-row :gutter="8">
          <a-col :span="6">
            <a-input-search v-model="dicValue" placeholder="请输入要查询的名称" @search="valueChange" />
            <ZTree
              class="z-tree"
              :setting="setting"
              :nodes="dicTree"
              @onClick="onClick"
              @onCheck="onCheck"
              @onCreated="handleCreated"
            />
          </a-col>
          <a-col :span="18">
            <s-table
              class="s-table"
              ref="Atables"
              size="small"
              rowKey="id"
              bordered
              :customRow="dbClick"
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
                  :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date' ? 15 : 0}px`"
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

    <!-- 设备来源 -->
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible_name"
      width="100%"
      @ok="handleName(selectedRowKeys)"
    >
      <a-table
        v-if="this.value === '调拨单号'"
        class="Etable"
        ref="tables"
        size="small"
        rowKey="id"
        @change="change"
        :customRow="dbClick"
        bordered
        :columns="contract_data"
        :dataSource="tableData"
        :loading="tableLoading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
        :pagination="pagination"
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
            :maxlength="128"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleNameSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date' ? 15 : 0}px`"
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
        >{{ index + 1 + (pagination.current - 1) * pagination.pageSize }}</span>
        <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
      </a-table>
      <s-table
        v-else
        class="s-table"
        ref="tables"
        size="small"
        :customRow="dbClick"
        rowKey="id"
        bordered
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
            @click="() => handleNameSearch(selectedKeys, confirm, column.dataIndex)"
            icon="search"
            size="small"
            :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date' ? 15 : 0}px`"
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
      <a-modal title="请选择" v-model="visible_true" width="100%" @ok="handleNameOk(selectedRowKeys)">
        <a-row :gutter="8">
          <a-col :span="6">
            <a-input-search placeholder="请输入要查询的名称" @search="nameChange" />
            <ZTree
              class="z-tree"
              :setting="name_setting"
              :nodes="name_dicTree"
              @onClick="onNameClick"
              @onCreated="handleNameCreated"
            />
          </a-col>
          <a-col :span="18">
            <s-table
              class="s-table"
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
                  :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date' ? 15 : 0}px`"
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
        >
          <template v-for="(col) in acceptFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              :maxlength="1024"
              v-if="record.editable && inputFields.includes(col)"
              placeholder="评价说明"
              style="margin: -5px 0"
              :value="text"
              @change="e => accept_handleChange(e.target.value, record.key, col)"
            />
            <a-radio-group
              :key="col"
              :options="options"
              v-if="radioFields.includes(col)"
              :value="text"
              @change="e => accept_handleChange(e.target.value, record.key, col)"
            >
              <a-radio
                v-for="item in queryLevel"
                :key="item.dic_enum_id"
                :value="item.dic_enum_name"
              >{{ item.dic_enum_name }}</a-radio>
            </a-radio-group>
          </template>
        </a-table>
        <div v-if="acceptData.length > 0">
          <a-table
            :columns="acceptColumnsSum"
            :dataSource="sumData"
            :pagination="false"
            :loading="memberLoading"
            :showHeader="false"
            rowKey="all_total"
          >
            <template v-for="(col, i) in sumFields " :slot="col" slot-scope="text, record">
              <a-input
                :key="col"
                :maxlength="1024"
                v-if="record.editable && inputFields.includes(col)"
                style="margin: -5px 0"
                :value="text"
                placeholder="结论描述"
                @change="e => sum_handleChange(e.target.value, record.key, col)"
              />
              <a-radio-group
                :key="col"
                v-if="record.editable && radioFields.includes(col)"
                :options="options"
                :value="text"
                @change="e => sum_handleChange(e.target.value, record.key, col)"
              />
            </template>
          </a-table>
        </div>
      </div>
      <!-- 人员证件 -->
      <div class="name" v-if="activeTabKey === 'name'">
        <a-table
          :columns="columns"
          :dataSource="nameData"
          :pagination="false"
          :loading="memberLoading"
          rowKey="key"
          :scroll="{ x: 1700 }"
          bordered
        >
          <template v-for="(col, i) in nameFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              :maxlength="128"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              v-if="record.editable && input_nameFields.includes(col)"
              @change="e => name_handleChange(e.target.value, record.key, col)"
            />
            <a-date-picker
              :key="col"
              :value="text"
              v-else-if="record.editable && datePickerFields.includes(col)"
              @change="value => name_handleChange(value, record.key, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && select_nameFields.includes(col)"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="value => name_handleChange(value, record.key, col)"
            >
              <a-select-option
                v-for="item in select_nameData[col]"
                :key="item.value"
                :value="item.value"
              >{{ item.title }}</a-select-option>
            </a-select>
            <template
              v-else
            >{{ select_nameFields.includes(col) ? (select_nameData[col].filter(c => c.value === text))[0].title : text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <!-- <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />-->
                <a-popconfirm title="是否要删除此行？" @confirm="remove_name(record.key)">
                  <a title="删除">
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
              <a-popconfirm title="是否要删除此行？" @confirm="remove_name(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="newnameDevice"
        >新增人员证件</a-button>
      </div>
      <!-- 设备证件 -->
      <div class="equipment" v-if="activeTabKey === 'equipment'">
        <a-table
          :columns="columns_equip"
          :dataSource="equipData"
          :pagination="false"
          :loading="memberLoading"
          rowKey="key"
          :scroll="{ x: 1700 }"
          bordered
        >
          <template v-for="(col, i) in equipFields" :slot="col" slot-scope="text, record">
            <a-input
              :key="col"
              :maxlength="128"
              v-if="record.editable && input_equipFields.includes(col)"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns_equip[i].title"
              @change="e => equip_handleChange(e.target.value, record.key, col)"
            />
            <a-date-picker
              :key="col"
              :value="text"
              v-else-if="record.editable && datePicker_equipFields.includes(col)"
              @change="value => equip_handleChange(value, record.key, col)"
            />
            <a-select
              :key="col"
              v-else-if="record.editable && select_equipFields.includes(col)"
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns_equip[i].title"
              @change="value => equip_handleChange(value, record.key, col)"
            >
              <a-select-option
                v-for="item in select_equipData[col]"
                :key="item.value"
                :value="item.value"
              >{{ item.title }}</a-select-option>
            </a-select>
            <a-input-number
              :key="col"
              :value="text"
              :max="999999999"
              :min="0"
              :step="1"
              :defaultValue="1"
              v-else-if="record.editable && number_equipFields.includes(col)"
              @change="value => equip_handleChange(value, record.key, col)"
            />
            <template
              v-else
            >{{ select_equipFields.includes(col) ? (select_equipData[col].filter(c => c.value === text))[0].title : text }}</template>
          </template>
          <template slot="operation" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <!-- <a @click="saveRow(record)">添加</a>
                <a-divider type="vertical" />-->
                <a-popconfirm title="是否要删除此行？" @confirm="remove_equip(record.key)">
                  <a title="删除">
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
              <a-popconfirm title="是否要删除此行？" @confirm="remove_equip(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="equipDevice"
        >新增设备证件</a-button>
      </div>
      <!-- 资质附件 -->
      <div class="attachment" v-if="activeTabKey === 'attach'">
        <a-upload-dragger
          :headers="{businessToken:$store.state.user.token}"
          :action="uploadUrl"
          :multiple="true"
          :showUploadList="false"
          :fileList="fileList"
          @change="fileChange"
          :data="{model:'B001', type: 0, menu_id: 33}"
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
      <!-- <div
        class="approval"
        v-if="activeTabKey === 'approval'"
        >
        <a-table
          :columns="approvalColumns"
          :dataSource="[]"
          :pagination="false"
        />
        <br />
        <a-card
          :bordered="false"
          title="工作流进度"
        >
          <a-steps
            :direction="isMobile() && 'vertical' || 'horizontal'"
            :current="2"
            progressDot
          >
            <a-step title="开始">
            </a-step>
            <a-step title="部门初审">
            </a-step>
            <a-step title="财务复核">
            </a-step>
            <a-step title="完成">
            </a-step>
          </a-steps>
        </a-card>
      </div>-->
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
        @click="saveOrSubmit('save')"
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
import moment from 'moment'
import pick from 'lodash.pick'
import STree from '@/components/Tree/Tree'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import {
  handlePurchase,
  submitRequire,
  queryone,
  getQueryCheckItem,
  queryTransfer,
  getQueryProjectName
} from '@/api/equipmentMobilization/siteAccept'
import {
  uploadUrl,
  modules,
  model,
  getAttachments,
  downloadAttachment,
  delAttachment,
  formStatus,
  queryByEquipment,
  queryAllEquipment,
  queryAllContract,
  queryAllName,
  queryByName
} from '@/api/equipmentMobilization/upload'
import { getDictionaryTree, getDictionaryEnum } from '@/api/queryTree'
import { mapGetters } from 'vuex'
import { STable, ZTree } from '@/components'
import { queryDictionaries } from '@/api/dictionary'
import equModal from '@/views/equipmentMobilization/modules/equ'
import wbsModal from '@/views/equipmentMobilization/modules/wbs'
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

// const selectDetailData = {}

const options = [
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
  }
]
const select_nameData = {
  employ: [
    {
      title: '是',
      value: '是'
    },
    {
      title: '否',
      value: '否'
    }
  ],
  state: [
    {
      title: '启用',
      value: '启用'
    },
    {
      title: '禁用',
      value: '禁用'
    }
  ]
}
const select_equipData = {
  interval_unit: [
    {
      title: '年',
      value: '年'
    },
    {
      title: '月',
      value: '月'
    },
    {
      title: '日',
      value: '日'
    }
  ],
  employ: [
    {
      title: '是',
      value: '是'
    },
    {
      title: '否',
      value: '否'
    }
  ]
}
export default {
  name: 'TableEdit',
  mixins: [mixin, mixinDevice],
  components: {
    STable,
    STree,
    ZTree,
    equModal,
    wbsModal,
    // tree: resolve => require(['@/components/zTree/zTree.vue'], resolve),
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
      startDate: '',
      endDate: '',
      selectDetailData: [],
      use_org_code: '',
      accept_from_code: '',
      tableData: [],
      tableLoading: false,
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
        }
      ],
      sizeable: true,
      customFilterColumn: {},
      isrequired: true,
      visible: false,
      visible_name: false,
      visible_true: false,
      value_name: false,
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      // options: {
      //   alert: {
      //     show: false,
      //     clear: () => {
      //       this.selectedRowKeys = []
      //     }
      //   },
      //   rowSelection: {
      //     selectedRowKeys: this.selectedRowKeys,
      //     onChange: this.onSelectChange
      //   }
      // },
      value: '调拨单号',
      leaseVisible: false,
      number: '',
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
      dicValue: '',
      acceptData_content: [],
      projectName: [],
      queryLevel: [],
      inputFields: ['remark', 'check_remark'],
      radioFields: ['result'],

      pagination: {
        total: 1,
        current: 1,
        pageNum: 1,
        showTotal: total =>
          `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(total / this.pagination.pageSize)} 页`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10
      },
      datePicker_equipFields: ['check_expire_date1', 'insurance_expire_date1'],
      input_equipFields: ['cetificate_name', 'cetificate_no', 'check_org_name'],
      select_equipData: select_equipData,
      select_equipFields: ['interval_unit', 'employ'],
      number_equipFields: ['check_interval'],

      datePickerFields: ['certificate_expire_on1'],
      input_nameFields: ['operator_name', 'identity_no', 'telephone', 'certificate_name', 'certificate_no'],
      select_nameData: select_nameData,
      select_nameFields: ['employ', 'state'],
      // queryType:[],
      // querySource:[],
      options: options,
      serial_number: '',
      activeTabKey: 'accept',
      fileList: [],
      selectData: {},
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
      aform: this.$form.createForm(this),
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
      acceptData: [],
      acceptColumns: [
        {
          title: '序号',
          dataIndex: 'code',
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
          width: '400px',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' }
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
      sumFields: ['code2', 'all_total', 'result', 'check_item1', 'check_remark'],
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
          width: '400px',
          dataIndex: 'check_remark',
          key: 'check_remark',
          scopedSlots: { customRender: 'check_remark' }
        }
      ],
      acceptFields: ['code', 'check_item', 'result', 'remark'],
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
          scopedSlots: { customRender: 'operator_name' },
          type: 'input'
        },
        {
          title: '身份证号码',
          dataIndex: 'identity_no',
          key: 'identity_no',
          scopedSlots: { customRender: 'identity_no' },
          type: 'input'
        },
        {
          title: '联系电话',
          dataIndex: 'telephone',
          key: 'telephone',
          scopedSlots: { customRender: 'telephone' },
          type: 'input'
        },
        {
          title: '操作证名称',
          dataIndex: 'certificate_name',
          key: 'certificate_name',
          scopedSlots: { customRender: 'certificate_name' },
          type: 'input'
        },
        {
          title: '操作证编号',
          dataIndex: 'certificate_no',
          key: 'certificate_no',
          scopedSlots: { customRender: 'certificate_no' },
          type: 'input'
        },
        {
          title: '操作证到期日期',
          dataIndex: 'certificate_expire_on1',
          key: 'certificate_expire_on1',
          scopedSlots: { customRender: 'certificate_expire_on1' },
          type: 'date'
          // width:'150px'
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          scopedSlots: { customRender: 'state' },
          type: 'select'
        },
        {
          title: '是否默认使用',
          dataIndex: 'employ',
          key: 'employ',
          scopedSlots: { customRender: 'employ' },
          type: 'seelct'
        },
        {
          title: '操作',
          key: 'action',
          width: '80px',
          scopedSlots: { customRender: 'operation' }
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
        'certificate_expire_on1',
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
          dataIndex: 'check_expire_date1',
          key: 'check_expire_date1',
          scopedSlots: { customRender: 'check_expire_date1' }
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
          dataIndex: 'insurance_expire_date1',
          key: 'insurance_expire_date1',
          scopedSlots: { customRender: 'insurance_expire_date1' }
        },
        {
          title: '是否默认使用',
          dataIndex: 'employ',
          key: 'employ',
          scopedSlots: { customRender: 'employ' }
        },
        {
          title: '操作',
          key: 'action',
          width: '80px',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      equipData: [],
      equipFields: [
        'equip_code',
        'cetificate_name',
        'cetificate_no',
        'check_expire_date1',
        'check_org_name',
        'check_interval',
        'interval_unit',
        'insurance_expire_date1',
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
      queryParam: {},
      personParam: {},
      contractParam: {},

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
        if (!this.queryParam.equipment_code) {
          this.queryParam = {
            equipment_code: '0'
          }
        }
        return queryByEquipment(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          this.currentSize = res.responsePageInfo.pageSize
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
      // 合同数据
      loadTable: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryAllContract(Object.assign(parameter, this.contractParam, { menu_id: 33 })).then(res => {
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
      // 验收人
      name_Data: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return queryByName(Object.assign(parameter, this.personParam, { menu_id: 33 })).then(res => {
          // 索引
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
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
      equipment_category_code: '',
      nameTree: ''
    }
  },
  created () { },
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
          dataIndex: 'equipment_name',
          minWidth: '180px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equipment_name'
          },
          onFilter: (value, record) => record.equipment_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '单位',
          dataIndex: 'unit_name',
          minWidth: '180px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'unit_name'
          },
          onFilter: (value, record) => record.unit_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
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
          minWidth: '180px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'material_model'
          },
          onFilter: (value, record) => record.material_model.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
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
          minWidth: '180px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'code'
          },
          onFilter: (value, record) => record.code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
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

      if (this.value === '调拨单号') {
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
            title: '管理号码',
            dataIndex: 'equipment_management_code',
            scopedSlots: {
              customRender: 'equipment_management_code'
            }
          },
          {
            title: '调拨单号',
            dataIndex: 'transfer_code',
            width: '200px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '原值',
            dataIndex: 'original_value',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '净值',
            dataIndex: 'net_value',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '出厂日期',
            dataIndex: 'production_date',
            width: '200px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '规格型号',
            dataIndex: 'model',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '车牌号',
            dataIndex: 'plate_number',
            width: '150px',
            scopedSlots: {
              customRender: 'plate_number'
            }
          },
          {
            title: '功率',
            dataIndex: 'power',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '生产厂家',
            dataIndex: 'manufacturer',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          }
        ]
      } else {
        return [
          {
            title: '序号',
            width: '70px',
            align: 'center',
            scopedSlots: { customRender: 'serial' }
          },
          // {
          //   title: '设备名称',
          //   dataIndex: 'equipment_name',
          //   scopedSlots: {
          //     customRender: 'equipment_name'
          //   }
          // },
          {
            title: '合同名称',
            dataIndex: 'contract_name',
            scopedSlots: {
              customRender: 'contract_name'
            }
          },
          {
            title: '合同号',
            dataIndex: 'contract_code',
            width: '200px',
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
            title: '原值',
            dataIndex: 'original_value',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '被验收单位',
            dataIndex: 'supplier_name',
            width: '150px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '进场日期',
            dataIndex: 'in_date',
            width: '200px',
            scopedSlots: {
              customRender: 'customRender'
            }
          },
          {
            title: '退场日期',
            dataIndex: 'out_date',
            width: '00px',
            scopedSlots: {
              customRender: 'customRender'
            }
          }
        ]
      }
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
    mod () {
      return modules.siteAccept
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
      if (this.$route.params.type === 1) {
        this.resetForm()
        // getQueryProjectName().then(res => {
        //   this.projectName = res.responseList
        // })
      }
      if (from.path === '/equipmentMobilization/siteAcceptList') {
        this.isrequired = true
        this.$nextTick(() => {
          this.loadEditInfo(this.recording)
        })
      }
    }
  },
  mounted () {
    this.isrequired = true
    // getQueryProjectName().then(res => {
    //   this.projectName = res.responseList
    // })
    this.$nextTick(() => {
      this.loadEditInfo(this.recording)
    })

  },
  methods: {
    ...mapGetters(['nickname']),

    startChange (date, dateString) {
      this.startDate = dateString
      if (this.endDate) {
        if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
          this.startDate = this.endDate
          this.noSelect('进场时间不能晚于退场时间！')
          setTimeout(() => {
            this.form.setFieldsValue({
              // in_date: moment(this.endDate)
              in_date: null
            })
          }, 0);
        }
      }
    },
    endChange (date, dateString) {
      this.endDate = dateString
      if (this.startDate) {
        if (new Date(this.endDate).getTime() < new Date(this.startDate).getTime()) {
          this.endDate = this.startDate
          this.noSelect('退场时间不能早于进场时间！')
          setTimeout(() => {
            this.form.setFieldsValue({
              // out_date: moment(this.endDate)
              out_date: null
            })
          }, 0);
        }
      }
    },

    handleEqu (record) {
      this.selectedRows[0] = record
      this.handleOk()
    },

    handleWbs (record) {
      this.form.setFieldsValue({
        use_site: record
      })
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

    // useClick () {
    //   getQueryProjectName().then(res => {
    //     this.projectName = res.responseList
    //   })
    // },

    // 重置页面数据
    resetForm () {
      this.form.resetFields()
      this.detailData = []
      this.fileList = []
      this.selectedRowKeys = []
      this.selectedRows = []
      this.acceptData_content = []
      this.projectName = []
      this.queryLevel = []
      this.selectData = {}
      this.queryList = []
      this.acceptData = []
      this.nameData = []
      this.equipData = []
      this.queryParam = {}
      this.personParam = {}
      this.contractParam = {}
      this.queryName = {}
      this.name_dicTree = []
      this.dicTree = []
      this.tableData = []
      this.activeTabKey = 'accept'
    },

    change (pagination, filters, sorter) {
      this.pagination = pagination
      if (filters !== {}) {
        for (let key in filters) {
          if (filters[key] instanceof Array) {
            filters[key] = filters[key][0]
          }
        }
        this.queryParam = Object.assign(this.queryParam, filters)
        this.getTableData()
      }
    },

    getTableData () {
      this.tableLoading = true
      queryTransfer(Object.assign({ pageSize: 13, pageNum: 1 }, { menu_id: 33, org_in_code: this.$store.state.menu_key }, this.queryParam)).then(res => {
        this.tableData = res.responseList.map((x, i) => {
          x.code = i + 1
          return x
        })
        this.tableLoading = false
        this.pagination.total = res.responseList.length
      })
    },

    showTable () {
      this.visible_name = true
      if (this.value === '调拨单号') {
        this.tableData = []
        this.getTableData()
      } else {
        this.$refs.tables && this.refresh('tables')
      }
    },
    handleName (val) {
      if (!this.selectedRows.length) return this.noSelect()
      this.use_org_code = ''
      this.accept_from_code = ''
      this.visible_name = false
      const arr = this.selectedRows
      this.equipment_category_code = arr[0].equipment_category_code
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      if (this.selectedRows.length > 1) return this.noSelect()
      if (this.value === '调拨单号') {
        // 验收项目动态加载
        getQueryCheckItem({
          menu_id: 33,
          equip_name: arr[0].equipment_name,
          equipment_category_code: arr[0].equipment_category_code
        }).then(res => {
          if (res.status === '0') this.acceptData = res.responseList.map((d, i) => {
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
        this.use_org_code = arr[0]['org_use_code']
        this.accept_from_code = arr[0]['creator_org_code']
        console.log(this.accept_from_code, '11122121211212', arr)
        this.form.setFieldsValue({
          purchase_date: arr[0]['request_date'] ? moment(arr[0]['request_date']) : null,
          use_org: arr[0]['org_use'],
          location: arr[0]['work_place'],
          equip_name: arr[0]['equipment_name'],
          accept_from: arr[0]['creator_org_name'],
          acceptance_from_person: arr[0]['operator_in_user_name'],
          specification: arr[0]['model'],
          requisition: arr[0]['transfer_code'],
          manage_code: arr[0]['equipment_management_code'],
          power: arr[0]['power'],
          manufacturer: arr[0]['manufacturer'],
          production_time: arr[0]['production_date'] ? moment(arr[0]['production_date']) : null,
          original_value: arr[0]['original_value'],
          net_value: arr[0]['net_value'],
          car_num: arr[0]['plate_number'],
          equip_code: arr[0]['equipment_code'],
          unit: arr[0]['unit']
        })
      } else {
        this.accept_from_code = arr[0]['supplier_code']
        console.log(this.use_org_code, '33333333')
        this.form.setFieldsValue({
          requisition: arr[0].contract_code,
          equip_code: arr[0].equipment_code,
          accept_from: arr[0].accept_from,
          original_value: arr[0].original_value,
          acceptance_from_person: arr[0].acceptance_from_person,
          accept_from: arr[0].supplier_name,
          in_date: arr[0].in_date ? moment(arr[0].in_date) : null,
          out_date: arr[0].out_date ? moment(arr[0].out_date) : null
        })
      }
    },
    // hr树
    showName () {
      this.visible_true = true
      queryAllName().then(res => (this.name_dicTree = [res.responseObject]))
      this.personParam = {}
    },
    nameChange (e) {
      queryAllName({ name: e }).then(res => (this.name_dicTree = res.responseList))
    },
    onNameClick: function (evt, treeId, treeNode) {
      // 点击事件
      this.personParam = {
        id: treeNode.id,
        type: treeNode.type
      }
      this.$refs.tables.refresh(true)
    },
    handleNameCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleNameOk (val) {
      if (val.length === 0) return this.noSelect()
      this.visible_true = false
      const arr = this.hrData.responsePageInfo.list.filter(item => item.id === val[0])
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      this.form.setFieldsValue({
        accept_to_person: arr[0].name
      })
    },
    // 合同树
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    valueChange (e) {
      this.dicValue = e
      queryAllEquipment({ e_name: this.dicValue }).then(res => (this.dicTree = res.responseList))
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件
      this.queryParam = {
        equipment_code: treeNode.equipment_code
      }
      this.$refs.Atables.refresh(true)
    },
    onCheck: function (evt, treeId, treeNode) {
      // 选中事件
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    update: function () {
      // 更新示例数据
      this.showIndex = this.showIndex === 0 ? 1 : 0
    },
    handleTitleClick (item) {
    },
    titleClick (e) {
    },
    handleSaveClose () { },
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
    handleCancel () {
      this.visible = false
      this.dicValue = ''
    },
    handleOk () {
      if (!this.selectedRows.length) return this.noSelect()
      const arr = this.selectedRows
      this.selectedRowKeys = []
      this.selectedRows = []
      if (!arr.length) return
      this.form.setFieldsValue({
        equip_name: arr[0].equipmentName,
        specification: arr[0].specificationModel,
        equip_code: arr[0].equipmentCode,
        unit: arr[0].calculateUnit
      })
      this.equipment_category_code = arr[0].equipment_category_code
      // 验收项目动态加载
      getQueryCheckItem({
        menu_id: 33,
        equip_code: arr[0].equipmentCode,
        // equipment_category_code: arr[0].equipment_category_code
      }).then(res => {
        if (res.status === '0') this.acceptData = res.responseList.map((d, i) => {
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
      // this.visible = true
      this.$refs.equModal.add()
      // getAllEquip().then(res => (this.equipList = res.responseList))
      // this.queryParam = {
      //   equipment_code: '0'
      // }
      // queryAllEquipment().then(res => (this.dicTree = res.responseList))
      // this.$refs.Atables && this.refresh('Atables')
    },
    handleRequisition (value) {
      if (!value) return this.value = '调拨单号'
      // 变更名称
      this.leaseVisible = false
      if (value === '租赁设备' || value === '分包商设备') {
        this.value = '合同号'
        this.value_name = true
        this.form.setFieldsValue({
          equip_name: '',
          accept_from: '',
          acceptance_from_person: '',
          specification: '',
          requisition: '',
          manage_code: '',
          power: '',
          manufacturer: '',
          production_time: null,
          original_value: '',
          net_value: '',
          car_num: '',
          in_date: null,
          out_date: null
        })
        this.acceptData = []
        this.equipData = []
        this.nameData = []
      }
      if (value === '租赁设备') {
        this.leaseVisible = true
      }
      if (value === '自有设备') {
        this.value = '调拨单号'
        this.form.setFieldsValue({
          equip_name: '',
          accept_from: '',
          acceptance_from_person: '',
          specification: '',
          requisition: '',
          manage_code: '',
          power: '',
          manufacturer: '',
          production_time: null,
          original_value: '',
          net_value: '',
          car_num: '',
          in_date: null,
          out_date: null
        })
        this.value_name = false
        this.acceptData = []
        this.equipData = []
        this.nameData = []
      }
    },
    handleGoBack () {
      this.resetForm()
      this.$root.$emit('global::evt.multitabClose', this.$router.currentRoute.fullPath)
      this.$router.push('siteAcceptList')
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    loadEditInfo (data) {
      const { form } = this
      queryDictionaries({ dic_type_id: 1029 }).then(res => {
        this.selectDetailData = res.responseList
      })
      queryDictionaries({ dic_type_id: 1012 }).then(res => {
        this.options = res.responseList.map(x => {
          x.label = x.dic_enum_name
          x.value = x.dic_enum_name
          return x
        })
      })
      if (data.id) {
        queryone({ id: data.id }).then(res => {
          this.accept_from_code = res.responseObject.accept_from_code
          this.handleRequisition(res.responseObject.equip_source)
          this.number = true
          this.serial_number = res.responseObject.serial_number
          this.sumData[0]['result'] = res.responseObject.result
          this.sumData[0]['check_remark'] = res.responseObject.check_remark
          this.acceptData = res.responseObject.detail.map((d, i) => {
            d.result = d.result
            d.editable = true
            d.isNew = true
            d.key = d.id + ''
            d.code = i + 1
            return d
          })
          this.nameData = res.responseObject.detail1.map((d, i) => {
            d.certificate_expire_on1 = moment(d.certificate_expire_on)
            d.editable = true
            d.isNew = true
            d.name_code = i + 1
            d.key = d.id + ''
            return d
          })
          this.equipData = res.responseObject.detail2.map((d, i) => {
            d.check_expire_date1 = moment(d.check_expire_date)
            d.insurance_expire_date1 = moment(d.insurance_expire_date)
            d.editable = true
            d.isNew = true
            d.equip_code = i + 1
            d.key = d.id + ''
            return d
          })
        })
        getAttachments({ id_in_module: data.id, module: modules.siteAccept }).then(res => {
          this.fileList = res.responseList.map(attachment => {
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
        })
        this.nameData = this.nameData.map((item, index) => {
          item.code = index
          return item
        })
        this.equipData = this.equipData.map((item, index) => {
          item.code = index
          return item
        })
        const formData = pick(data, [
          'accept_to_person',
          'check_remark',
          'result',
          'serial_number',
          'pro_unit',
          'creator_user_name',
          'create_date',
          'equip_type',
          'equip_source',
          'equip_name',
          'specification',
          'requisition',
          'manage_code',
          'power',
          'manufacturer',
          'production_time',
          'original_value',
          'net_value',
          'in_date',
          'out_date',
          'accept_from',
          'acceptance_from_person',
          'use_site',
          'accept_to',
          'accept_date',
          'remark'
        ])
        formData.create_date = data.create_date == null ? delete data.create_date : moment(data.create_date)
        // formData.in_date = (data.in_date == null  ? delete data.in_date: moment(data.in_date ))
        // formData.out_date = (data.out_date == null  ? delete data.out_date: moment(data.out_date ))
        // formData.production_time = (data.production_time == null  ? delete data.production_time: moment(data.production_time ))
        // formData.accept_date = (data.accept_date == null  ? delete data.accept_date: moment(data.accept_date ))
        formData.in_date = moment(data.in_date == null ? {} : data.in_date)
        formData.out_date = moment(data.out_date == null ? {} : data.out_date)
        formData.production_time = moment(data.production_time == null ? {} : data.production_time)
        formData.accept_date = moment(data.accept_date == null ? {} : data.accept_date)
        form.setFieldsValue(formData)
      }
    },
    newnameDevice () {
      const length = this.nameData.length
      if (length && !this.nameData[length - 1].operator_name) return this.noSelect('请填完上一条数据')

      this.nameData.push({
        key: length === 0 ? '1' : (parseInt(this.nameData[length - 1].key) + 1).toString(),
        name_code: length + 1,
        operator_name: '',
        identity_no: '',
        telephone: '',
        certificate_name: '',
        certificate_no: '',
        employ: '是',
        state: '启用',
        certificate_expire_on1: null,
        editable: true,
        isNew: true
      })
    },
    equipDevice () {
      const length = this.equipData.length
      if (length && !this.equipData[length - 1].cetificate_name) return this.noSelect('请填完上一条数据')
      this.equipData.push({
        key: length === 0 ? '1' : (parseInt(this.equipData[length - 1].key) + 1).toString(),
        equip_code: length + 1,
        cetificate_name: '',
        cetificate_no: '',
        check_org_name: '',
        check_interval: '0',
        check_expire_date1: null,
        check_org_name: '',
        interval_unit: '年',
        employ: '是',
        insurance_expire_date1: null,
        editable: true,
        isNew: true
      })
    },
    remove_name (key) {
      const newnameData = this.nameData.filter(item => item.key !== key)
      this.nameData = newnameData
    },
    remove_equip (key) {
      const newequipData = this.equipData.filter(item => item.key !== key)
      this.equipData = newequipData
    },
    toggle (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancel (key) {
      const target = this.data.filter(item => item.key === key)[0]
      target.editable = false
    },
    accept_handleChange (value, key, column) {
      const newData = [...this.acceptData]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value

        this.acceptData = newData
      }
    },
    sum_handleChange (value, key, column) {
      const newsumData = [...this.sumData]
      const target_sum = newsumData.filter(item => key === item.key)[0]
      if (target_sum) {
        target_sum[column] = value
        this.sumData = newsumData
      }
    },
    name_handleChange (value, key, column) {
      const newnameData = [...this.nameData]
      const target_name = newnameData.filter(item => key === item.key)[0]
      if (target_name) {
        target_name[column] = value
        this.nameData = newnameData
      }
    },
    equip_handleChange (value, key, column) {
      const newequipData = [...this.equipData]
      const target_equip = newequipData.filter(item => key === item.key)[0]
      if (target_equip) {
        target_equip[column] = value
        this.equipData = newequipData
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
    // 附件删除
    removeAttachment (record) {
      delAttachment({
        menu_id: 33,
        type: 0,
        filePath: record.file_path,
        fileName: record.file_name
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

    checkdata (arr, column, flag) {
      if (arr.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '提交时明细不能为空'
        })
        return
      }
      let colname = ''
      arr.forEach((d, i) => {
        if (d.code !== '合计') {
          for (var key in d) {
            if (!d[key] && d[key] !== 0) {
              if (key != 'remark') {
                column.map(item => {
                  if (item.dataIndex == key) colname = item.title
                })
                this.$notification['error']({
                  message: '提示',
                  description: `提交时第${d.code}行：${colname}不能为空`
                })
                flag = true
                return
              }
            }
          }
        }
      })
    },

    // 最终全页面提交
    saveOrSubmit (type) {
      const {
        form: { validateFields }
      } = this
      const that = this
      if (type === 'save') {
        this.isrequired = false
      } else {
        // let flag = false
        // this.checkdata(this.acceptData, this.acceptColumns, flag)
        // this.checkdata(this.nameData, this.columns, flag)
        // this.checkdata(this.equipData, this.columns_equip, flag)
        // if (flag) return
      }
      setTimeout(() => {
        validateFields((err, values) => {
          values.accept_from_code = that.accept_from_code
          values.use_org_code = that.use_org_code
          values.details = that.acceptData
          values.details1 = that.nameData
          values.details2 = that.equipData
          values.files = that.fileList
          values.result = that.sumData[0].result
          values.check_remark = that.sumData[0].check_remark

          if (that.recording) {
            values.creator_org_id = that.creator_org_id
            values.id = that.recording.id
            values.remark = that.recording.remark
            values.serial_number = that.recording.serial_number
            values.creator_user_id = that.recording.creator_user_id
            values.creator_org_name = that.recording.creator_org_name
            values.flag = 2
            values.creator_org_id = that.recording.creator_org_id
            values.status = that.recording.status
            values.accept_to_person = that.recording.accept_to_person
          } else {
            values.creator_org_id = that.$store.state.menu_key + ''
            values.creator_org_name = that.$store.state.org_name
            values.pro_unit_code = this.$store.state.pro_unit_code
            values.flag = 1
          }
          values.create_date && (values.create_date = values.create_date.format('YYYY-MM-DD'))
          values.purchase_date && (values.purchase_date = values.purchase_date.format('YYYY-MM-DD'))
          values.production_time && (values.production_time = values.production_time.format('YYYY-MM-DD'))
          values.in_date && (values.in_date = values.in_date.format('YYYY-MM-DD'))
          values.out_date && (values.out_date = values.out_date.format('YYYY-MM-DD'))
          values.accept_date && (values.accept_date = values.accept_date.format('YYYY-MM-DD'))
          values.equipment_category_code = that.equipment_category_code
          values.menu_id = 33
          for (let key in values) {
            const isTrue = values[key] === '' || values[key] == null || values[key] == undefined
            if (isTrue) {
              delete values[key]
            }
          }
          values.details1.forEach(x => {
            x.certificate_expire_on1 && (x.certificate_expire_on = x.certificate_expire_on1.format('YYYY-MM-DD'))
          })
          values.details2.forEach(x => {
            x.check_expire_date1 && (x.check_expire_date = x.check_expire_date1.format('YYYY-MM-DD'))
            x.insurance_expire_date1 && (x.insurance_expire_date = x.insurance_expire_date1.format('YYYY-MM-DD'))
          })
          if (!err) {
            if (type === 'submit') {
              this.$confirm({
                title: '提示',
                content: `确定提交当前表单?`,
                onOk () {
                  that.submitLoading = true
                  // values.details.forEach(x => {
                  //   x.check_item = x.inspect_name + '丨' + x.check_item
                  // })
                  document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
                  return handlePurchase(values, 'submit').then(res => {
                    if (res.status === '0') {
                      that.$notification['success']({
                        message: '提示',
                        description: res.msg
                      })
                      that.handleGoBack() // 返回列表页
                    }
                  }).finally(() => {
                    return that.submitLoading = false
                  })
                },

                onCancel () { }
              })
            }
          }
          if (type === 'save') {
            that.saveLoading = true

            // values.details.forEach(x => {
            //   x.check_item = x.inspect_name + '丨' + x.check_item
            // })

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

    // 表格内过滤函数
    handleNameSearch (selectedKeys, confirm, col) {
      confirm()
      // if (col) this.refresh(true)
    },

    handleNameReset (clearFilters, col) {
      clearFilters()
      // this.queryParam = {}
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
.Etable {
  margin-top: 20px;
}
</style>
