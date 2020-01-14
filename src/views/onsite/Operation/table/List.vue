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
        <a-dropdown v-if="item.title === '导出' && item.id">
          <a-menu slot="overlay">
            <a-sub-menu title="PDF">
              <a-menu-item key="export-pdf" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-pdflist" @click="exportTable1">导出列表</a-menu-item>
              <a-menu-item key="export-pdfall" @click="exportTable">导出全部(详情)</a-menu-item>
            </a-sub-menu>
            <a-sub-menu title="EXCEL">
              <a-menu-item key="export-excel" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-excellist" @click="exportTable1">导出列表</a-menu-item>
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
        >
          {{ item.title }}
        </a-button>
      </span>
    </div>
    <br />

    <!-- 购置单数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :columns="dataColumns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
    >
      <!-- <template slot="serial_number" slot-scope="text, record, index">
        <a :class="classChange[index]" @click="clickEdit(text, record.key, index)" href="javascript:;">{{ text }}</a>
      </template> -->
      <a :class="classChange[index]" slot="serial_number" slot-scope="text, record, index" @click="clickEdit(text,index)" href="javascript:;">{{ text }}</a>
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="custom-filter-dropdown">
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker 
          v-if="column.dataIndex === 'use_date'" 
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
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'accept_date' ? 15 : 0}px`"
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
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { handleOperation,getOperationList } from '@/api/onsite/operation'
import { exportPDF, exportPDFList, exportExcel, exportExcelList } from '@/api/onsite/upload'
import { formStatusLabel, formStatusArray } from '@/api/common'
import { handleQueryButton } from '@/api/userMenu'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  computed: {
    dataColumns () {
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
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'name'
          },
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备来源',
          dataIndex: 'equip_source',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_source'
          },
          onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '出机单位',
          dataIndex: 'dispatch_org_name',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'dispatch_org_name'
          },
          onFilter: (value, record) => record.dispatch_org_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '用机日期',
          dataIndex: 'use_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.use_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.use_date.split('-').join('') - b.use_date.split('-').join('')
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '120px',
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
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'check_user_name'
          },
          onFilter: (value, record) => record.check_user_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '审批时间',
          dataIndex: 'check_at',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
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
            if (a.check_at === '--' || b.check_at === '--') {
              return a.check_at.length - b.check_at.length
            }
            return new Date(a.check_at).getTime() - new Date(b.check_at).getTime()
          }
        }
      ]
    }
  },
  data () {
    return {
      classChange:[],
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      checkRange: [],
      title: '盘点单',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      dataSource: [],
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
        // parameter
        return getOperationList(Object.assign(parameter, this.queryParam
                    ,{creator_org_id:this.$store.state.menu_key||0,menu_id:39})).then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index)=> {
            for (let key in x) {
              const isTrue = x[key] === '' || x[key] === undefined || x[key] === null
              if (isTrue) {
                x[key] = '--'
              }
            }
            if (x.is_approve === 1) {
              if(x.status=='10040002'||x.status=='10040003'){
                x.status='10040006'
              }
            }
            if (x.flag == 0&&x.creator_user_name!=this.nickname()) {
              this.classChange[index] = 'read-after'
            } else {
              this.classChange[index] = ''
            }
            return x
          })
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          return res.result || { pageSize: res.responsePageInfo.pageSize, 
                                pageNo: res.responsePageInfo.pageNum, 
                                totalPage: res.responsePageInfo.pages, 
                                totalCount: res.responsePageInfo.total, 
                                data: res.responsePageInfo.list }
        },(err)=>{
          console.log(err)
        })
      },
      current: Number,
      currentSize: Number,
      selectedRowKeys: [],
      selectedRows: [],
      orgparam: {
        menu_id: 39,
        creator_org_id: this.$store.state.menu_key || 0
      },
      options:{
        alert:{
          show:false,
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
          func: () => this.retrieve()
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
          func: () => { this.queryParam = {}; this.range = []; this.startRange = []; this.refresh(true) }
        }
      ],
    }
  },
  watch: {
    $route(to, from) {
      if (from.path !== this.$route.fullPath) {
        this.refresh(true)
      }
    }
  },
  created () {
    setTimeout(() => {
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '39'
      }).then(res => {
        this.menuBtns = this.menuBtns.map(x => {
          const arr = res.responseList.filter(y => y.menu_button_code === x.key)
          arr[0] && (x.id = arr[0].id)
          return x
        })
        this.$refs.table.refresh(true)
      },(err)=>{
        console.log(err)
      })
    }, 0)
  },
  filters: {
    statusFilter (type) {
      return formStatusLabel[type]
    }
  },
  methods: {
    ...mapGetters(['nickname']),
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
        this.$router.push({ name: 'operationEdit', params: {selectedRows:this.selectedRows[0],type:2} })
      } else {
        return this.$router.push({ name: 'operationNew',params: {type: 1} })
      }
    },
    clickEdit (text, index) {
      const arr = this.dataSource[index]
      this.selectedRows[0] = arr
      this.handleRead()
    },
    handleRead () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行查看')
      this.$emit('onDetail', {...this.selectedRows[0], type:'read'})
    },
    remove () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const selectedRowKeys = this.selectedRowKeys
      const that = this

      const deldata = this.dataSource.filter(item => {
        return selectedRowKeys.includes(item.id)&&item.dic_enum_name === "已保存"
      })
      if(deldata.length==0){
        return this.noSelect("该状态的记录无法删除!")
      }
      this.$confirm({
        title: '提示',
        content: `是否确定删除已选择的记录?注意:非已保存状态的记录不可删除?`,
        
        okType: 'danger',
        onOk () {
          return handleOperation({ details: that.selectedRowKeys, menu_id: 39 }, 'delete').then(
            res => {
              if (res.msg == '删除成功') {
                that.noSelect(`删除成功`)
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

      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '已保存') {
          this.noSelect('该状态的记录无法提交！')
          this.$refs.table.clearSelected()
          return
        }
      }
      this.$confirm({
        title: '提示',
        content: `是否确定提交已选择的记录?  注意:(只有已保存的记录可以提交)`,
        
        onOk () {
          return handleOperation({ details: that.selectedRowKeys, flag: 0, menu_id: 39 }, 'submit').then(res => {
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
              that.noSelect(`${subdata.join()}提交失败`)
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
    retrieve() {
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
        
        onOk() {
          return handleOperation({ details: that.selectedRowKeys, menu_id: 39 }, 'retrieve').then(res => {
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
        onCancel() {}
      })
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].status !== '10040006') {
          this.noSelect('该状态的记录不能进行审批')
          return
        }
      }
      this.$emit('onDetail', this.selectedRows[0])
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    onChangeDate (date, range) {
      this.queryParam.begin_use_date = range[0]
      this.queryParam.end_use_date = range[1]
    },
    onChangeCheckDate (date, checkRange) {
      this.queryParam.begin_check_at = checkRange[0]
      this.queryParam.end_check_at = checkRange[1]
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
    exportTable1 (e) {
      if (e.key === 'export-pdflist') {
        exportPDFList({
          menu_id: 39
        }).then(res => {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'export-excellist') {
        exportExcelList({
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }
    },

    exportTable (e) {
      
      if (e.key === 'export-pdf') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportPDF({
          details: this.selectedRowKeys,
          flag:0,
          menu_id: 39
        }).then(res => {
          if (this.selectedRowKeys.length === 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
          } else if (this.selectedRowKeys.length > 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
          }
        })
      } else if (e.key === 'export-excel') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportExcel({
          details: this.selectedRowKeys,
          flag:0,
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }  else if (e.key === 'export-excelall') {
         exportExcel({
          flag:1,
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        }) 
      } else if (e.key === 'export-pdfall') {
        exportPDF({
          flag:1,
          menu_id: 39
        }).then(res => {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
        })
      }
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
    },

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      if (col === 'use_date' || col === 'check_at') {
        this.refresh(true)
      } else {
        confirm()
      }
    },

    handleReset (clearFilters, col) {
      clearFilters()
      this.range = []
      this.startRange = []
      this.queryParam = {}
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
/deep/ td{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ th{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
