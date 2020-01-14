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

    <!-- 临电台账数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :columns="columns"
      :data="loadData"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
    >  
      <!-- 临电台账数据列表内表 -->
      <!-- <a-table
            slot="expandedRowRender"
            slot-scope="record, index"
            v-if="loadData[index]"
            :columns="columnsSon"
            :dataSource="loadData[index]"
            :pagination="false"
            bordered
          >
        </a-table> -->

      <template slot="serial_number" slot-scope="text, record, index">
        <a :class="classChange[index]" href="javascript:;">{{ text }}</a>
      </template>
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="custom-filter-dropdown">
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker v-if="column.dataIndex === 'check_date'" v-model="range" @change="onChangeDate" style="width: 218px; margin-bottom: 8px; display: block;"/>
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
      >{{ index + 1 }}</span>
      <ellipsis slot="reason" slot-scope="text" :length="20" tooltip>
        {{ text }}
      </ellipsis>
      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <s-table
        ref="table"
        size="small"
        rowKey="id"
        bordered
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        :columns="columns"
        :data="loadData"
        :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
      >
      </s-table>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { exportPDF, exportPDFList, exportExcel, exportExcelList } from '@/api/onsite/upload'
import { formStatusLabel, formStatusArray } from '@/api/common'
import { handleQueryButton } from '@/api/userMenu'
import { queryElectricityFacility,queryElectricity } from '@/api/onsite/equipLedger'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  computed: {
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
          title: '合同编号',
          dataIndex: 'contract_num',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'contract_num'
          },
          onFilter: (value, record) => record.contract_num.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '验收日期',
          dataIndex: 'check_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'check_date'
          },
          onFilter: (value, record) => record.check_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.check_date.split('-').join('') - b.check_date.split('-').join('')
        },
        {
          title: '唯一标识',
          dataIndex: 'unique_number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'unique_number'
          },
          onFilter: (value, record) => record.unique_number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                 this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '来源',
          dataIndex: 'source',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'source'
          },
          onFilter: (value, record) => record.source.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: '220px',
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
          title: '规格',
          dataIndex: 'spec',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'spec'
          },
          onFilter: (value, record) => record.spec.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '编号',
          dataIndex: 'num',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'num',
          },
          onFilter: (value, record) => record.num.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '初始读数',
          dataIndex: 'initial_number',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'initial_number',
          },
          onFilter: (value, record) => record.initial_number.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '倍率',
          dataIndex: 'multiplying_power',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'multiplying_power',
          },
          onFilter: (value, record) => record.multiplying_power.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '生产厂家',
          dataIndex: 'product_org',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'product_org',
          },
          onFilter: (value, record) => record.product_org.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
        },
        {
          title: '使用部位',
          dataIndex: 'use_site',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'use_site'
          },
          onFilter: (value, record) => record.use_site.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '使用单位',
          dataIndex: 'use_org',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'use_org'
          },
          onFilter: (value, record) => record.use_org.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '安装单位',
          dataIndex: 'install_org',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'install_org'
          },
          onFilter: (value, record) => record.install_org.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '验收结论',
          dataIndex: 'check_result',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'check_result'
          },
          onFilter: (value, record) => record.check_result.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
      ]
    }, 
  },
  data () {
    return {
      classChange:[],
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      startRange: [],
      endRange: [],
      formStatusArray: formStatusArray,
      title: '盘点单',
      mdl: {},
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

        let that=this
        // parameter
        return queryElectricityFacility(Object.assign(parameter, this.queryParam
              ,{scope_code:this.$store.state.menu_key||0})).then(res => {
            res.responseList = res.responseList.map((x, index)=> {
              x['children']=[]
              that.getList(x)
              x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
              for (let key in x) {
                const isTrue = x[key] === '' || x[key] === undefined || x[key] === null
                if (isTrue) {
                  x[key] = '--'
                }
              }
              if (x.is_approve === 1) {
                if (x.status == 10040003 || x.status == 10040002) {
                  x.status = 10040006
                }
              }
              if (x.flag !== 0) {
                this.classChange[index] = 'read-after'
              } else {
                this.classChange[index] = ''
              }
              return x
            })
          console.log("===res.responseList===")
          console.log(res.responseList)
          this.dataSource = res.result ? res.result.data : res.responseList
          return res.result || { data: res.responseList }
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
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      }
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
      this.orgparam = {
        menu_id: 39,
        creator_org_id: this.$store.state.menu_key
      }
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
    async getList(x){
      const res = await queryElectricity({ code: x.code })
      x['children']=res.responseList
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
      this.queryParam.begin_check_date = range[0]
      this.queryParam.end_check_date = range[1]
    },
    onChangeStartDate (date, startRange) {
      this.queryParam.begin_check_at = startRange[0]
      this.queryParam.end_check_at = startRange[1]
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
      if (col === 'accept_date' || col === 'check_at') {
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
