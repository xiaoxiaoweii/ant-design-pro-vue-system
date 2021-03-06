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
    </div>
    <br />  
    <div class="table-page-search-wrapper">
    </div>
    <!-- 设备费用扣款单列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      
      <template slot="serial_number" slot-scope="text, record, index">
        <a
          :class="classChange[index]"
          @click="clickEdit(text, index)"
          href="javascript:;"
        >{{ text }}</a>
      </template>
      <!-- 新搜索页面 -->
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}" class="custom-filter-dropdown">
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex==='create_date'"
          v-model="range "
          @change="onChangeCreateDate"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex==='time'"
          v-model="range "
          @change="onChange"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex==='check_at'"
          v-model="range2"
          @change="onChangeTime"
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
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          icon="search"
          size="small"
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'created_at' ? 15 : 0}px`"
        >搜索</a-button>
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
      <span
        slot="status"
        slot-scope="text"
      >
        {{ text }}
      </span>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import { getRoleList } from '@/api/manage'
import { handleQueryButton } from '@/api/userMenu'
import { handlePurchase, exportToExcel, exportToPDF, formStatusLabel, formStatusArray } from '@/api/computation/equipFee'
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
      return  [
        {
          title: '序号',
          dataIndex:'serial',
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
          title: '分包商名称',
          dataIndex: 'subcontractor_name',
          width: '200px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'subcontractor_name',
          },
          onFilter: (value, record) => record.subcontractor_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '编制人',
          dataIndex: 'creator_user_name',
          width: '100px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'creator_user_name',
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
          dataIndex: 'create_date',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'create_date'
          },
          onFilter: (value, record) => record.create_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.create_date.split('-').join('') - b.create_date.split('-').join('')
        },
        {
          title: '扣款时间范围',
          dataIndex: 'time',
          width: '120px',
          customRender: (text, record) => {
            const time = `${record.deduction_start_date}～${record.deduction_end_date}`
            return time;
          },
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter:(value,record)=>record.time,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '合计扣款金额(元)',
          align: 'right',
          width: '120px',
          dataIndex: 'total_deduction_amount'
        },
        {
          title: '状态',
          dataIndex: 'dic_enum_name',
          width: '100px',
          key: 'status',
          scopedSlots: {
            customRender: 'status'
          },
          filterMultiple: false,
          filters: formStatusArray,
          filteredValue: filteredInfo.status || null,
          onFilter: (value, record) => record.status === value
        },
        {
          title: '审批人',
          dataIndex: 'check_user_name',
          width: '120px',
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
          dataIndex: 'check_at',
          width: '120px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.check_at.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => {
            return new Date(a.check_at).getTime() - new Date(b.check_at).getTime()
          }
        }
       
      ]
    }
  },
  data () {
    return {
      title: '设备费用扣款单管理列表',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      range: [],
      range2: [],
      createRange: [],
      classChange: [],
      filteredInfo: null,
      dataSource: [],
      orgparam: {
        creator_org_id: this.$store.state.menu_key,
        menu_id: '66'
      },
      formStatusArray: formStatusArray,
      customFilterColumn: {},
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
        if ([0, '0'].includes(parameter.status)) Reflect.deleteProperty(parameter, 'status')
        if ([0, '0'].includes(this.queryParam.status)) Reflect.deleteProperty(this.queryParam, 'status')
        if (!this.$store.state.menu_key) this.orgparam.creator_org_id = this.$store.state.user.first_key

        return handlePurchase(Object.assign(parameter, this.queryParam,this.orgparam), 'retrieve').then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index)=> {
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
          func: () => { this.queryParam = {}; this.range = []; this.range2 = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
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
  },
  watch: {
    $route (to, from) {
      if (from.path === '/computation/equipFeeNew' || from.path === '/computation/equipFeeEdit') {
        this.refresh(true)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '66'
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
  methods: {
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onChange (date, range) {
      this.queryParam.deduction_start_date = range[0]
      this.queryParam.deduction_end_date = range[1]
    },
    onChangeTime (date, range2) {
      this.queryParam.begin_check_at = range2[0]
      this.queryParam.end_check_at = range2[1]
    },
    onChangeCreateDate(date, createRange) {
      this.queryParam.begin_create_date = createRange[0]
      this.queryParam.end_create_date = createRange[1]
    },
    clickEdit (text) {
      const arr = this.dataSource.filter(x => x.serial_number === text)
      this.selectedRows[0] = arr[0]
      this.handleRead()
    },
    handleRead () {
      this.$emit('onDetail', { ...this.selectedRows[0], type: 'read' })
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '待审批') {
          this.noSelect('该状态的记录不能进行审批')
          this.$refs.table.clearSelected()
          return
        }
        this.$emit('onDetail', this.selectedRows[0])
      }
    },
    handleSearch (selectedKeys, confirm, col) {
      if (col == 'create_date' || col == 'time' || col == 'check_at') {
        this.refresh(true)
        return
      }
      confirm()
    },
    handleReset (clearFilters, col) {
      if (col == 'create_date' || col == 'time' || col == 'check_at') {
        this.queryParam = {}
        this.range = []
        this.range2 = []
        this.createRange = []
        this.refresh(true)
        return
      }
      clearFilters()
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
        for (let i in this.selectedRows[0]) {
          if (this.selectedRows[0][i] === '--') delete this.selectedRows[0][i]
        }      
        this.selectedRows[0].keeptype = 111
        this.$router.push({ name: 'equipFeeEdit', params: this.selectedRows[0] })   
      } else {
        return this.$router.push({ name: 'equipFeeNew',params: { type: 1 } })
      }
    },
    handleOk () { },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onSearch (value) {
      this.queryParam.creator_user_name = value.trim()
      this.refresh(true)
    },
    exportTable (e) {
      if (this.selectedRows.length === 0) return this.noSelect()
      if (e.key === 'export-excel') {
        exportToExcel ({ flag: 0, details: this.selectedRowKeys })
          .then(res => {
            FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.xls`)
          })
      } else {
        exportToPDF ( { flag: 0, details:  this.selectedRowKeys  })
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
      const that = this
      let Newarr= this.selectedRows.filter( item=>item.dic_enum_name === '已保存'  )
      if (Newarr.length === 0) {
        this.$refs.table.clearSelected()
        this.noSelect('该状态的记录无法删除!') 
        return 
        }
      let arrkeys = []
      Newarr.map(d=>arrkeys.push(d.id))
      this.$confirm({
        title: '提示',
        content:'是否确定删除已选择的记录?注意:非已保存状态的记录不可删除?',
        okType: 'danger',
        onOk () {
          return handlePurchase({ details: arrkeys,menu_id:66}, 'delete').then(
            res => {
              if(res.responseList.length!==0){
                const subdata=[]
                for(var i=0;i<that.selectedRows.length;i++){     
                  for(var j=0;j<res.responseList.length;j++){
                    if(that.selectedRows[i].id === res.responseList[j]){
                      subdata.push(that.selectedRows[i].serial_number)     
                    } 
                  }
                }
                that.noSelect(`编号${subdata.join()}删除失败`)
                that.refresh(true)
              }else{
                  that.noSelect('删除成功')
                  that.refresh(true)
                } 
              }
          )
        },
        onCancel () { }
      })
    },

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
        
        onOk() {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return handlePurchase({ details: arrkeys, flag: 0, menu_id: 66 }, 'submit').then(res => {
            // res.status === '0'
            if (res.responseList.length !== 0) {
              const subdata = []
              for (var i = 0; i < that.selectedRows.length; i++) {
                for (var j = 0; j < res.responseList.length; j++) {
                  if (that.selectedRows[i].id === res.responseList[j]) {
                    subdata.push(that.selectedRows[i].serial_number)
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
        onCancel() {}
      })
    },

    cancel () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '已提交') {
          this.noSelect('非已提交状态的记录无法取回')
          this.$refs.table.clearSelected()
          return
        }
      }
      this.$confirm({
        title: '提示',
        content: '是否确定取回已选择的记录?注意:(只有已提交状态的记录可以取回)',

        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return handlePurchase({ details: that.selectedRowKeys, menu_id: 66 }, 'cancel').then(res => {
            if (res.responseList == undefined) {
                document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "visible"
                return
            }
            if (res.responseList.length !== 0) {
              const subdata = []
              for (var i = 0; i < that.selectedRows.length; i++) {
                for (var j = 0; j < res.responseList.length; j++) {
                  if (that.selectedRows[i].id === res.responseList[j]) {
                    subdata.push(that.selectedRows[i].serial_number)
                  }
                }
              }
              that.noSelect(`编号${subdata.join()}  取回失败`)
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
