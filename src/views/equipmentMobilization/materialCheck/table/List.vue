<template>
  <div>
    <div class="table-operator" :style="{ 'margin-bottom': advanced ? '24px' : 0 }">
      <!-- 菜单按钮列表 -->
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay">
            <a-sub-menu title="PDF">
              <a-menu-item key="exportList-pdf" @click="exportTable">导出列表</a-menu-item>
              <a-menu-item key="exportAll-pdf" @click="exportTable">导出全部(详情)</a-menu-item>
              <a-menu-item key="exportChecked-pdf" @click="exportTable">导出已选(详情)</a-menu-item>
            </a-sub-menu>
            <a-sub-menu title="EXCEL">
              <a-menu-item key="exportList-excel" @click="exportTable">导出列表</a-menu-item>
              <a-menu-item key="exportAll-excel" @click="exportTable">导出全部(详情)</a-menu-item>
              <a-menu-item key="exportChecked-excel" @click="exportTable">导出已选(详情)</a-menu-item>
            </a-sub-menu>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>

        <a-dropdown v-else-if="item.title === '打印'">
          <a-menu slot="overlay" @click="printTable">
            <a-menu-item key="print-all">
              <a-icon type="printer" />全部
            </a-menu-item>
            <a-menu-item key="print-selected">
              <a-icon type="printer" />已选择
            </a-menu-item>
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
        >{{ item.title }}</a-button>
      </span>
    </div>
    <br />

    <!-- 临时设施安拆申请数据列表 -->
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
      <a
        :class="classChange[index]"
        slot="serial_number"
        slot-scope="text, record, index"
        @click="clickEdit(text,index)"
        href="javascript:;"
      >{{ text }}</a>
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}"
        class="custom-filter-dropdown"
      >
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker
          v-if="column.dataIndex==='item_check_date'"
          v-model="range "
          @change="onChange"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-range-picker
          v-else-if="column.dataIndex==='check_at'"
          v-model="range2"
          @change="onChange2"
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
      <span slot="status" slot-scope="text">{{ text | statusFilter }}</span>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import { getRoleList } from '@/api/manage'
import { handlePurchase, exportPDF, exportPDFList, exportExcel, exportExcelList } from '@/api/equipmentMobilization/materialCheck'
import { formStatusLabel, formStatusArray } from '@/api/common'
import { mapGetters } from 'vuex'
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
          dataIndex: 'serial',
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
          }
        },
        // {
        //   title: '点验单位',
        //   dataIndex: 'item_check_org',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender',
        //   },
        //   onFilter: (value, record) => record.item_check_org.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        {
          title: '供应商名称',
          dataIndex: 'supplier_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.supplier_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchData.focus()
              }, 0)
            }
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contract_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.contract_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '点验日期',
          dataIndex: 'item_check_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.item_check_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.item_check_date.split('-').join('') - b.item_check_date.split('-').join('')
        },
        {
          title: '收入不含税金额合计',
          align: 'right',
          dataIndex: 'amount'
        },
        {
          title: '状态',
          dataIndex: 'status',
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
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
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
      title: '设备材料点验单',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      classChange: [],
      range: [],
      range2: [],
      customFilterColumn: {},
      filteredInfo: null,
      formStatusArray: formStatusArray,
      dataSource: [],
      orgparam: {
        scope_code: this.$store.state.menu_key,
        menu_id: '34'
      },
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
        if (!this.$store.state.menu_key) this.orgparam.scope_code = this.$store.state.user.first_key

        return handlePurchase(Object.assign(parameter, this.queryParam, this.orgparam), 'retrieve').then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index) => {
            x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
            if (x.check_user_name === null) {
              x.check_user_name = '--'
            }
            if (x.check_at === null) {
              x.check_at = '--'
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
          func: () => { this.queryParam = {}; this.range = []; this.startRange = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      }
    }
  },
  filters: {
    statusFilter (type) {
      return formStatusLabel[type]
    }
  },
  watch: {
    $route (to, from) {
      if (from.path === '/equipmentMobilization/materialCheckNew' || from.path === '/equipmentMobilization/materialCheckEdit') {
        this.refresh(true)
      }
    }
  },
  created () {
    setTimeout(() => {
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '34'
      }).then(res => {
        this.menuBtns = this.menuBtns.map(x => {
          const arr = res.responseList.filter(y => y.menu_button_code === x.key)
          arr[0] && (x.id = arr[0].id)
          return x
        })
        this.$refs.table.refresh(true)
      })
    }, 0)
  },
  methods: {
    ...mapGetters(['nickname']),
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onChange (date, range) {
      this.queryParam.begin_item_check_date = range[0]
      this.queryParam.end_item_check_date = range[1]
    },
    onChange2 (date, range2) {
      this.queryParam.begin_check_at = range2[0]
      this.queryParam.end_check_at = range2[1]
    },
    clickEdit (text, index) {
      // const arr = this.dataSource.filter(x => x.serial_number === text)
      const arr = this.dataSource[index]
      this.selectedRows[0] = arr
      this.handleRead()
    },
    handleRead () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行查看')
      this.$emit('onDetail', { ...this.selectedRows[0], type: 'read' })
    },
    handleDetail () {
      if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect('请选择一条记录进行审批')
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].status !== 10040006) {
          this.noSelect('该状态的记录不能进行审批')
          return
        }
      }
      this.$emit('onDetail', this.selectedRows[0])
    },
    handleSearch (selectedKeys, confirm, col) {
      if (col === 'item_check_date' || col === 'check_at') {
        this.refresh(true)
      } else {
        confirm()
      }
    },
    handleReset (clearFilters, col) {
      if (col === 'item_check_date' || col === 'check_at') {
        this.queryParam = {}
        this.range = []
        this.range2 = []
        this.refresh(true)
      } else {
        clearFilters()
      }
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
        this.$router.push({ name: 'materialCheckEdit', params: this.selectedRows[0] })
      } else {
        return this.$router.push({ name: 'materialCheckNew', params: { type: 1 } })
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

    onSearch (value) {
      this.queryParam.creator_user_name = value.trim()
      this.refresh(true)
    },
    exportTable (e) {
      if (e.key == 'exportChecked-pdf' && this.selectedRows.length === 0) return this.noSelect()
      if (e.key == 'exportChecked-excel' && this.selectedRows.length === 0) return this.noSelect()
      if (e.key === 'exportList-pdf') {
        exportPDFList({
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'exportAll-pdf') {
        exportPDF({
          temp: 0,
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'exportChecked-pdf') {
        exportPDF({
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream' }), `${this.title || 'data'}列表.pdf`)
        })
      }
      if (e.key === 'exportList-excel') {
        exportExcelList({
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
        })
      } else if (e.key === 'exportAll-excel') {
        exportExcel({
          temp: 0,
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
        })
      } else if (e.key === 'exportChecked-excel') {
        exportExcel({
          details: this.selectedRowKeys
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: 'application/octet-stream;charset=utf-8' }), `${this.title || 'data'}列表.xls`)
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

      const deldata = this.dataSource.filter(item => {
        return item.id === selectedRowKeys[0]
      })
      if (this.selectedRows.length === 1) {
        // if (deldata[0].dic_enum_name === '已提交' || deldata[0].dic_enum_name === '已接收' || deldata[0].dic_enum_name === '审批完成') {
        if (deldata[0].dic_enum_name !== '已保存') {
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
          return handlePurchase({ details: that.selectedRowKeys, flag: 0, menu_id: 34 }, 'delete').then(
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
          ).catch((err) => {
            that.refresh(true)
          })
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
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return handlePurchase({ details: that.selectedRowKeys, flag: 0, menu_id: 34 }, 'submit').then(res => {
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
          }).catch((err) => {
            that.refresh(true)
          })
        },
        onCancel () { }
      })
    },

    cancel () {
      if (this.selectedRows.length === 0) return this.noSelect()
      const that = this
      if (this.selectedRows.length === 1) {
        if (this.selectedRows[0].dic_enum_name !== '已提交' && this.selectedRows[0].dic_enum_name !== this.nickname()) {
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
          return handlePurchase({ details: that.selectedRowKeys, menu_id: 34 }, 'cancel').then(res => {
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
          }).catch((err) => {
            that.refresh(true)
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
