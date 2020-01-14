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
            <a-menu-item key="export-all">
              <a-icon :type="item.icon" />全部</a-menu-item>
            <a-menu-item key="export-selected">
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

    <!-- 临时设施安拆申请数据列表 -->
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{}"
    > 
       <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters,column}" class='custom-filter-dropdown'>
         <a-range-picker
          v-if="column.dataIndex==='out_date'"
          v-ant-ref="c => searchData = c"
          v-model="range "
          @change="onChange"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-select
           v-else-if="column.dataIndex==='status'"
          v-ant-ref="c => searchSelect = c"
          v-model="queryParam.status"
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
        slot="status"
        slot-scope="text"
      >
        <a-badge
          :status="text | statusTypeFilter"
          :text="text | statusFilter"
        />
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
import { handlePurchase,exportToExcel} from '@/api/repository/resource'
const FileSaver = require('file-saver')
const statusMap = {
  0: {
    status: 'default',
    text: '未提交'
  },
  1: {
    status: 'processing',
    text: '未审核'
  },
  2: {
    status: 'success',
    text: '已审核'
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
    }
  },
  data () {
    return {
      title: '设备资源库',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      range:[],
      columns: [
        {
          title: '序号',
          dataIndex:'serial',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '管理号码',
          dataIndex: 'equipment_management_code',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equipment_management_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          }
        },
        // {
        //   title: '编制单位',
        //   dataIndex: 'creator_org_name'
        // },
        {
          title: '名称',
          dataIndex: 'equipment_name',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.equipment_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.model.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          }
        },
        {
          title:'来源',
          dataIndex:'source',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.source.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          }
        },
        {
          title:'技术状态',
          dataIndex:'status',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.status.includes(value),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchSelect.focus()
              },0)
            }
          },
        },
        {
          title:'退场日期',
          dataIndex:'out_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter:(value,record)=>record.out_date,
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchData.focus()
              },0)
            }
          },
        },

        {
          title: '所在项目',
          dataIndex: 'org_out_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.org_out_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          },
        },
        {
          title: '所在地',
          dataIndex: 'location',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.location.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          },
        },
        {
          title: '联系人',
          dataIndex: 'contact_person',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.contact_person.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          },
        },
        {
          title: '联系电话',
          dataIndex: 'telephone',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.telephone.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          },
        },
        {
          title: '备注',
          dataIndex: 'remark_equipment',
           scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) => record.remark_equipment.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              },0)
            }
          },
        },
       
      ],
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadRequire.parameter', parameter)
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
        return handlePurchase(Object.assign(parameter, this.queryParam), 'retrieve').then(res => {
          this.dataSource = res.result ? res.result.data : res.responseList
          console.log(res)
          return res.result || { data: res.responseList }
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
          func: () => { this.queryParam = {}; this.refresh(true) }
        }
      ]
    }
  },
  filters: {
    statusFilter (type) {
      // return statusMap[type].text
    },
    statusTypeFilter (type) {
      // return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  methods: {
     onChange(date,range){
      this.queryParam.begin_create_date = range[0]
      this.queryParam.end_create_date = range[1]
    },
    handleSearch (selectedKeys, confirm,col) {
      confirm()
      console.log(selectedKeys)
      if (col) this.refresh(true)
      this.queryParam.name=selectedKeys[0]
      

    },
    handleReset (clearFilters,col) {
      clearFilters()
      this.queryParam.name=''
       col === 'create_date' && (this.range = [])
    
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
       if (this.selectedRows.length === 0) return this.noSelect()
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
    refresh (bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
      this.selectedRowKeys = []
      this.selectedRows = []
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
.table-operator {
  .menu-button {
    margin-right: 5px;
  }

  .search {
    float: right;
  }
}
</style>
