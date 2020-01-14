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
        <!-- <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay">
            <a-menu-item key="export-pdf" @click="exportTable">
              <a-icon :type="item.icon" />PDF
            </a-menu-item>
            <a-menu-item key="export-excel" @click="exportTable">
              <a-icon :type="item.icon" />EXCEL
            </a-menu-item>
          </a-menu>
          <a-button
            class="menu-button"
            :type="item.type"
            :icon="item.icon"
          >
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
       <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay">
            <a-sub-menu title='PDF'>
              <a-menu-item key="export-pdf" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item>导出列表</a-menu-item>
              <a-menu-item>导出全部(详情)</a-menu-item>
            </a-sub-menu>
            <a-sub-menu title="EXCEL">
              <a-menu-item key="export-excel" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item>导出列表</a-menu-item>
              <a-menu-item>导出全部(详情)</a-menu-item>
            </a-sub-menu>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
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
              <a-icon :type="item.icon" />全部</a-menu-item>
            <a-menu-item key="print-selected">
              <a-icon :type="item.icon" />已选择</a-menu-item>
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
          placeholder="输入用户名查询"
          style="width: 200px"
          v-model="queryParam.user_name"
          @search="onSearch"
        />
        <a
          @click="toggleAdvanced"
          style="margin-left: 8px"
        >
          {{ advanced ? '收起' : '高级' }}
          <a-icon :type="advanced ? 'up' : 'down'" />
        </a>
      </span> -->
    </div>
    <br />
    <!-- <div class="table-page-search-wrapper"> -->
      <!-- <a-form layout="inline">
        <a-row :gutter="48">
          <template v-if="advanced">
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-item label="类型">
                <a-select
                  v-model="queryParam.operate_type"
                  placeholder="请选择"
                  default-value="0"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">登陆</a-select-option>
                  <a-select-option value="2">编辑</a-select-option>
                  <a-select-option value="3">登出</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col
            :md="!advanced && 8 || 24"
            :sm="24"
          >
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button
                v-if="advanced"
                type="primary"
                @click="refresh()"
              >查询</a-button>
              <a-button
                v-if="advanced"
                style="margin-left: 8px"
                @click="() => queryParam = {}"
              >重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form> -->
    <!-- </div> -->

    <!-- 购置单数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
    >
      <a slot="request_code" slot-scope="text" @click="clickEdit(text)" href="javascript:;">{{ text }}</a>
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="custom-filter-dropdown">
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker :showTime="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" v-if="column.dataIndex === 'created_at'" v-model="range" @change="onChangeDate" style="width: 218px; margin-bottom: 8px; display: block;"/>
        <a-input
          v-else
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
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
      <span
        slot="serial"
        slot-scope="text, record, index"
      >{{ index + 1 + (current - 1) * currentSize }}</span>
      <ellipsis slot="reason" slot-scope="text" :length="20" tooltip>
        {{ text }}
      </ellipsis>
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <!-- <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$emit('onDetail', record)">详情</a>
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
import { getLogList,exportToPdf, exportToExcel} from '@/api/log'
import { formStatusLabel, formStatusArray, formContent  } from '@/api/common'
// import XLSX from 'xlsx'
const FileSaver = require('file-saver')

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

      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'user_name'
          },
          onFilter: (value, record) => record.user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '所属机构',
          dataIndex: 'user_department',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'user_department'
          },
          onFilter: (value, record) => record.user_department.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '岗位',
          dataIndex: 'user_position',
          scopedSlots: { customRender: 'user_position' }
        },
        {
          title: 'IP',
          dataIndex: 'ip',
          scopedSlots: { customRender: 'ip' }
        },
        {
          title: '记录时间',
          dataIndex: 'created_at',
          width: '150px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.created_at.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.created_at.split('-').join('') - b.created_at.split('-').join('')
        },
        // {
        //   title: '操作类型',
        //   dataIndex: 'operate_type',
        //   key: 'operate_type',
        //   width: '120px',
        //   scopedSlots: {
        //     customRender: 'operate_type'
        //   },
        //   filterMultiple: false,
        //   filters: formStatusArray,
        //   filteredValue: filteredInfo.operate_type || null,
        //   onFilter: (value, record) => record.operate_type === value
        // },
        {
          title: '操作内容',
          dataIndex: 'operate_content',
          width: '150px',
          scopedSlots: {
            customRender: 'operate_content'
          },
          filterMultiple: false,
          filters: formContent,
          filteredValue: filteredInfo.operate_content || null,
          onFilter: (value, record) => record.operate_content === value
        }
      ]
    }
  },
  data () {
    return {
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      formStatusArray: formStatusArray,
      formContent: formContent,
      title: '系统日志',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      // columns: [
      //   {
      //     title: '序号',
      //     scopedSlots: { customRender: 'serial' }
      //   },
      //   {
      //     title: '用户名',
      //     dataIndex: 'user_name'
      //   },
      //   {
      //     title: '所属机构',
      //     dataIndex: 'user_department'
      //   },
      //   {
      //     title: '岗位',
      //     dataIndex: 'user_position'
      //   },
      //   {
      //     title: 'IP',
      //     dataIndex: 'ip'
      //   },
      //   {
      //     title: '记录时间',
      //     dataIndex: 'created_at'
      //   },
      //   {
      //     title: '操作类型',
      //     dataIndex: 'operate_type'
      //   },
      //   {
      //     title: '操作内容',
      //     dataIndex: 'operate_content'
      //   }
      // ],
      dataSource: [],
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

        // 查询所有状态
        if ([0, '0'].includes(parameter.status)) Reflect.deleteProperty(parameter, 'status')
        if ([0, '0'].includes(this.queryParam.status)) Reflect.deleteProperty(this.queryParam, 'status')

        // parameter
        return getLogList(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
            if (x.operate_type  === 1) {
              x.operate_type = '用户登陆'
              return x
            }
            if (x.operate_type  === 2) {
              x.operate_type = '数据编辑'
              return x
            }
            if (x.operate_type  === 3) {
              x.operate_type = '系统管理'
              return x
            }
            
          })
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
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
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.exportTable()
        },
        {
          key: 'btn-2',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.printTable()
        },
        {
          key: 'btn-3',
          icon: 'sync',
          title: '刷新',
          type: 'primary',
          func: () => { this.queryParam = {}; this.range = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
        console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      }
    }
  },
  created () {
    // getRoleList({ t: new Date() })
  },
  filters: {
    statusFilter (type) {
      return formStatusLabel[type]
    }
  },
  methods: {
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
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
      if (!value) return
      this.queryParam.user_name = value.trim()
      this.refresh(true)
    },
    onChangeDate (date, range) {
      this.queryParam.begin_create_at = range[0]
      this.queryParam.end_create_at = range[1]
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
        documentTitle: '资产管理系统'
      })
    },

    exportTable (e) {
      // var workbook = XLSX.utils.book_new()
      // var ws = XLSX.utils.json_to_sheet(e.key === 'export-all' ? this.dataSource : this.selectedRows,
      //   {
      //     header: this.columns.filter(col => col.title !== '序号').map(col => {
      //       return col.dataIndex
      //     })
      //   })

      // /* bookType can be any supported output type */
      // var wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }

      // /* Add the worksheet to the workbook */
      // XLSX.utils.book_append_sheet(workbook, ws)

      // var wbout = XLSX.write(workbook, wopts)

      // /* the saveAs call downloads a file on the local machine */
      // FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.xls`)

      if (e.key !== 'export-all' && this.selectedRows.length === 0) return this.noSelect()

      if (e.key === 'export-pdf') {
        exportToPdf({
          details: this.selectedRowKeys,
          flag: 0,
          menu_id: 28
        }).then(res => {
          if (this.selectedRowKeys.length === 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
          } else if (this.selectedRowKeys.length > 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
          }
        })
      } else if (e.key === 'export-excel') {
        exportToExcel({
          details: this.selectedRowKeys,
          flag: 0,
          menu_id: 28
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
        })
      }
    },

    // 刷新
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

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      confirm()
      if (col) this.refresh(true)
    },

    handleReset (clearFilters, col) {
      clearFilters()
      this.queryParam = {}
      this.range = []
      this.refresh(true)
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
