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
      rowKey="key"
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
import { getEquipMaterial } from '@/api/common'
import { STable } from '@/components'
export default {
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
          title: '材料名称',
          dataIndex: 'name',
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
          // width: '200px',
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
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: {
            customRender: 'unit'
          }
        },
        {
          title: '结存数量',
          dataIndex: 'check_number',
          scopedSlots: {
            customRender: 'check_number'
          }
        }
      ],
      loadData: parameter => {
        return getEquipMaterial(Object.assign({ scope_code: this.$store.state.menu_key || 0, menu_id: this.$route.query.menuCode }, parameter)).then(res => {
          if (res.status === '0')
            return {
              pageSize: res.responsePageInfo.pageSize,
              pageNo: res.responsePageInfo.pageNum,
              totalPage: res.responsePageInfo.pages,
              totalCount: res.responsePageInfo.total,
              data: res.responsePageInfo.list.map((equip, index)=> {
                equip.key = index + 1
                return equip
              })
            }
          else
            return {
              pageSize: parameter.pageSize,
              pageNo: parameter.pageNum,
              totalPage: 0,
              totalCount: 0,
              data: []
            }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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