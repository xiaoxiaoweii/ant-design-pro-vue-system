<template>
  <a-modal
    title="添加授权人员"
    style="minHeight: 600px"
    :width="1280"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-row :gutter="8">
      <a-col :span="6" style="overflow: auto; max-height: 550px">
        <a-input-search style="margin-bottom: 8px" placeholder="关键字搜索" @change="onSearch" />
        <a-tree :treeData="hrTree" @select="selectItem">
          <span slot="title" slot-scope="{ name }">{{ name }}</span>
        </a-tree>
      </a-col>
      <a-col :span="18">
        <a-spin :spinning="confirmLoading">
          <a-table
            ref="tables"
            size="small"
            :columns="columns"
            :dataSource="dataSource"
            :rowSelection="{
              selectedRowKeys: checkedKeys,
              onChange: onChange,
              onSelect: onSelect,
              onSelectAll: onSelectAll,
              type: orgType
            }"
            :pagination="{showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
            rowKey="id"
            bordered
            :loading="aLoading"
          >
            <span
              slot="serial"
              slot-scope="text, record, index"
            >{{ index + 1 }}</span>
            <template slot="type" slot-scope="text">
              <span>{{ text | types }}</span>
            </template>
          </a-table>
          <!-- <s-table
            ref="tables"
            size="small"
            rowKey="id"
            bordered
            :pageSize="15"
            :scroll="{ y: 500 }"
            :columns="columns"
            :data="loadData"
            :alert="false"
            :rowSelection="{selectedRowKeys: checkedKeys, onChange: onChange, type: 'radio'}"
            :pagination="{ showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条` }"
          >-->
          <!-- <div
              slot="filterDropdown"
              slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
              class="custom-filter-dropdown"
            >
              <a-range-picker
                v-if="column.dataIndex === 'contract_sign_date'"
                v-model="range"
                @change="onChangeDate"
                style="width: 218px; margin-bottom: 8px; display: block;"
              />
              <a-range-picker
                v-else-if="column.dataIndex === 'acceptance_date'"
                v-model="checkRange"
                @change="onChangeCheckDate"
                style="width: 218px; margin-bottom: 8px; display: block;"
              />
              <a-input
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
                :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
              >查询</a-button>
              <a-button
                @click="() => handleReset(clearFilters, column.dataIndex)"
                size="small"
                style="width: 90px"
              >重置</a-button>
          </div>-->
          <!-- <a-icon
              slot="filterIcon"
              slot-scope="filtered"
              type="search"
              :style="{ color: filtered ? '#108ee9' : undefined }"
          />-->
          <!-- <span
              slot="serial"
              slot-scope="text, record, index"
            >{{ index + 1 + (current - 1) * currentSize }}</span>
            <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
          </s-table>-->
          <!-- <a-table
            ref="tables"
            size="small"
            rowKey="id"
            bordered
            :pageSize="15"
            :scroll="{ y: 500 }"
            :columns="columns"
            :data="dataSource"
            :alert="false"
            :rowSelection="{selectedRowKeys: checkedKeys, onChange: onChange, type: 'radio'}"
            :pagination="{ showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条` }"
          >
            <span
              slot="serial"
              slot-scope="text, record, index"
            >{{ index + 1 + (current - 1) * currentSize }}</span>
            <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
          </a-table>-->
        </a-spin>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { batchAddUser } from '@/api/permission'
import { handleStationtree, getUsers } from '@/api/common'
import { STable } from '@/components'
import { mapGetters } from 'vuex'

const ORG_TYPES = {
  unit: 1, // 单位
  department: 2, // 部门
  post: 3 // 岗位
}

export default {
  name: 'HRModal',
  components: {
    STree,
    STable
  },
  computed: {
    hrTree () {
      const ret = []
      this.hrList.forEach(org => {
        const o = this.containSearch(org)
        if (o) ret.push(o)
      })
      return ret
    },
    orgType () {
      return this.record ? (this.record.type === ORG_TYPES.department ? 'radio' : 'checkbox') : 'checkbox'
    }
  },
  data () {
    return {
      parameter: {
        pageSize: 10,
        pageNum: 1
      },
      aLoading: false,
      queryParam: {},
      currentNode: null,
      checkedKeys: [],
      checkedRows: [],
      dataSource: [],
      search: '',
      record: null,
      visible: false,
      confirmLoading: false,
      columns: [
        {
          title: '序号',
          align: 'center',
          width: 70,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 120,
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'name'
          },
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '性别',
          dataIndex: 'gender',
          width: 120,
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) => record.gender.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        // {
        //   title: '人员类别',
        //   dataIndex: 'category',
        //   width: 120,
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender'
        //   },
        //   onFilter: (value, record) => record.category.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: visible => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '岗位状态',
        //   dataIndex: 'positionStatus',
        //   width: 120,
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'customRender'
        //   },
        //   onFilter: (value, record) => record.positionStatus.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: visible => {
        //     if (visible) {
        //       setTimeout(() => {
        //         this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // }
      ],
      hrList: [],
      onChange: (selectedRowKeys, selectedRows) => {
        this.checkedKeys = selectedRowKeys
        this.checkedRows = selectedRows
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect: (record, selected, selectedRows) => {
        this.currentNode = record
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        return getUsers(Object.assign(parameter, this.queryParam)).then(res => {
          // 索引
          res.responsePageInfo.pageNum && (this.current = res.responsePageInfo.pageNum)
          res.responsePageInfo.pageSize && (this.currentSize = res.responsePageInfo.pageSize)
          console.log(res)
          res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
            // x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
            if (x.gender === 1) {
              x.gender = '男'
            } else if (x.gender === 2) {
              x.gender = '女'
            }
            return x
          })

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
      }
    }
  },
  methods: {
    ...mapGetters(['nickname']),

    getPerson () {
      this.aLoading = true
      getUsers(Object.assign(this.parameter, this.queryParam)).then(res => {
        this.dataSource = res.responseList
        this.dataSource.forEach(x => {
          if (x.gender === 1) x.gender = '男'
          if (x.gender === 2) x.gender = '女'
        })
        this.aLoading = false
      })
    },

    add (record) {
      this.record = Object.assign({}, record)
      this.edit(record)
      this.getPerson()
    },
    edit (record) {
      handleStationtree().then(res => {
        this.hrList = [this.dealTree(res.responseObject)]
        // getPermissionUserAndStation({
        //   pageNum: 1,
        //   pageSize: record.totalCount,
        //   scope_code: record.scope_code
        // }).then(res => {
        //   if (res.status === '0') {
        //     this.checkedKeys = res.responsePageInfo.list.filter(item => item.is_flag === '0').map(item => item.user_station_id)
        //   }
        // })
      })
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      if (!this.checkedKeys.length) return this.$message.warning('请选择人员记录')
      if (this.checkedRows[0].name === this.nickname()) return this.$message.warning('不能对自己进行授权')
      console.log(this.checkedRows)
      this.confirmLoading = true
      batchAddUser({
        menu_id: 83,
        scope_code: this.record.scope_code,
        details: this.checkedRows.map(u => {
          return {
            user_id: u.id,
            user_name: u.name,
            is_flag: '0'
          }
        })
      }).then(res => {
        if (res.status === '0') {
          this.$message.success(res.msg)
          this.$emit('ok')
        }
      }).catch(() => {
      }).finally(() => {
        this.confirmLoading = false
        this.close()
      })
    },
    handleCancel () {
      this.close()
    },
    selectItem (keys, { node }) {
      if (keys.length > 0) {
        const data = node.dataRef
        this.queryParam = {
          id: data.id,
          type: data.type
        }
        // this.$refs.tables.refresh(true)
        this.getPerson()
      }
    },
    onSearch (e) {
      this.search = e.target.value
    },
    containSearch (menu) {
      let o = {}
      if (menu.name.toLowerCase().includes(this.search.toLowerCase())) {
        o = Object.assign({}, menu)
      }

      if (menu.children && menu.children.length) {
        const childrens = menu.children.map(c => {
          return this.containSearch(c)
        })
          .filter(c => !!c)

        if (childrens.length) {
          o = Object.assign({}, menu)
          o.children = childrens
        }
      }

      return Object.keys(o).length ? o : null
    },
    dealTree (data) {
      data.key = data.id
      data.scopedSlots = { title: 'title' }

      if (data.children) {
        data.children = data.children.map(d => {
          return this.dealTree(d)
        })
      }

      return data
    }
  },
  filters: {
    types (type) {
      const maps = {
        1: '单位',
        2: '部门',
        3: '岗位'
      }
      return maps[type]
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
/deep/ .ant-table-header {
  height: 57px;
}
/deep/ .ant-table-fixed-header .ant-table-scroll .ant-table-header {
  overflow: visible !important;
}
/deep/ .ant-table-body {
  overflow-y: visible !important;
}
</style>
