<template>
  <a-modal
    :title="!!dataObj.id ? '编辑' : '新增'"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-row :gutter="8">
      <a-col
        :span="5"
        style="overflow: auto; max-height: 750px"
      >
        <ZTree
            class="z-tree"
            :setting="setting"
            :nodes="menuTree"
            @onClick="onClick"
            @onCheck="onCheck"
            @onCreated="handleCreated"
            :ishow="true"
          />
      </a-col>
      <a-col :span="19">
        <s-table
          ref="table"
          size="default"
          rowKey="id"
          bordered
          :columns="columns"
          :data="loadData"
          :alert="false"
          :rowSelection="{selectedRowKeys: checkedKeys, onChange: onSelectChange, type: 'radio'}"
          :pagination="{showSizeChanger: true, showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
        >
          <span
            slot="serial"
            slot-scope="text, record, index"
          >{{ index + 1 }}</span>
          <span
            slot="is_valid"
            slot-scope="text"
          >{{ text | valid }}</span>
          <span
            slot="type"
            slot-scope="text"
          >{{ text | type }}</span>
        </s-table>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { Menu } from 'ant-design-vue'
import STree from '@/components/Tree/Tree'
import { STable, ZTree } from '@/components'
import AddModal from './AddModal'
import { getUtilityUserAndStation, batchDelUserOrStation, postUserAndStation } from '@/api/mechanism'
import { getMultiMenuTree } from '@/api/user'
const { Item } = Menu

export default {
  name: 'AddModal',
  components: {
    STable,
    STree,
    ZTree
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
  data() {
    return {
      dataObj: {},
      menuCode: null,
      scope_code: null,
      scope_name: String,
      visible: false,
      confirmLoading: false,
      menuList: [],
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
          dataIndex: 'status',
          scopedSlots: { customRender: 'is_valid' }
        },
        {
          title: '备注  ',
          dataIndex: 'remark'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!this.queryParam.menu_id) {
          this.queryParam = {
            menu_id: 0
          }
        }
        if (!this.queryParam.scope_code) this.queryParam.scope_code = this.scope_code
        return getUtilityUserAndStation(Object.assign(parameter, this.queryParam))
          .then(res => {
            this.totalCount = res.responsePageInfo.total
            this.checkedRows = res.responsePageInfo.list.filter(x => x.flag === 1)
            if (this.checkedRows.length > 0) this.checkedKeys = [this.checkedRows[0].id]
            console.log('221312412412', this.checkedRows, this.checkedKeys)
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
      }
    }
  },
  created () {
    this.queryProjectTree()
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
    close() {
      this.$emit('close')
      this.visible = false
    },
    add(record) {
      // if (!record.id) {
      //   this.menuCode = record
      // } else {
      //   this.dataObj = record
      //   this.menuCode = record.menu_id
      //   this.dataObj.is_valid = this.dataObj.is_valid == 1 ? '是' : '否'
      // }
      console.log(record, '======')
      this.scope_code = record.scope_code
      this.scope_name = record.scope_name
      this.record = Object.assign({}, record)
      this.edit(record)
    },
    edit(record) {
      this.visible = true
      this.confirmDisable = true
    },
    handleCancel() {
      this.close()
    },
    handleOk() {
      this.confirmLoading = true
      
      console.log(this.checkedRows, this.checkedKeys)
      this.checkedRows[0].scope_code = this.scope_code
      this.checkedRows[0].scope_name = this.scope_name
      postUserAndStation(this.checkedRows[0]).then(res => {
        console.log('-----', res)
      }).finally(() => {
        this.confirmLoading = false
        this.close()
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    resetForm() {
      this.form.resetFields()
    },
    handleCancel() {
      this.visible = false
    },

    
    onClick (evt, treeId, treeNode) {
      // 点击事件
      console.log(evt.type, treeNode)
      this.queryParam = {
        menu_id: treeNode.menuCode
      }
      this.currentScope = treeNode.menuCode
      this.$refs.table.refresh(true)
    },
    onCheck (evt, treeId, treeNode) {
      // 选中事件
      console.log(evt.type, treeNode)
    },
    handleCreated (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    handleSaveOk () {
      this.queryProjectTree()
      this.queryParam = {
        menu_id: this.currentScope || 0
      }
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

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
    // add (record) {
    //   this.$refs.hr.add(record)
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
        menu_id: record.menu_id,
        process_name: record.process_name
      }).then(res => {
        if (res.status === '0') {
          this.$refs.table.clearSelected()
          this.$refs.table.refresh(true)
        }
      })
    },

    checkItem (a, e) {
      this.selectSys = a
      this.confirmDisable = false
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

<style lang="less" scoped>
/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
</style>
