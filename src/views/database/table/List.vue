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
        <!-- <download-excel
          v-if="item.title === '导出'"
          :data="dataSource"
          :fields="fields"
          :name="`${title || 'data'}列表.xls`"
          style="display: inline;"
        >
          <a-button
            class="menu-button"
            :type="item.type"
            :icon="item.icon"
          >
            {{ item.title }}
          </a-button>
        </download-excel> -->
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
          placeholder="输入文档名称查询"
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
    <div class="table-page-search-wrapper">
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
    </div>

    <!-- 资料库数据列表 -->
    <s-table
      bordered
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
    >
      <span
        slot="serial"
        slot-scope="text, record, index"
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
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import { getRoleList } from '@/api/manage'
import { handleDatabase } from '@/api/database/database'
import { exportToExcel } from '@/api/common'
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
    }
  },
  data () {
    return {
      a: [],
      title: '资料库列表',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '文档名称',
          dataIndex: 'doc_name'
        },
        {
          title: '文件类型',
          dataIndex: 'dic_enum_name'
        },
        {
          title: '发文机构',
          dataIndex: 'issuer'
        },
        {
          title: '发布日期',
          dataIndex: 'issue_date'
        },
        {
          title: '实施日期',
          dataIndex: 'avail_date'
        },
        {
          title: '上传单位',
          dataIndex: 'upload_org_name'
        },
        {
          title: '上传人',
          dataIndex: 'upload_user_name'
        },
        {
          title: '上传日期',
          dataIndex: 'upload_date'
        },
        {
          title: '单据编号',
          dataIndex: 'serial_number'
        }
      ],
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return handleDatabase(Object.assign(parameter, { name: this.queryParam.name }), 'retrieve').then(res => {
          this.dataSource = res.responseList ? res.responseList : res.responsePageInfo.list

          return res.result || { pageSize: res.responsePageInfo.pageSize, pageNo: res.responsePageInfo.pageNum, totalPage: res.responsePageInfo.pages, totalCount: res.responsePageInfo.total, data: res.responsePageInfo.list }
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
      // 菜单按钮
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
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.exportTable()
        },
        {
          key: 'btn-5',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.printTable()
        },
        {
          key: 'btn-6',
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
      console.log(type)
      // return statusMap[type].text
    },
    statusTypeFilter (type) {
      // console.log(type)
      // return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
  },
  methods: {
    handleEdit (bool) {
      if (bool) if (this.selectedRows.length === 0 || this.selectedRows.length > 1) return this.noSelect()
      this.$emit('onEdit', bool ? this.selectedRows[0] : null)
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
      this.queryParam.name = value.trim()
      this.refresh(true)
    },

    exportTable (e) {
      if (this.selectedRows.length === 0) return this.noSelect()
      
      exportToExcel({ details: e.key === 'export-all' ? this.dataSource.map(d => d.id) : this.selectedRowKeys, flag: 0 })
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
        documentTitle: '业务管理系统'
      })
    },

    remove () {
      console.log(this.a)
      if (this.selectedRows.length === 0) return this.noSelect()
      const selectedRowKeys = this.selectedRowKeys
      const that = this

      this.$confirm({
        title: '提示',
        content: '确定删除已选择的记录?',
        okType: 'danger',
        onOk () {
          return handleDatabase({ ids: selectedRowKeys }, 'delete').then(res => res.status === '0' && that.refresh(true))
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
          const promises = selectedRows.map(row => {
            return handleDatabase(row, 'cancel')
          })

          Promise.all(promises)
            .finally(() => that.refresh(false))
        },
        onCancel () { }
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
