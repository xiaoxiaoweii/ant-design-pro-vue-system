<template>
  <div>
    <div
      class="table-operator"
      :style="{ 'margin-bottom': advanced ? '24px' : 0 }"
    >

      <!-- 菜单按钮列表 -->
      <span
        v-for="item in menuBtns"
        :key="item.key"
      >
        <a-dropdown v-if="item.title === '导出'">
          <a-menu
            slot="overlay"
            @click="exportTable"
          >
            <a-menu-item key="export-pdf">
              <a-icon :type="item.icon" />PDF</a-menu-item>
            <a-menu-item key="export-excel">
              <a-icon :type="item.icon" />EXCEL</a-menu-item>
          </a-menu>
          <a-button
            class="menu-button"
            :type="item.type"
            :icon="item.icon"
          >
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>

        <a-dropdown v-else-if="item.title === '打印'">
          <a-menu
            slot="overlay"
            @click="printTable"
          >
            <a-menu-item key="print-all">
              <a-icon type="printer" />全部</a-menu-item>
            <a-menu-item key="print-selected">
              <a-icon type="printer" />已选择</a-menu-item>
          </a-menu>
          <a-button
            v-if="item.title === '打印'"
            class="menu-button"
            :type="item.type"
            :icon="item.icon"
          >
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
        >
          {{ item.title }}
        </a-button>
      </span>
      <!-- 搜索布局内容 -->
      <!-- <span class="search">
        <a-input-search
          placeholder="输入编制人"
          style="width: 115px;margin-right:20px"
          @search="onSearch"
        />
        <a-input
          placeholder="编制日期从"
          style="width: 100px"
        />
        ~
        <a-input
          placeholder="编制日期到"
          style="width: 100px;margin-right:20px"
        />
        <a-select
          v-model="queryParam.useStatus"
          placeholder="审批状态"
          default-value="0"
          style="width: 100px;margin-right:20px"
        >
          <a-select-option value="0">未提交</a-select-option>
          <a-select-option value="1">审批中</a-select-option>
          <a-select-option value="2">审批通过</a-select-option>
          <a-select-option value="3">审批不通过</a-select-option>
        </a-select>
        <button >搜索</button> -->
        <!-- <a
        <button >搜索</button>
        <a
          @click="toggleAdvanced"
          style="margin-left: 8px"
        >
          {{ advanced ? '收起' : '高级' }}
          <a-icon :type="advanced ? 'up' : 'down'" />
        </a> -->
      <!-- </span> -->
    </div>
    <br />
    <div class="table-page-search-wrapper">
    </div>

    <!-- 数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
      bordered
    >
      <a slot="serial_number" slot-scope="text" @click="clickEdit(text)" href="javascript:;">{{ text }}</a>
      <!-- 新搜索页面 -->
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}" class="custom-filter-dropdown">
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex==='make_date'||column.dataIndex==='approvalDate'"
          v-model="range "
          @change="onChange"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-input
          v-else
          v-ant-ref="c => searchInput = c"
          :placeholder="`搜索 ${column.title}`"
          :value="selectedKeys[0]"
          @change=" e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm)"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm,column.dataIndex)"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
        >搜索</a-button>
        <a-button
          @click="() => handleReset(clearFilters,column.dataIndex)"
          size="small"
          style="width: 90px"
        >重置</a-button>
      </div>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
      <span
        slot="serial"
        slot-scope="text, record, index"
      >{{ index + 1 + (current - 1) * currentSize }}</span>
      <span
        slot="status"
        slot-scope="text"
      >
        {{ text }}
      </span>
      <!-- <span
        slot="action"
        slot-scope="text, record"
      >
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;">详情</a>
        </template>
      </span> -->
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import { getRoleList } from '@/api/manage'
import { handlePurchase, exportToExcel,exportToPDF ,formStatusArray} from '@/api/computation/account'
const FileSaver = require('file-saver')
const statusMap = {
  0: {
    status: 'default',
    text: '未提交'
  },
  1: {
    status: 'processing',
    text: '未审批'
  },
  2: {
    status: 'success',
    text: '已审批'
  },
  3: {
    status: 'error',
    text: '已归档'
  }
}

export default {
  name: 'TableList',
  components: {
    STable
  },
  computed: {
    fields () {
      const fields = {}

      this.columns.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    },
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return   [
        {
          title: '序号',
          dataIndex:'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '单据编号',
          dataIndex: 'serial_number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'serial_number'
          },
          onFilter: (value, record) => record.serial_number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.serial_number.length - b.serial_number.length
        },
        {
          title: '编制人',
          dataIndex: 'creator_user_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.creator_user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '编制日期',
          dataIndex: 'make_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.make_date,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.make_date.split('-').join('') - b.make_date.split('-').join('')
        }, 
        {
          title: '合计金额',
          dataIndex: 'total_amount'
        },
        {
          title: '其他费用',
          dataIndex: 'total_other_expenses'
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
          filters: formStatusArray,
          filteredValue: filteredInfo.status|| null,
          onFilter: (value, record) => record.status === value
        },
        {
          title: '审批人',
          dataIndex: 'check_user_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.check_user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '审批时间',
          dataIndex: 'approvalDate',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.approvalDate,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.approvalDate.split('-').join('') - b.approvalDate.split('-').join('')

        }
      ]
    }
  },
  data () {
    return {
      title: '单机核算列表',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      range: [],
      customFilterColumn: {},
      formStatusArray: formStatusArray,
      filteredInfo: null,
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadRequire.parameter', parameter)
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        if ([0, '0'].includes(parameter.status)) Reflect.deleteProperty(parameter, 'status')
        if ([0, '0'].includes(this.queryParam.status)) Reflect.deleteProperty(this.queryParam, 'status')

        return handlePurchase(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
           res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
            x.equip_budget_amount = (x.equip_budget_amount == null ? '': x.equip_budget_amount.toFixed(2) ) 
            x.current_actual_cost = (x.current_actual_cost == null ? '': x.current_actual_cost.toFixed(2) ) 
            return x
          })
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
          console.log(res)
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          return res.result || { pageSize: res.responsePageInfo.pageSize, pageNo: res.responsePageInfo.pageNum, totalPage: res.responsePageInfo.pages, totalCount: res.responsePageInfo.total, data: res.responsePageInfo.list }
        })
      },
      current: Number,
      currentSize: Number,
      selectedRowKeys: [],
      selectedRows: [],

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
      menuBtns: [
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
          type: 'primary',
          func: () => this.handleEdit(true)
        },
        {
          key: 'btn-3',
          icon: 'delete',
          title: '删除',
          type: 'primary',
          func: () => this.remove()
        },
        {
          key: 'btn-4',
          icon: 'check',
          title: '提交',
          type: 'primary',
          func: () => this.submit()
        },
        {
          key: 'btn-5',
          icon: 'backward',
          title: '取回',
          type: 'primary',
          func: () => this.cancel()
        },
        {
          key: 'btn-9',
          icon: 'fork',
          title: '审批',
          type: 'primary',
          func: () => this.handleDetail()
        },
        {
          key: 'btn-6',
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.exportTable()
        },
        {
          key: 'btn-7',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.printTable()
        },
        {
          key: 'btn-8',
          icon: 'sync',
          title: '刷新',
          type: 'primary',
          func: () => { this.queryParam = {};this.range = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
        console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      }
    }
  },
  filters: {
    // statusFilter (type) {
    //   // return statusMap[type].text
    // },
    // statusTypeFilter (type) {
    //   // return statusMap[type].status
    // }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  methods: {
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onChange (date, range) {
      this.queryParam.begin_create_date = range[0]
      this.queryParam.end_create_date = range[1]
    },
    clickEdit (text) {
      const arr = this.dataSource.filter(x => x.serial_number === text)
      this.selectedRows[0] = arr[0]
      this.handleRead()
    },
    handleRead () {
      // console.log(aaa)
      this.$emit('onRead', this.selectedRows[0])
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      this.$emit('onDetail', this.selectedRows[0])
    },
    handleSearch (selectedKeys, confirm, col) {
      confirm()
      console.log(selectedKeys)
      if (col) this.refresh(true)
    },
    handleReset (clearFilters, col) {
      clearFilters()
      col === 'create_date' && (this.range = [])
    },
    handleEdit (bool) {
      if (bool) if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect()
      this.$emit('onEdit', bool ? this.selectedRows[0] : null)
    },

    handleOk () { },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },

    onSearch (value) {
      this.queryParam.creator_user_name = value.trim()
      this.refresh(true)
    },
    exportTable (e) {
      if (this.selectedRows.length === 0) return this.noSelect()
      if(e.key === 'export-excel') {
         exportToExcel ({ flag: 0, details:  this.selectedRowKeys })
        .then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.xls`)
        })
      }else {
        exportToPDF ({ flag: 0, details:  this.selectedRowKeys  })
        .then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/pdf' }), `${this.title || 'data'}列表.pdf`)
        })
      }
    },

    printTable (e) {
      const key = e.key
      const properties = this.columns.filter(col => col.title !== '序号').map(col => {
        return {
          field: col.dataIndex || '',
          displayName: col.title
        }
      })

      print({
        printable: key === 'print-all' ? this.dataSource : this.selectedRows,
        properties: properties,
        type: 'json',
        header: `<h3 class="custom-h3">${this.title || 'data'}</h3>`,
        documentTitle: '设备业务管理系统'
      })
    },

    remove () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const selectedRowKeys = this.selectedRowKeys
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定删除已选择的记录?',
        okType: 'danger',
        onOk () {
          return handlePurchase({ details: selectedRowKeys }, 'delete').then(res => res.status === '0' && that.refresh(true))
        },
        onCancel () { }
      })
    },

    submit () {
      if (this.selectedRows.length === 0) return this.noSelect()
      // const selectedRows = this.selectedRows
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定提交已选择的记录?',
        onOk () {
          // console.log(that.selectedRowKeys)
          return handlePurchase({ ids: that.selectedRowKeys, flag: 0 }, 'submit').then(res => res.status === '0' && that.refresh(true))
        },
        onCancel () { }
      })
    },

    cancel () {
      if (this.selectedRows.length === 0) return this.noSelect()
      // const selectedRows = this.selectedRows
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定取回已选择的记录?',
        onOk () {
          return handlePurchase ( { ids: that.selectedRowKeys ,menu_id:14}, 'cancel').then( res => res.status === '0' && that.refresh(true) )
        },
        onCancel () { }
      })
    },

    refresh (bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
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

    // 提示框
    noSelect () {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: '请选择至少一条记录'
      })

      setTimeout(() => {
        modal.destroy()
      }, secondsToGo * 1000)
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
</style>
