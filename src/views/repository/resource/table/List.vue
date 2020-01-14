<template>
  <div>
    <div class="table-operator" :style="{ 'margin-bottom': advanced ? '24px' : 0 }">
      <!-- 菜单按钮列表 -->
      <span v-for="item in menuBtns" :key="item.key">
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
        >{{ item.title }}</a-button>
      </span>
    </div>
    <br />

    <!-- 数据列表 -->
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
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        class="custom-filter-dropdown"
      >
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex === 'buckle_time'"
          v-model="range"
          @change="onChangeDate"
          style="width: 218px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex === 'planned_return_time'"
          v-model="startRange"
          @change="onChangeStartDate"
          style="width: 218px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex === 'expire'"
          v-model="expireRange"
          @change="onExpireDate"
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
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'buckle_time' ? 15 : 0}px`"
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
      <ellipsis slot="reason" slot-scope="text" :length="20" tooltip>{{ text }}</ellipsis>
      <span slot="status" slot-scope="text">{{ text | statusFilter }}</span>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { handlePurchase,exportToExcel} from '@/api/repository/resource'
import { formStatusLabel, formStatusArray } from '@/api/common'
import { handleQueryButton } from '@/api/userMenu'
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
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          dataIndex: 'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '管理号码',
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
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        // {
        //   title: '编制单位',
        //   dataIndex: 'creator_org_name'
        // },
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
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          scopedSlots: {
            customRender: 'spec'
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          scopedSlots: {
            customRender: 'unit'
          }
        },
        // {
        //   title: '来源',
        //   dataIndex: 'source',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender'
        //   },
        //   onFilter: (value, record) => record.source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '技术状态',
        //   dataIndex: 'status',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender',
        //   },
        //   onFilter: (value, record) => record.status.includes(value),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchSelect.focus()
        //       }, 0)
        //     }
        //   },
        // },
        // {
        //   title: '退场日期',
        //   dataIndex: 'out_date',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender',
        //   },
        //   onFilter: (value, record) => record.out_date,
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchData.focus()
        //       }, 0)
        //     }
        //   },
        // },

        {
          title: '所在项目',
          dataIndex: 'project',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'project',
          },
          onFilter: (value, record) => record.project.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          },
        },
        {
          title: '所在地',
          dataIndex: 'location',
          scopedSlots: {
            customRender: 'location',
          }
        },
        // {
        //   title: '联系人',
        //   dataIndex: 'contact_person',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender',
        //   },
        //   onFilter: (value, record) => record.contact_person.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   },
        // },
        // {
        //   title: '联系电话',
        //   dataIndex: 'telephone',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender',
        //   },
        //   onFilter: (value, record) => record.telephone.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   },
        // },
        {
          title: '原值',
          dataIndex: 'original_value',
          scopedSlots: {
            customRender: 'original_value',
          }
        },
        {
          title: '净值',
          dataIndex: 'net_value',
          scopedSlots: {
            customRender: 'net_value',
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: {
            customRender: 'remark',
          }
        },
      ]
    }
  },
  data () {
    return {
      classChange: [],
      filteredInfo: null,
      customFilterColumn: {},
      range: [],
      startRange: [],
      expireRange: [],
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
        if (!this.$store.state.menu_key) this.orgparam.scope_code = this.$store.state.user.first_key

        // parameter
        return handlePurchase(Object.assign(parameter, this.queryParam, this.orgparam), 'retrieve').then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index) => {
            x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
            if (x.check_user_name === null) {
              x.check_user_name = '--'
            }
            if (x.planned_return_time === null) {
              x.planned_return_time = '--'
            }
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
      orgparam: {
        menu_id: 80,
        scope_code: this.$store.state.menu_key || 0
      },
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
          func: () => { this.queryParam = {}; this.range = []; this.startRange = []; this.expireRange = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
        // console.log('Various parameters', pagination, filters, sorter, 33333233)
        this.filteredInfo = filters
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/equipmentMobilization/vehicleLedger') {
        this.refresh(true)
      }
    }
  },
  created () {
    setTimeout(() => {
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '80'
      }).then(res => {
        // console.log(res)
        this.menuBtns = this.menuBtns.map(x => {
          const arr = res.responseList.filter(y => y.menu_button_code === x.key)
          arr[0] && (x.id = arr[0].id)
          return x
        })
        this.$refs.table.refresh(true)
      })
    }, 0)
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
      // console.log(selectedRowKeys, '---', selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    onChangeDate (date, range) {
      this.queryParam.begin_buckle_time = range[0]
      this.queryParam.end_buckle_time = range[1]
    },
    onChangeStartDate (date, startRange) {
      this.queryParam.begin_planned_return_time = startRange[0]
      this.queryParam.end_planned_return_time = startRange[1]
    },
    onExpireDate (date, expireRange) {
      this.queryParam.begin_expire = expireRange[0]
      this.queryParam.end_expire = expireRange[1]
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
          menu_id: 80
        }).then(res => {
          console.log(res)
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'export-excellist') {
        exportExcelList({
          menu_id: 80
        }).then(res => {
          console.log(res)
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }
    },

    exportTable (e) {

      if (e.key === 'export-pdf') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportPDF({
          details: this.selectedRowKeys,
          flag: 0,
          menu_id: 80
        }).then(res => {
          console.log(res)
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
          flag: 0,
          menu_id: 80
        }).then(res => {
          console.log(res)
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      } else if (e.key === 'export-excelall') {
        exportExcel({
          flag: 1,
          menu_id: 80
        }).then(res => {
          console.log(res)
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      } else if (e.key === 'export-pdfall') {
        exportPDF({
          flag: 1,
          menu_id: 80
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
        })
      }

      // if (e.key !== 'export-all' && this.selectedRows.length === 0) return this.noSelect()

      // if (e.key === 'export-pdf') {
      //   exportPDF({
      //     details: this.selectedRowKeys,
      //     menu_id: 80
      //   }).then(res => {
      //     if (this.selectedRowKeys.length === 1) {
      //       FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
      //     } else if (this.selectedRowKeys.length > 1) {
      //       FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
      //     }
      //   })
      // } else if (e.key === 'export-excel') {
      //   exportExcel({
      //     details: this.selectedRowKeys,
      //     menu_id: 80
      //   }).then(res => {
      //     FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
      //   })
      // }
    },

    remove () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const selectedRowKeys = this.selectedRowKeys
      const that = this

      const deldata = this.dataSource.filter(item => {
        return item.id === selectedRowKeys[0]
      })
      if (this.selectedRows.length === 1) {
        if (deldata[0].dic_enum_name === '已提交' || deldata[0].dic_enum_name === '已接收' || deldata[0].dic_enum_name === '审批完成') {
          this.noSelect('该状态无法删除！')
          this.$refs.table.clearSelected()
          return
        }
      }
      this.$confirm({
        title: '提示',
        content: `是否确定删除已选择的记录?注意:(非已保存状态的记录不可删除)`,
        okType: 'danger',
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return handlePurchase({ details: that.selectedRowKeys, flag: 0, menu_id: 80 }, 'delete').then(
            res => {
              if (res.responseList.length !== 0) {
                const subdata = []
                for (var i = 0; i < that.selectedRows.length; i++) {
                  for (var j = 0; j < res.responseList.length; j++) {
                    if (that.selectedRows[i].id === res.responseList[j]) {
                      subdata.push(that.selectedRows[i].serial_number)
                    }
                  }
                }
                that.noSelect(`编号${subdata.join()}删除失败`)
                that.refresh(true)
              } else {
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

      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '已保存') {
          console.log('121233---', this.selectedRows)
          this.noSelect('该状态的记录无法提交！')
          this.$refs.table.clearSelected()
          return
        }
      }
      this.$confirm({
        title: '提示',
        content: `是否确定提交已选择的记录?  注意:(只有已保存的记录可以提交)`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return handlePurchase({ details: that.selectedRowKeys, flag: 0, menu_id: 80 }, 'submit').then(res => {
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
          return handlePurchase({ details: that.selectedRowKeys, menu_id: 80 }, 'cancel').then(res => {
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
    },

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      if (col === 'buckle_time' || col === 'planned_return_time' || col === 'expire') {
        this.refresh(true)
      } else {
        confirm()
      }
    },

    handleReset (clearFilters, col) {
      if (col === 'buckle_time' || col === 'planned_return_time' || col === 'expire') {
        this.range = []
        this.startRange = []
        this.expireRange = []
        this.queryParam = {}
        this.refresh(true)
      } else {
        clearFilters()
      }
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
