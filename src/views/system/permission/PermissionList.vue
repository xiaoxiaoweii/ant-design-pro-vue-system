<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6" style="overflow: auto; max-height: 750px">
        <a-input-search style="margin-bottom: 8px" placeholder="关键字搜索" @change="onChange" />
        <!-- :loadData="onLoadData" -->
        <a-tree class="custom-tree" :treeData="orgTree" @select="select">
          <div
            slot="title"
            slot-scope="{ scope_name, scope_code, level_number, isClick, is_flag, is_project }"
          >
            <!-- slot-scope="{ scope_name, scope_code, level_number, is_flag }" -->
            <div>
              {{ scope_name }}
              <a
                class="btn-permission"
                style="margin-left: 10px;"
                v-if="is_project === '0' && isClick !== 0"
              >
                <a-icon type="plus" @click.stop="() => add({ scope_code, type: 2, tag: 2 })" />
              </a>
              <a class="btn-permission" v-if="is_flag === '1'">
                <a-icon type="minus" @click.stop="() => reduce({ scope_code })" />
              </a>
            </div>
          </div>
        </a-tree>
      </a-col>
      <a-col :span="18">
        <!-- 菜单按钮列表 -->
        <div style="margin-bottom: 17px;">
          <span v-for="item in menuBtns" :key="item.key">
            <a-button
              class="menu-button"
              :type="item.type"
              :icon="item.icon"
              @click="item.func"
            >{{ item.title }}</a-button>
          </span>
        </div>
        <s-table
          ref="table"
          size="default"
          rowKey="user_station_id"
          bordered
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{selectedRowKeys: checkedKeys, onChange: onSelectChange}"
          :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <span slot="is_valid" slot-scope="text">{{ text | valid }}</span>
          <span slot="type" slot-scope="text">{{ text | type }}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">授权</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除?" @confirm="() => delUserOrStation(record)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <auth-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />

    <HRModal ref="hr" @ok="handleSaveOk" @close="handleSaveClose" />

    <add-modal ref="add" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { Menu } from 'ant-design-vue'
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import AuthModal from './modules/AuthModal'
import HRModal from './modules/HRModal'
import AddModal from './modules/AddModal'
import {
  getPermissionTree,
  getPermissionUserAndStation,
  delPermissionTreeNode,
  batchDelUserOrStation,
  delTreeinfo
} from '@/api/permission'
const { Item } = Menu

export default {
  name: 'TreeList',
  components: {
    STable,
    STree,
    AuthModal,
    HRModal,
    AddModal,
    Item
  },
  computed: {
    orgTree () {
      const ret = []
      this.orgList.forEach(org => {
        const o = this.containSearch(org)
        if (o) ret.push(o)
      })
      return ret
    }
  },
  data () {
    return {
      totalCount: 0, // 授权对象个数
      checkedRows: [],
      checkedKeys: [],
      orgList: [],
      openKeys: [],
      search: '',
      currentOrg: null,

      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '授权对象',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'is_flag',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '所属组织',
          dataIndex: 'user_position_name',
          scopedSlots: { customRender: 'user_position_name' }
        },
        {
          title: '授权状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'is_valid' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!this.queryParam.scope_code) {
          this.queryParam = {
            scope_code: 0
          }
        }
        return getPermissionUserAndStation(Object.assign(parameter, this.queryParam, { menu_id: 83 })).then(res => {
          this.totalCount = res.responsePageInfo.total
          return {
            pageSize: res.responsePageInfo.pageSize,
            pageNo: res.responsePageInfo.pageNum,
            totalPage: res.responsePageInfo.pages,
            totalCount: res.responsePageInfo.total,
            data: res.responsePageInfo.list
          }
        })
      },
      onSelectChange: (selectedRowKeys, selectedRows) => {
        this.checkedKeys = selectedRowKeys
        this.checkedRows = selectedRows
      },
      menuBtns: [
        {
          key: 'adduser',
          icon: 'plus',
          title: '添加授权人员',
          type: 'primary',
          func: () => {
            if (!this.currentOrg) return this.$message.warning('请选择机构')
            this.$refs.add.add(Object.assign({ totalCount: this.totalCount }, this.currentOrg))
          }
        },
        {
          key: 'addjob',
          icon: 'plus',
          title: '添加授权岗位',
          type: 'primary',
          func: () => {
            if (!this.currentOrg) return this.$message.warning('请选择机构')
            this.$refs.hr.add(Object.assign({}, this.currentOrg, { type: 3, tag: 3 }))
          }
        },
        // {
        //   key: 'batch',
        //   icon: 'plus',
        //   title: '批量授权',
        //   type: 'primary',
        //   func: () => null
        // },
        {
          key: 'del',
          icon: 'delete',
          title: '删除授权对象',
          type: 'primary',
          func: () => {
            this.batchDelUserOrStstion()
          }
        }
      ]
    }
  },
  created () {
    this.queryProjectTree()
    // getPermissionTree({ scope_code: 0 }).then(res => {
    //   this.orgList = res.responseList.map(org => {
    //     return this.dealTree(org)
    //   })
    //   this.openKeys = [this.orgList[0].key]
    //   this.queryParam = {
    //     scope_code: this.orgList[0].key
    //   }
    // })
  },
  filters: {
    valid (value) {
      return value === 0 ? '否' : '是'
    },
    type (value) {
      return value === '0' ? '人员' : '岗位'
    }
  },
  methods: {
    handleAdd (item) {
      this.$refs.modal.add(item)
    },
    handleTitleClick (item) {
      console.log('handleTitleClick', item)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    handleSaveOk () {
      this.queryProjectTree()
      this.queryParam = {
        scope_code: this.currentOrg.scope_code || 0
      }
      this.$refs.table.refresh(true)
    },
    handleSaveClose () { },
    handleEdit (record) {
      record.scope_code = this.queryParam.scope_code
      this.$refs.modal.add(record)
    },
    onChange (e) {
      this.search = e.target.value
    },
    containSearch (org) {
      let o = {}
      if (org.scope_name.toLowerCase().includes(this.search.toLowerCase())) {
        o = Object.assign({}, org)
      }

      if (org.children && org.children.length) {
        const childrens = org.children
          .map(c => {
            return this.containSearch(c)
          })
          .filter(c => !!c)

        if (childrens.length) {
          o = Object.assign({}, org)
          o.children = childrens
        }
      }

      return Object.keys(o).length ? o : null
    },
    add (record) {
      this.$refs.hr.add(record)
    },
    reduce (record) {
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定删除当前项目?`,
        onOk () {
          document.querySelector('.ant-modal-confirm-btns>.ant-btn-default').style.visibility = "hidden"
          return delTreeinfo({ scope_code: record.scope_code }).then(res => {
            if (res.status === '0') {
              that.queryProjectTree()
              that.queryParam = {
                scope_code: that.$store.state.menu_key
              }
              that.$message.success(res.msg)
              that.$refs.table.refresh(true)
            }
          })
        },

        onCancel () { }
      })
      // delTreeinfo({ scope_code: record.scope_code }).then(res => {
      //   if (res.status === '0') {
      //     this.queryProjectTree()
      //     this.queryParam = {
      //       scope_code: this.$store.state.menu_key
      //     }
      //     this.$message.success(res.msg)
      //     this.$refs.table.refresh(true)
      //   }
      // })
      // delPermissionTreeNode({ scope_code: record.scope_code }).then(res => {
      //   if (res.status === '0') {
      //     this.queryProjectTree()
      //     this.queryParam = {
      //       scope_code: this.$store.state.menu_key
      //     }
      //     this.$refs.table.refresh(true)
      //   }
      // })
    },
    select (key, { node }) {
      console.log('111111', key, { node }, node.dataRef)
      if (key.length > 0 && !key.includes(this.queryParam.scope_code)) {
        this.queryParam = {
          scope_code: key[0]
        }
        this.currentOrg = node.dataRef
        this.$refs.table.refresh(true)
      }
    },
    dealTree (data) {
      data.key = data.scope_code
      data.scopedSlots = { title: 'title' }
      if (data.isClick === 0) data.disabled = true

      if (data.child) {
        data.children = data.child.map(d => {
          return this.dealTree(d)
        })
      }

      return data
    },
    queryProjectTree () {
      getPermissionTree({ scope_code: this.$store.state.menu_key }).then(res => {
        console.log(res)
        this.orgList = [res.responseObject.org].map(org => {
          return this.dealTree(org)
        })
        // this.openKeys = [this.orgList[0].key]
        // this.queryParam = {
        //   scope_code: this.orgList[0].key
        // }
      })
    },
    delUserOrStation (record) {
      batchDelUserOrStation({
        scope_code: this.queryParam.scope_code,
        details: [
          {
            user_station_id: record.user_station_id,
            is_flag: record.is_flag
          }
        ]
      }).then(res => {
        if (res.status === '0') {
          this.$refs.table.clearSelected()
          this.$refs.table.refresh(true)
        }
      })
    },
    batchDelUserOrStstion () {
      if (!this.checkedKeys.length) return this.$message.warning('请选择授权对象')
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定删除所选岗位/人员?`,
        onOk () {
          return batchDelUserOrStation({
            menu_id: 83,
            scope_code: that.queryParam.scope_code,
            details: that.checkedRows.map(row => {
              return {
                user_station_id: row.user_station_id,
                is_flag: row.is_flag
              }
            })
          }).then(res => {
            if (res.status === '0') {
              that.$notification['success']({
                message: '提示',
                description: res.msg
              })
              that.$refs.table.clearSelected()
              that.$refs.table.refresh(true)
            }
          })
        },
        onCancel () { }
      })

    }
  }
}
</script>

<style lang="less">
.custom-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .ant-tree-title {
    &:hover {
      .btn-permission {
        display: inline-block;
      }
    }
  }

  .btn-permission {
    display: none;
    // position: absolute;
    // top: 0;
    // right: 0px;
    width: 20px;
    // height: 40px;
    // line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}

.menu-button {
  margin-right: 5px;
}
</style>
