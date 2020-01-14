<template>
  <div>
    <div class="table-operator" :style="{ 'margin-bottom': advanced ? '24px' : 0 }">
      <!-- 菜单按钮列表 -->
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay" @click="exportTable">
            <a-menu-item key="export-pdf">
              <a-icon :type="item.icon" />PDF
            </a-menu-item>
            <a-menu-item key="export-excel">
              <a-icon :type="item.icon" />EXCEL
            </a-menu-item>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>

        <a-dropdown v-else-if="item.title === '打印'">
          <a-menu slot="overlay" @click="printTable">
            <a-menu-item key="print-all">
              <a-icon :type="item.icon" />全部
            </a-menu-item>
            <a-menu-item key="print-selected">
              <a-icon :type="item.icon" />已选择
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
    <!-- 设备周转材料摊销管理数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true,pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 + (current - 1) * 10 }}</span>
      <a slot="serial_number" slot-scope="text" @click="clickEdit(text)" href="javascript:;">{{ text }}</a>  
      <!-- 新搜索页面 -->
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}"
        class="custom-filter-dropdown"
      >
        <a-range-picker
          v-if="column.dataIndex==='compile_date'||column.dataIndex==='xxx'"
          v-ant-ref="c => searchData = c"
          v-model="range "
          @change="onChangeDate"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <!-- <a-select
          v-else-if="column.dataIndex==='dic_enum_name'"
          v-ant-ref="c => searchSelect = c"
          v-model="queryParam.dic_enum_name"
          :value="selectedKeys[0]"
          @change="value => setSelectedKeys(value)"
          @pressEnter="() => handleSearch(selectedKeys, confirm)"
          style="width: 188px; margin-bottom: 8px; display: block;"
          placeholder="请选择"
          default-value="全部"
        >
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="已保存">已保存</a-select-option>
          <a-select-option value="已提交">已提交</a-select-option>
        </a-select> -->
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
      <ellipsis slot="supplier_name" slot-scope="text" :length="20" tooltip>
        {{ text }}
      </ellipsis>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { getRoleList } from '@/api/manage'
import { handlePayment, exportToExcel,exportToPDF} from '@/api/settlement/ExternalPayment'
import { formStatusArray } from '@/api/common'
// import XLSX from 'xlsx'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  computed: {
    fields() {
      const fields = {}

      this.columns.forEach(col => {
        if (col.dataIndex === 'apitalMaterial' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    },
    columns(){
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          width: '70px',
          fixed: 'left',
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
          onFilterDropdownVisibleChange: visible => {
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
          dataIndex: 'compile_person',
          width:'130px',
          scopedSlots: {
            customRender: 'compile_person'
          }
        },
        {
          title: '编制日期',
          dataIndex: 'compile_date',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'compile_date'
          },
          onFilter: (value, record) => record.compile_date.toLowerCase().includes(value.toLowerCase()),
        sorter: (a, b) => a.compile_date.split('-').join('') - b.compile_date.split('-').join('')  
        },
        {
          title: '申请金额合计(元)',
          dataIndex: 'total_amount',
          align: 'right',
          width: '130px',
          scopedSlots: {
            filterIcon: 'filterIcon',
            customRender: 'total_amount'
          }  
        },
        {
          title: '开累合计结算金额(元)',
          dataIndex: 'total_settlement_amount',
          align: 'right',
          width: '210px',
          scopedSlots: {
            filterIcon: 'filterIcon',
            customRender: 'total_settlement_amount'
          }
        },
         {
          title: '状态',
          dataIndex: 'dic_enum_name',
          width: '90px',
          key: 'dic_enum_name',
          scopedSlots: {
            customRender: 'dic_enum_name'
          },
          filterMultiple: false,
          filters: formStatusArray,
          filteredValue: filteredInfo.dic_enum_name || null,
          onFilter: (value, record) => record.dic_enum_name === value
        },
        {
          title: '审批人',
          dataIndex: 'check_user_name',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'check_user_name'
          },
          onFilter: (value, record) => record.check_user_name.toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: 'xxx',
          width: '120px',
          scopedSlots: { customRender: 'xxx' },
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.xxx.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.settlement_date.split('-').join('') - b.settlement_date.split('-').join('')  
        }
        
      ]
    }
  },
  data() {
    return {
      filteredInfo: null,
      title: '设备周转材料摊销管理',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      searchInput: null,
      // 表头
      range: [],
      dataSource: [],
      current: 0,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return handlePayment(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
          // res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
          //   x.total_amount = x.total_amount.toFixed(2)
          //   return x
          // })
          console.log('表格信息',res)
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
          this.current = res.responsePageInfo.pageNum

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
          func: () => {
            this.queryParam = {}
            this.refresh(true)
          }
        }
      ],
    loadChange (pagination, filters, sorter) {
        console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      }  
    }
  },
  created() {
    getRoleList({ t: new Date() })
  },
  methods: {
    onChangeDate(date, range) {
      this.queryParam.settlement_start_time = range[0]
      this.queryParam.settlement_end_time = range[1]
    },
    handleSearch(selectedKeys, confirm, col) {

      confirm()
      if (col) this.refresh(true)
     
    },
    handleReset(clearFilters, col) {
      clearFilters()
      col === 'settlement_date' && (this.range = [])
    },
    handleEdit(bool) {
      if (bool)
        if (this.selectedRows.length === 0 || this.selectedRows.length > 1)
          return this.noSelect('请选择一条记录进行编辑')
      this.$emit('onEdit', bool ? this.selectedRows[0] : null)
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      this.$emit('onDetail', this.selectedRows[0])
    }, 
    handleOk() {},
    clickEdit (text) {
      const arr = this.dataSource.filter(x => x.serial_number === text)
      this.selectedRows[0] = arr[0]
      this.handleRead()
    },
    handleRead () {
      this.$emit('onRead', this.selectedRows[0])
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    printTable(e) {
      const key = e.key
      const properties = this.columns
        .filter(col => col.title !== '序号')
        .map(col => {
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
        documentTitle: '业务管理系统'
      })
    },

    exportTable(e) {
      if (e.key !== 'export-all' && this.selectedRows.length === 0) return this.noSelect()

     if (e.key === 'export-excel'){
     exportToExcel({
        details: this.selectedRowKeys,
        flag: 0
      }).then(res => {
        FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
      })
     }else if(e.key === 'export-pdf'){
      exportToPDF({
          details: this.selectedRowKeys,
          flag: 0
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.pdf`)
        })
     }
    },

    remove() {
      if (this.selectedRows.length === 0) return this.noSelect()
      const selectedRowKeys = this.selectedRowKeys
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定删除已选择的记录?',
        okType: 'danger',
        onOk() {
          return handlePayment({ ids: selectedRowKeys }, 'delete').then(res => res.status === '0' && that.refresh(true))
        },
        onCancel() {}
      })
    },

    submit() {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定提交已选择的记录?',
        onOk() {
          return handlePayment({ ids: that.selectedRowKeys, flag: 0 }, 'submit').then(
            res => res.status === '0' && that.refresh(true)
          )
        },
        onCancel() {}
      })
    },

    cancel() {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定取回已选择的记录?',
        onOk() {
          console.log('取回的id',that.selectedRowKeys)
          return handlePayment({ ids: that.selectedRowKeys,menu_id:'1'}, 'cancel').then(
            res => res.status === '0' && that.refresh(true)
          )
        },
        onCancel() {}
      })
    },

    refresh(bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
      this.selectedRowKeys = []
      this.selectedRows = []
       // 清空了过滤内容
      this.filteredInfo = null
    },

    // 提示框
    noSelect(title) {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: title || '请选择至少一条记录'
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
