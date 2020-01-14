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
          placeholder="输入项目名称查询"
          style="width: 200px"
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
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <template v-if="advanced">
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-item label="单据编号">
                <a-input-number
                  v-model="queryParam.callNo"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-item label="编制日期">
                <a-date-picker
                  v-model="queryParam.date"
                  style="width: 100%"
                  placeholder="请输入编制日期"
                />
              </a-form-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-item label="状态">
                <a-select
                  v-model="queryParam.useStatus"
                  placeholder="请选择"
                  default-value="0"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">未提交</a-select-option>
                  <a-select-option value="2">已提交</a-select-option>
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
      </a-form>
    </div> -->

    <!-- 数据列表 -->


    
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'],  showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
      bordered
    > 

      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}" class='custom-filter-dropdown'>
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex==='create_date'||column.dataIndex==='approvalDate'"
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
          type='primary'
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
      <a-icon slot="filterIcon" slot-scope="filtered" type='search' :style="{ color: filtered ? '#108ee9' : undefined }" />
      <span
        slot="serial"
        slot-scope="text, record, index"
        :key="index"
      >{{ index + 1 }}</span>
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
import { handlePurchase, exportToExcel  , formStatusArray} from '@/api/safety/preWork'
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
          title: '主讲人',
          dataIndex: 'lecturer',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.lecturer.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '培训教育对象',
          dataIndex: 'target_audience',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.target_audience.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '计划课时',
          dataIndex: 'planned_hour'
        },
        {
          title:'本次课时',
          dataIndex:'hour'
        },
        {
          title:'培训地点',
          dataIndex:'edu_place',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.edu_place.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },

        {
          title: '培训人数',
          dataIndex: 'person_num'
        },
        {
          title: '编制日期',
          dataIndex: 'create_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.create_date,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '培训教育内容',
          dataIndex: 'content',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.content.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
       
      ]
    }
  },
  data () {
    return {
      title: '设备人员 岗前安全教育列表',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      range:[],
      customFilterColumn: {},
      filteredInfo: null,
      formStatusArray: formStatusArray,
      
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadRequire.parameter', parameter)
        return handlePurchase(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
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
          func: () => { this.queryParam = {}; this.range = []; this.refresh(true) }
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
    onChange(date,range){
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
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.queryParam.serial_number = selectedKeys[0]
    },

    handleReset (clearFilters) {
      clearFilters()
      this.queryParam.serial_number = ''
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
      exportToExcel({ flag:0,details: e.key === 'export-all' ? this.dataSource.map(d => d.id) : this.selectedRowKeys })
        .then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.xls`)
        })
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
      const selectedRows = this.selectedRows
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
      const selectedRows = this.selectedRows
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定取回已选择的记录?',
        onOk () {
           return handlePurchase({ids: that.selectedRowKeys }, 'cancel').then(res => res.status === '0' && that.refresh(true))
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
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
}
.table-operator {
  .menu-button {
    margin-right: 5px;
  }

  .search {
    float: right;
  }
}
</style>
