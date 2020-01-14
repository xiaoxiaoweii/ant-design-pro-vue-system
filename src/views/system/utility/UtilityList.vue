<template>
  <a-card :bordered="false" v-if="isRouterAlive">
    <a-row :gutter="8">
      <a-col :span="5" style="overflow: auto; max-height: 750px">
        <a-input-search style="margin-bottom: 8px" placeholder="关键字搜索" @change="onChange" />
        <!-- :loadData="onLoadData" -->
        <a-tree v-model="checkedKeys" :treeData="menuTree" @select="checkItem"></a-tree>
        <!-- <ZTree
          class="z-tree"
          :setting="setting"
          :nodes="menuTree"
          @onClick="onClick"
          @onCheck="onCheck"
          @onCreated="handleCreated"
          :ishow="true"
        />-->
      </a-col>
      <a-col :span="19">
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
          rowKey="id"
          bordered
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{selectedRowKeys: checkedKeys, onChange: onSelectChange}"
          :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
        >
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
          <span slot="is_valid" slot-scope="text">{{ text }}</span>
          <span slot="type" slot-scope="text">{{ text | type }}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除?" @confirm="() => delUserOrStation(record)">
                <a>删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <add-modal ref="add" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { Menu } from 'ant-design-vue'
import STree from '@/components/Tree/Tree'
import { STable, ZTree } from '@/components'
import AddModal from './AddModal'
import { getUtilityUserAndStation, batchDelUserOrStation } from '@/api/utility'
import { getMultiMenuTree } from '@/api/user'
const { Item } = Menu

export default {
  name: 'TreeList',
  components: {
    STable,
    STree,
    ZTree,
    AddModal,
    Item
  },
  computed: {
    menuTree () {
      const ret = []
      this.menuList.forEach(org => {
        const o = this.containSearch(org)
        if (o) ret.push(o)
      })
      return ret
    }
  },
  data () {
    return {
      isRouterAlive: true,
      menuList: [],
      selectSys: '',
      totalCount: 0, // 授权对象个数
      checkedRows: [],
      checkedKeys: [],
      orgList: [],
      openKeys: [],
      search: '',
      currentOrg: null,
      currentScope: null,

      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'title'
            // children: 'children'
          },
          simpleData: {
            enable: true,
            // pIdKey: 'parent_code',
            // idKey: 'equipment_code'
          }
        }
      },

      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '流程名称',
          dataIndex: 'process_name'
        },
        {
          title: '流程参数',
          dataIndex: 'parameters'
        },
        {
          title: '是否启用',
          dataIndex: 'is_valid',
          scopedSlots: { customRender: 'is_valid' }
        },
        {
          title: '备注  ',
          dataIndex: 'remark'
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
        if (!this.queryParam.menu_code) {
          this.queryParam = {
            menu_code: 0,
            menu_id: 88,
            scope_code: this.$store.state.menu_key
          }
        }
        return getUtilityUserAndStation(Object.assign(parameter, this.queryParam, { scope_code: this.$store.state.menu_key || this.$store.state.user.first_key }))
          .then(res => {
            this.totalCount = res.responsePageInfo.total
            res.responsePageInfo.list = res.responsePageInfo.list.map(x => {
              x.is_valid = x.is_valid === '0' ? '否' : '是'
              return x
            })
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
          title: '新增',
          type: 'primary',
          func: () => {
            if (!this.currentScope) return this.$message.warning('请选择菜单')
            this.$refs.add.add(this.currentScope)
          }
        },
        // {
        //   key: 'addjob',
        //   icon: 'plus',
        //   title: '添加授权岗位',
        //   type: 'primary',
        //   func: () => {
        //     if (!this.currentOrg) return this.$message.warning('请选择机构')
        //     this.$refs.hr.add(Object.assign({}, this.currentOrg, { type: 3 }))
        //   }
        // },
        // {
        //   key: 'del',
        //   icon: 'delete',
        //   title: '删除授权对象',
        //   type: 'primary',
        //   func: () => {
        //     this.batchDelUserOrStstion()
        //   }
        // }
      ]
    }
  },
  created () {
    this.queryProjectTree()
  },
  filters: {
    valid (value) {
      // return value === '0' ? '否' : '是'
    },
    type (value) {
      return value === '0' ? '人员' : '岗位'
    }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/system/utilityList') {
        if (!this.$store.state.keepaliveArr.includes('/system/utilityList')) {
          this.reload()
        }
        this.$store.state.keepaliveArr.push('/system/utilityList')
      }
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    onClick (evt, treeId, treeNode) {
      // 点击事件
      this.queryParam = {
        menu_code: treeNode.menuCode,
        menu_id: 88,
        scope_code: this.$store.state.menu_key
      }
      this.currentScope = treeNode.menuCode
      this.$refs.table.refresh(true)
    },
    onCheck (evt, treeId, treeNode) {
      // 选中事件
    },
    handleCreated (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
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
        menu_code: this.currentScope || 0,
        menu_id: 88,
        scope_code: this.$store.state.menu_key
      }
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEdit (record) {
      record.menu_code = this.queryParam.menu_code,
        record.scope_code = this.$store.state.menu_key
      console.log('ooooooooooooooooo', record)
      this.$refs.add.add(record)
    },
    onChange (e) {
      this.search = e.target.value
    },
    containSearch (menu) {
      let o = {}
      if (menu.authority_button_code) {
        // o = Object.assign({}, menu)
        menu.title = menu.authority_button_name
        // return o
      }
      menu.key = menu.menuCode || menu.key
      if (menu.title.toLowerCase().includes(this.search.toLowerCase())) {
        o = Object.assign({}, menu)
      }

      if (menu.children) {
        menu['disabled'] = true
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
    add (record) {
      this.$refs.hr.add(record)
    },
    // select (key, { node }) {
    //   console.log('111111', key, { node })
    //   if (key.length > 0 && !key.includes(this.queryParam.scope_code)) {
    //     this.queryParam = {
    //       scope_code: key[0]
    //     }
    //     this.currentOrg = node.dataRef
    //     this.$refs.table.refresh(true)
    //   }
    // },
    // dealTree (data) {
    //   data.key = data.scope_code
    //   data.scopedSlots = { title: 'title' }

    //   if (data.child) {
    //     data.children = data.child.map(d => {
    //       return this.dealTree(d)
    //     })
    //   }

    //   return data
    // },
    queryProjectTree () {
      getMultiMenuTree({ parentIds: [14, 32, 38, 47, 55, 65, 71, 74, 77, 79, 82], flag: 1 }).then(res => {
        this.menuList = res.responseList.filter(menu => {
          const m = Object.assign({}, menu)
          return this.setMenuKey(m) && this.setMenuKey(m).title !== '系统管理'
        })
      })
    },
    delUserOrStation (record) {
      console.log(record)
      batchDelUserOrStation({
        scope_code: record.scope_code,
        menu_code: record.menu_id,
        menu_id: 88,
        process_name: record.process_name
      }).then(res => {
        if (res.status === '0') {
          this.$message.success(res.msg)
          this.$refs.table.clearSelected()
          this.$refs.table.refresh(true)
        }
      })
    },

    checkItem (key, { node }) {
      console.log('111111', key, { node }, node.dataRef)
      // this.selectSys = a
      // this.confirmDisable = false
      this.queryParam = {
        scope_code: node.dataRef.scope_code,
        menu_code: node.dataRef.menuCode,
        menu_id: 88,
      }
      this.currentScope = node.dataRef.menuCode
      this.$refs.table.refresh(true)
    },

    // 递归处理数据
    setMenuKey (menu) {
      if (menu.children) {
        menu.children = menu.children.filter(m => {
          if (m.children) {
            m = this.setMenuKey(m)
          }
          return !m.authority_button_code
        })
      }
      if (menu.children.length === 0) {
        delete menu.children
      }
      return menu
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
      .btn-utility {
        display: inline-block;
      }
    }
  }

  .btn-utility {
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
