<template>
  <div>
    <div class="table-operator" :style="{ 'margin-bottom': advanced ? '24px' : 0 }">
      <!-- 菜单按钮列表 -->
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay" @click="exportTable">
            <a-menu-item key="export-all">
              <a-icon :type="item.icon" />全部
            </a-menu-item>
            <a-menu-item key="export-selected">
              <a-icon :type="item.icon" />已选择
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
      </span>-->
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
    </div>-->

    <!-- 材料配置数据列表 -->
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        class="custom-filter-dropdown"
      >
        <a-input
          v-ant-ref="c => searchInput = c"
          :placeholder="`搜索${column.title}`"
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
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 + (current - 1) * 10 }}</span>

      <!-- 新搜索页面 -->
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}"
        class="custom-filter-dropdown"
      >
        <a-range-picker
          v-if="column.dataIndex==='purchase_org'||column.dataIndex==='xxx'"
          v-ant-ref="c => searchData = c"
          v-model="range "
          @change="onChange"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-select
          v-else-if="column.dataIndex==='contract_no'"
          v-ant-ref="c => searchSelect = c"
          v-model="queryParam.contract_no"
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
        </a-select>
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
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <span slot="serial" slot-scope="text, record, index" :key="index">{{ index + 1 }}</span>
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
import { getRoleList } from '@/api/manage'
import { handleProcurement, exportToExcel } from '@/api/pricepool/procurement'
// import XLSX from 'xlsx'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  components: {
    STable
  },
  computed: {
    fields() {
      const fields = {}

      this.columns.forEach(col => {
        if (col.dataIndex === 'operation' || !col.dataIndex) return
        fields[col.title] = col.dataIndex
      })

      return fields
    }
  },
  data() {
    return {
      title: '设备采购价格库',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      searchInput: null,
      // 表头
      range: [],
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_name'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格',
          dataIndex: 'spec',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'spec'
          },
          onFilter: (value, record) => record.spec.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '型号',
          dataIndex: 'type',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'type'
          },
          onFilter: (value, record) => record.type.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '随机工具',
          dataIndex: 'accessory',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'accessory'
          },
          onFilter: (value, record) => record.accessory,
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '采购单位',
          dataIndex: 'purchase_org',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'purchase_org'
          },
          onFilter: (value, record) => record.purchase_org,
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '供货单位',
          dataIndex: 'supplier_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supplier_name'
          },
          onFilter: (value, record) => record.supplier_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contract_no',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'contract_no'
          },
          onFilter: (value, record) => record.contract_no.includes(value),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchSelect.focus()
              }, 0)
            }
          }
        },
        {
          title: '合同履约开始日期',
          dataIndex: 'start_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'start_date'
          },
          onFilter: (value, record) => record.start_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '计税方式',
          dataIndex: 'tax_type',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'tax_type'
          },
          onFilter: (value, record) => record.tax_type.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '计量单位',
          dataIndex: 'unit',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'unit'
          },
          onFilter: (value, record) => record.unit.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '税率',
          dataIndex: 'tax_rate',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'tax_rate'
          },
          onFilter: (value, record) => record.tax_rate.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '税额',
          dataIndex: 'tax_fee',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'tax_fee'
          },
          onFilter: (value, record) => record.tax_fee.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '不含税单价',
          dataIndex: 'price_without_tax',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'price_without_tax'
          },
          onFilter: (value, record) => record.price_without_tax.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '含税单价',
          dataIndex: 'price_with_tax',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'price_with_tax'
          },
          onFilter: (value, record) => record.price_with_tax.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manufacturer'
          },
          onFilter: (value, record) => record.manufacturer.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        }
        // {
        //   title: '审批时间',
        //   dataIndex: 'xxx',
        //   scopedSlots: { customRender: 'xxx' },
        // scopedSlots: {
        //   filterDropdown: 'filterDropdown',
        //   filterIcon: 'filterIcon',
        //   customRender: 'customRender',
        // },
        // onFilter: (value, record) => record.xxx.toLowerCase().includes(value.toLowerCase()),
        // onFilterDropdownVisibleChange: (visible) => {
        //   if (visible) {
        //     setTimeout(() => {
        //       this.searchData.focus()
        //     },0)
        //   }
        // },

        // }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '150px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
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
        return handleProcurement(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
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
        // {
        //   key: 'btn-1',
        //   icon: 'plus',
        //   title: '新建',
        //   type: 'primary',
        //   func: () => this.handleEdit()
        // },
        // {
        //   key: 'btn-2',
        //   icon: 'form',
        //   title: '编辑',
        //   type: 'primary',
        //   func: () => this.handleEdit(true)
        // },
        // {
        //   key: 'btn-3',
        //   icon: 'delete',
        //   title: '删除',
        //   type: 'primary',
        //   func: () => this.remove()
        // },
        // {
        //   key: 'btn-4',
        //   icon: 'check',
        //   title: '提交',
        //   type: 'primary',
        //   func: () => this.submit()
        // },
        // {
        //   key: 'btn-5',
        //   icon: 'backward',
        //   title: '取回',
        //   type: 'primary',
        //   func: () => this.cancel()
        // },
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
      ]
    }
  },
  created() {
    getRoleList({ t: new Date() })
  },
  methods: {
    onChange(date, range) {
      this.queryParam.begin_purchase_org = range[0]
      this.queryParam.end_purchase_org = range[1]
    },
    handleSearch(selectedKeys, confirm, col) {
      confirm()
      //  this.queryParam.equip_name = selectedKeys[0]
      //   this.queryParam.type = selectedKeys[0]
      //  this.queryParam.contract_no= selectedKeys[0]
      //   // this.queryParam.start_date= selectedKeys[0]
      //  this.queryParam.xxx= selectedKeys[0]
      console.log(selectedKeys)
      if (col) this.refresh(true)
      this.queryParam.name = selectedKeys[0]
    },
    handleReset(clearFilters, col) {
      clearFilters()
      // this.queryParam.equip_name = ''
      // this.queryParam.type = ''
      // this.queryParam.purchase_org = ''
      // this.queryParam.supplier_name= ''
      // this.queryParam.contract_no=''
      // this.queryParam.start_date=''
      // this.queryParam.xxx=''
      this.queryParam.name = ''
      col === 'purchase_org' && (this.range = [])
    },
    handleEdit(bool) {
      if (bool)
        if (this.selectedRows.length === 0 || this.selectedRows.length > 1)
          return this.noSelect('请选择一条记录进行编辑')
      this.$emit('onEdit', bool ? this.selectedRows[0] : null)
    },

    handleOk() {},

    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    resetSearchForm() {
      this.queryParam = {
        name: moment(new Date())
      }
    },

    onSearch(value) {
      // if (!value) return
      this.queryParam.name = value.trim()
      this.refresh(true)
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

      exportToExcel({
        details: e.key === 'export-all' ? this.dataSource.map(d => d.id) : this.selectedRowKeys,
        flag: 0
      }).then(res => {
        FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.xls`)
      })
    },

    // remove () {
    //   if (this.selectedRows.length === 0) return this.noSelect()
    //   const selectedRowKeys = this.selectedRowKeys
    //   const that = this

    //   this.$confirm({
    //     title: '提示',
    //     content: '确定删除已选择的记录?',
    //     okType: 'danger',
    //     onOk () {
    //       return handleProcurement({ ids: selectedRowKeys }, 'delete').then(res => res.status === '0' && that.refresh(true))
    //     },
    //     onCancel () { }
    //   })
    // },

    // submit () {
    //   if (this.selectedRows.length === 0) return this.noSelect()
    //   const that = this

    //   this.$confirm({
    //     title: '提示',
    //     content: '确定提交已选择的记录?',
    //     onOk () {
    //       return handleProcurement({ ids: that.selectedRowKeys, flag: 0 }, 'submit').then(res => res.status === '0' && that.refresh(true))
    //     },
    //     onCancel () { }
    //   })
    // },

    // cancel () {
    //   if (this.selectedRows.length === 0) return this.noSelect()
    //   const that = this

    //   this.$confirm({
    //     title: '提示',
    //     content: '确定取回已选择的记录?',
    //     onOk () {
    //       return handleProcurement({ ids: that.selectedRowKeys }, 'cancel').then(res => res.status === '0' && that.refresh(true))
    //     },
    //     onCancel () { }
    //   })
    // },

    refresh(bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
      this.selectedRowKeys = []
      this.selectedRows = []
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
