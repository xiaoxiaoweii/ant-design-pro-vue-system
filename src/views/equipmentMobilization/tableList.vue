<template>
  <div>
    <a-modal
      class="modal-box"
      title="请选择"
      v-model="visible"
      width="100%"
      @ok="handleOk(selectedRowKeys)"
      @cancel="handleCancel"
    >
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        :customRow="dbClick"
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
  </div>
</template>

<script>
import { STable, ZTree } from '@/components'
export default {
  name: '单选弹出框',
  components: {
    STable,
  },
  data () {
    return {
      visible: false,

    }
  },
  methods: {
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
    handleOk (val) {
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


  }
}
</script>

<style scoped>
</style>