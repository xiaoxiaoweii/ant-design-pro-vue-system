<template>
  <a-modal
    title="请选择"
    v-model="visible"
    :width="1200"
    @ok="handleSubmit(selectedRowKeys)"
    @cancel="handleCancel"
  >
    <s-table
      size="small"
      ref="table"
      rowKey="serial"
      bordered
      :columns="column"
      :data="loadData"
      :alert="false"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onChange, type: 'radio' }"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        class="custom-filter-dropdown"
      >
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
          @click="() => handleSearch(selectedKeys, confirm)" 
          icon="search"
          size="small"
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
        >查询</a-button>
        <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">重置</a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
    </s-table>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
export default {
  props: {
    queryEquip: {
      type: Function,
      required: true
    }
  },
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      searchText: '',
      column: [
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
          }
        },
        {
          title: '设备管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          // width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specification'
          }
        },
        {
          title: '合同编号',
          dataIndex: 'requisition',
          // width: '200px',
          scopedSlots: {
            customRender: 'requisition'
          }
        }
      ],
      loadData: parameter => {
        return this.queryEquip({ scope_code: this.$store.state.menu_key || 0, pageNum: 1, pageSize: 13 }).then(res => {
          if (res.responseList) this.acceptanceData = res.responseList.map((rep, index) => {
            rep.key = index + 1
            return rep
          })
          return {
            pageSize: res.responsePageInfo.pageSize,
            pageNo: res.responsePageInfo.pageNum,
            totalPage: res.responsePageInfo.pages,
            totalCount: res.responsePageInfo.total,
            data: res.responsePageInfo.list
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      acceptanceData: []
    }
  },
  methods: {
    add () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    },
    handleSearch (selectedKeys, confirm) {
      confirm();
      this.searchText = selectedKeys[0];
    },

    handleReset (clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    handleSubmit () {
      const record = this.selectedRows[0]
      if (record) record.acceptanceData = this.acceptanceData
      this.$emit('ok', record || null)
      this.$refs.table.clearSelected()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = false
    },
    handleCancel () {
      this.visible = false
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style>
</style>