<template>
  <div v-if="isRouterAlive">
    <div class="table-operator" :style="{ 'margin-bottom': advanced ? '24px' : 0 }">
      <!-- 菜单按钮列表 -->
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出' && item.id">
          <a-menu slot="overlay">
            <a-sub-menu title="PDF">
              <a-menu-item key="export-pdf" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-pdflist" @click="exportTable">导出列表</a-menu-item>
              <a-menu-item key="export-pdfall" @click="exportTable">导出全部(详情)</a-menu-item>
            </a-sub-menu>
            <a-sub-menu title="EXCEL">
              <a-menu-item key="export-excel" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-excellist" @click="exportTable">导出列表</a-menu-item>
              <a-menu-item key="export-excelall" @click="exportTable">导出全部(详情)</a-menu-item>
            </a-sub-menu>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button
          v-else-if="item.id"
          class="menu-button"
          :type="item.type"
          :icon="item.icon"
          @click="item.func"
        >{{ item.title }}</a-button>
      </span>
    </div>
    <br />

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
      <template slot="serial_number" slot-scope="text, record, index">
        <a
          :class="classChange[index]"
          @click="clickEdit(text, index)"
          href="javascript:;"
        >{{ text }}</a>
      </template>
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        class="custom-filter-dropdown"
      >
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex === 'create_date'"
          v-model="range"
          @change="onChangeDate"
          style="width: 218px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex === 'check_at'"
          v-model="checkRange"
          @change="onChangeCheckDate"
          style="width: 218px; margin-bottom: 8px; display: block;"
        />
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
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'create_date' ? 16 : 0}px`"
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
      <ellipsis slot="remark" slot-scope="text" :length="20" tooltip>{{ text }}</ellipsis>
      <span slot="status" slot-scope="text">{{ text | statusFilter }}</span>
      <!-- <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$emit('onDetail', record)">详情</a>
        </template>
      </span>-->
    </s-table>
    <!-- @ok="handleSaveOk"
    @close="handleSaveClose"-->
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { getRoleList } from '@/api/manage'
import { handleTemporary, exportToExcel,exportToPDF } from '@/api/planManagement/temporary'
import { formStatusArray } from '@/api/common'
import { handleQueryButton } from '@/api/userMenu'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    STable,
    Ellipsis
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
    columns(){
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          width:'70px',
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
        },
        {
          title: '编制人',
          width:'120px',
          dataIndex: 'creator_user_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.creator_user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '编制日期',
          dataIndex: 'create_date',
          width:'120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.create_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
              //  this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.create_date.split('-').join('') - b.create_date.split('-').join('')  
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width:'150px',
          scopedSlots: { 
            customRender: 'remark' 
          }
        },
        {
          title: '设施总数量',
          width:'110px',
          align:'right',
          dataIndex: 'total_number'
        },
        {
          title: '总容量(功率)',
          width:'90px',
          align:'right',
          dataIndex: 'total_capacity'
        },
        {
          title: '状态',
          width:'90px',
          dataIndex: 'dic_enum_name',
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
          title: '当前审批人',
          dataIndex: 'check_user_name',
          width:'110px',
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
          dataIndex: 'check_at',
          width:'120px',
          scopedSlots: { 
            customRender: 'check_at',
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.check_at.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => new Date(a.check_at).getTime() - new Date(b.check_at).getTime()
        }
      ]
    }
  },
  data () {
    return {
      isRouterAlive: true,
      orgparam: {
        menu_id: 16,
        creator_org_id: this.$store.state.menu_key || 0
      },
      classChange: [],
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      formStatusArray: formStatusArray,
      title: '购置单',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      dataSource: [],
      myData: [],
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

        // 查询所有状态的购置单
        if ([0, '0'].includes(parameter.status)) Reflect.deleteProperty(parameter, 'status')
        if ([0, '0'].includes(this.queryParam.status)) Reflect.deleteProperty(this.queryParam, 'status')
        if (!this.$store.state.menu_key) this.orgparam.creator_org_id = this.$store.state.user.first_key

        // parameter
        return handleTemporary(Object.assign(parameter, this.queryParam, this.orgparam), 'retrieve').then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index) => {
            for (let i in x) {
              if (x[i] === null && i !== 'process_inst_id') x[i] = '--'
            }

            if (x.is_approve === 1) {
              if (x.dic_enum_name == '已提交'|| x.dic_enum_name == '审批中') {
                x.dic_enum_name = '待审批'
              }
            }

            if (x.flag !== 0) {
              this.classChange[index] = ''
            } else {
              this.classChange[index] = 'read-after'
            }
            return x
          })
          this.myData = res.responsePageInfo.list
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          return {
            pageSize: res.responsePageInfo.pageSize,
            pageNo: res.responsePageInfo.pageNum,
            totalPage: res.responsePageInfo.pages,
            totalCount: res.responsePageInfo.total,
            data: res.responsePageInfo.list
          }
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
          key: 'm20001',
          icon: 'plus',
          title: '新建',
          type: 'primary',
          func: () => this.handleEdit()
        },
        {
          key: 'm20002',
          icon: 'form',
          title: '编辑',
          type: 'primary',
          func: () => this.handleEdit(true)
        },
        {
          key: 'm20003',
          icon: 'delete',
          title: '删除',
          type: 'primary',
          func: () => this.remove()
        },
        {
          key: 'm20004',
          icon: 'check',
          title: '提交',
          type: 'primary',
          func: () => this.submit()
        },
        {
          key: 'm20005',
          icon: 'backward',
          title: '取回',
          type: 'primary',
          func: () => this.cancel()
        },
        {
          key: 'm20009',
          icon: 'fork',
          title: '审批',
          type: 'primary',
          func: () => this.handleDetail()
        },
        {
          key: 'm20006',
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.exportTable()
        },
        {
          key: 'm20007',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.printTable()
        },
        {
          key: 'm20008',
          icon: 'sync',
          title: '刷新',
          type: 'primary',
          func: () => {
            this.queryParam = {}
            this.range = []
            this.checkRange = []
            this.refresh(true)
          }
        }
      ],
      loadChange (pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      }
    }
  },
  watch:{
   $route(to, from) {
      if (from.path === '/planManagement/temporaryNew' || from.path === '/planManagement/temporaryEdit') {
        this.refresh(true)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '16'
      }).then((res, err) => {
        if (err) return this.$message.error(err.message)
        this.menuBtns = this.menuBtns.map(x => {
          const arr = res.responseList.filter(y => y.menu_button_code === x.key)
          arr[0] && (x.id = arr[0].id)
          return x
        })
      })
    }, 0)
  },
  filters: {
    statusFilter (type) {
      return formStatusLabel[type]
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    clickEdit (text, index) {
      const arr = []
      arr[0] = this.dataSource[index]
      this.selectedRows[0] = arr[0]
      this.handleRead()
    },

    handleEdit (bool) {
      if (bool) {
        if (this.selectedRows.length === 0 || this.selectedRows.length > 1) {
          return this.noSelect('请选择一条记录进行编辑')
        }
        if (this.selectedRows[0].dic_enum_name !== '已保存') {
          this.noSelect('该状态记录不能编辑')
          this.$refs.table.clearSelected()
          return
        }
        // for (let i in this.selectedRows[0]) {
        //   if (this.selectedRows[0][i] === '--') delete this.selectedRows[0][i]
        // }
        // this.selectedRows[0].keeptype = 111
        this.$router.push({ name: 'temporaryEdit', params: this.selectedRows[0] })
      } else {
        return this.$router.push({ name: 'temporaryNew',params:{type:1}})
      }
    },
    handleRead () {
      this.$emit('onRead', { ...this.selectedRows[0], type: 'read' })
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '待审批') {
          this.noSelect('该状态的记录不能进行审批')
          this.$refs.table.clearSelected()
          return
        }
        this.$emit('onRead', this.selectedRows[0])
      }
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

    // 搜索框
    onSearch (value) {
      if (!value) return
      this.queryParam.creator_user_name = value.trim()
      this.refresh(true)
    },
    onChangeDate (date, range) {
      this.queryParam.begin_create_date = range[0]
      this.queryParam.end_create_date = range[1]
    },
    onChangeCheckDate (date, checkRange) {
      this.queryParam.begin_check_at = checkRange[0]
      this.queryParam.end_check_at = checkRange[1]
    },

    printTable () {
      if (!this.selectedRowKeys.length) return this.$message.warning('请选择购置记录')
      // if (this.selectedRowKeys.length > 1) return this.$message.warning('请只选择一条购置记录')
      this.$refs.print.add(this.selectedRows)
    },

    exportTable (e) {
      if (e.key === 'export-pdf') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportToPdf({
          flag: 0,
          details: this.selectedRowKeys,
          menu_id: 16
        }).then(res => {
          if (this.selectedRowKeys.length === 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
          } else if (this.selectedRowKeys.length > 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
          }
        })
      } else if (e.key === 'export-excel') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportToExcel({
          flag: 0,
          details: this.selectedRowKeys,
          menu_id: 16
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      } else if (e.key === 'export-pdfall') {
        exportToPdf({
          flag: 1,
          menu_id: 16
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
        })
      } else if (e.key === 'export-excelall') {
        exportToExcel({
          flag: 1,
          menu_id: 16
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
        })
      } else if (e.key === 'export-pdflist') {
        exporttoPDFList({
          menu_id: 16
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'export-excellist') {
        exporttoExcelList({
          menu_id: 16
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }
    },

    remove () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this
      let Newarr = this.selectedRows.filter(item => item.dic_enum_name === '已保存')
      if (Newarr.length === 0) {
        this.$refs.table.clearSelected()
        this.noSelect('该状态的记录无法删除!')
        return
      }
      let arrkeys = []
      Newarr.map(d => arrkeys.push(d.id))
      this.$confirm({
        title: '提示',
        content: '是否确定删除已选择的记录?注意:(非已保存状态的记录不可删除)',

        okType: 'danger',
        onOk() {
          return handleTemporary({ details: arrkeys ,menu_id:16}, 'delete').then(res => {
            if (res.responseList.length !== 0) {
              const subdata = []
              for (var i = 0; i < that.selectedRows.length; i++) {
                for (var j = 0; j < res.responseList.length; j++) {
                  if (that.selectedRows[i].id === res.responseList[j]) {
                    subdata.push(that.selectedRows[i].request_code)
                  }
                }
              }
              that.noSelect(`编号${subdata.join()}删除失败`)
              that.refresh(true)
            } else {
              that.noSelect('删除成功')
              that.refresh(true)
            }
          })
        },
        onCancel () { }
      })
    },
    handleChange () { },
    submit () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this

      let Newarr = this.selectedRows.filter(item => item.dic_enum_name === '已保存')
      if (Newarr.length === 0) {
        this.$refs.table.clearSelected()
        this.noSelect('该状态的记录无法提交!')
        return
      }
      let arrkeys = []
      Newarr.map(d => arrkeys.push(d.id))
      this.$confirm({
        title: '提示',
        content: `是否确定提交已选择的记录?  注意:(只有已保存的记录可以提交)`,

        onOk () {
          return handleTemporary({ details: arrkeys, flag: 0, menu_id: 16 }, 'submit').then(res => {
            // res.status === '0'
            if (res.responseList.length !== 0) {
              const subdata = []
              for (var i = 0; i < that.selectedRows.length; i++) {
                for (var j = 0; j < res.responseList.length; j++) {
                  if (that.selectedRows[i].id === res.responseList[j]) {
                    subdata.push(that.selectedRows[i].request_code)
                  }
                }
              }
              that.noSelect(`编号${subdata.join()}提交失败`)
              that.refresh(true)
            } else {
              that.noSelect('提交成功')
              that.refresh(true)
            }
          })
        },
        onCancel () { }
      })
    },

    cancel () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this
      let Newarr = this.selectedRows.filter(item => item.dic_enum_name === '已提交')
      if (Newarr.length === 0) {
        this.$refs.table.clearSelected()
        this.noSelect('该状态的记录无法取回!')
        return
      }
      let arrkeys = []
      Newarr.map(d => arrkeys.push(d.id))
      this.$confirm({
        title: '提示',
        content: '是否确定取回已选择的记录?注意:(只有已提交状态的记录可以取回)',

        onOk () {
          return handleTemporary({ details: arrkeys, menu_id: 16 }, 'cancel').then(res => {
            if (res.responseList.length !== 0) {
              const subdata = []
              for (var i = 0; i < that.selectedRows.length; i++) {
                for (var j = 0; j < res.responseList.length; j++) {
                  if (that.selectedRows[i].id === res.responseList[j]) {
                    subdata.push(that.selectedRows[i].request_code)
                  }
                }
              }
              that.noSelect(`编号${subdata.join()}取回失败`)
              that.refresh(true)
            } else {
              that.noSelect('取回成功')
              that.refresh(true)
            }
          })
        },
        onCancel () { }
      })
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
      if (col == 'create_date' || col == 'check_at') {
        this.refresh(true)
        return
      }
      confirm()
    },

    handleReset (clearFilters, col) {
      if (col == 'create_date' || col == 'check_at') {
        this.queryParam = {}
        this.range = []
        this.checkRange = []
        this.refresh(true)
        return
      }
      clearFilters()
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
/deep/ td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
