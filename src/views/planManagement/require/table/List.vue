<template>
  <div>
    <!-- 菜单按钮列表 -->
    <div class="table-operator" :style="{ 'margin-bottom': '24px'}">
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay">
            <a-menu-item>
              <a-icon :type="item.icon" />PDF
            </a-menu-item>
            <a-menu-item>
              <a-icon :type="item.icon" />EXCEL
            </a-menu-item>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-dropdown v-else-if="item.title === '打印'">
          <a-menu slot="overlay">
            <a-menu-item key="print-all">
              <a-icon type="printer" />全部
            </a-menu-item>
            <a-menu-item>
              <a-icon type="printer" />已选择
            </a-menu-item>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button
          v-else
          class="menu-button"
          :type="item.type"
          :icon="item.icon"
          @click="item.func"
        >{{ item.title }}</a-button>
      </span>
    </div>
    <br />
    <!-- 设备需求计划数据列表 -->
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      border
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      <!-- 表格搜索 -->
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          v-ant-ref="c => searchInput = c"
          :placeholder="`Search ${column.dataIndex}`"
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
          style="width: 90px; margin-right: 8px"
        >搜索</a-button>
        <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">重置</a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text">
        <span v-if="searchText">
          <template
            v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >{{ fragment }}</mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>{ {text}}</template>
      </template>
    </s-table>
  </div>
</template>
<script>
import { STable, Ellipsis } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      searchText: '', // 表格搜索框
      searchInput: null, // 表格搜索框
      menuBtns: [
        // 导航菜单按钮
        {
          key: 'btn-1',
          icon: 'plus',
          title: '新建',
          type: 'primary',
          func: () => this.handleEdit()
        },
        {
          key: 'btn-2',
          icon: 'form',
          title: '编辑',
          type: 'primary'
          // func: () => this.handleEdit(true)
        },
        {
          key: 'btn-3',
          icon: 'delete',
          title: '删除',
          type: 'primary'
          // func: () => this.remove()
        },
        {
          key: 'btn-4',
          icon: 'check',
          title: '提交',
          type: 'primary'
          // func: () => this.submit()
        },
        {
          key: 'btn-5',
          icon: 'backward',
          title: '取回',
          type: 'primary'
          // func: () => this.cancel()
        },
        {
          key: 'btn-9',
          icon: 'fork',
          title: '审批',
          type: 'primary'
          // func: () => this.handleDetail()
        },
        {
          key: 'btn-6',
          icon: 'export',
          title: '导出',
          type: 'primary'
          // func: () => this.exportTable()
        },
        {
          key: 'btn-7',
          icon: 'printer',
          title: '打印',
          type: 'primary'
          // func: () => this.printTable()
        },
        {
          key: 'btn-8',
          icon: 'sync',
          title: '刷新',
          type: 'primary'
          // func: () => {
          //   this.queryParam = {}
          //   this.range = []
          //   this.refresh(true)
          // }
        }
      ],
      columns: [
        // 表头
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '单据编号',
          dataIndex: 'serial_number',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'serial_number'
          },
          onFilter: (value, record) => record.serial_number.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '编制人',
          dataIndex: 'creator_user_name',
          width: '100px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'creator_user_name'
          },
          onFilter: (value, record) => record.creator_user_name.toLowerCase().includes(value.toLowerCase())
        },
        {
          title: '编制日期',
          dataIndex: 'create_date',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'create_date'
          },
          onFilter: (value, record) => record.create_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.create_date.split('-').join('') - b.create_date.split('-').join('')
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'right',
          width: '120px',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '设备需求数量',
          dataIndex: 'number',
          align: 'right',
          width: '150px',
          scopedSlots: { customRender: 'number' }
          // sorter: (a, b) => a.number.length - b.number.length
        },
        {
          title: '状态',
          dataIndex: 'dic_enum_name',
          width: '120px',
          key: 'status',
          scopedSlots: {
            customRender: 'status'
          },
          filterMultiple: false,
          // filters: formStatusArray,
          // filteredValue: filteredInfo.status || null,
          onFilter: (value, record) => record.status === value
        },
        {
          title: '审批人',
          width: '120px',
          dataIndex: 'check_user_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'approver'
          },
          // onFilter: (value, record) => record.check_user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '审批时间',
          dataIndex: 'check_at',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'check_at'
          },
          onFilter: (value, record) => record.check_at.toLowerCase().includes(value.toLowerCase()),
          sorter: (a, b) => new Date(a.check_at).getTime() - new Date(b.check_at).getTime()
        }
      ],
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return this.$http
          .get('/service', {
            params: Object.assign(parameter, this.queryParam)
          })
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    // 表格交互
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },
    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    }
  }
}
</script>
<style lang="less" scoped>
.table-operator {
  .menu-button {
    margin-right: 5px;
  }
  .search {
    float: right;
  }
}
/deep/ .read-after {
  color: #f55858;
}
</style>
