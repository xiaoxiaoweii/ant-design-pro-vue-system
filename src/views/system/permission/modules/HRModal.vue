<template>
  <a-modal
    :title="this.dataObj.tag === 2 ? '添加项目' : 'HR组织结构'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- <a-row :gutter="8">
      <a-col
        :span="5"
        style="overflow: auto;"
    >-->
    <div class="hr" style="overflow: auto; max-height: 550px">
      <a-input-search style="margin-bottom: 8px" placeholder="关键字搜索" @change="onSearch" />

      <!-- checkable
      checkStrictly-->
      <a-tree :treeData="hrTree" @select="checkItem">
        <span slot="title" slot-scope="{ name }">{{ name }}</span>
      </a-tree>
    </div>
    <!-- </a-col>
      <a-col :span="19">
        <a-spin :spinning="confirmLoading">
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :rowSelection="{
              onChange: onChange,
              onSelect: onSelect,
              onSelectAll: onSelectAll,
              type: orgType
            }"
            :pagination="false"
            rowKey="id"
            bordered
          >
            <template
              slot="type"
              slot-scope="text"
            >
              <span>{{ text | types }}</span>
            </template>
          </a-table>
        </a-spin>
      </a-col>
    </a-row>-->
  </a-modal>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { addPermissionTreeNode, batchAddStation, postTreeinfo } from '@/api/permission'
import { handleStationtree } from '@/api/common'
import { type } from 'os'
const ORG_TYPES = {
  unit: 1, // 单位
  department: 2, // 部门
  post: 3 // 岗位
}

export default {
  name: 'HRModal',
  components: {
    STree
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
      dataObj: {},
      checkedNodes: {},
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
          title: '简称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '全称',
          dataIndex: 'fullname',
          key: 'fullname',
          scopedSlots: { customRender: 'fullname' }
        },
        {
          title: '编码',
          dataIndex: 'code',
          key: 'code',
          scopedSlots: { customRender: 'code' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: { customRender: 'type' }
        }
      ],
      hrList: [],
      onChange: (selectedRowKeys, selectedRows) => {
        this.checkedKeys = selectedRowKeys
        this.checkedRows = selectedRows
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect: (record, selected, selectedRows) => {
        this.currentNode = record
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      }
    }
  },
  methods: {
    add (record) {
      console.log(record, '1212')
      this.dataObj = record
      this.record = Object.assign({}, record)
      this.edit(record)
    },
    edit (record) {
      handleStationtree().then(res => {
        this.hrList = [this.dealTree(res.responseObject)]
        console.log(this.hrList, 'deldeldedl')
        this.dataSource = this.hrList
      })
      this.visible = true
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      if (!this.checkedNodes.code) return this.$message.warning('请选择目标记录')
      if (this.dataObj.tag === 2) {
        postTreeinfo({
          menu_id: 83,
          scope_code: this.checkedNodes.code,
          scope_name: this.checkedNodes.name,
          parent_id: this.dataObj.scope_code,
          level_number: this.dataObj.type + 1
        })
          .then(res => {
            if (res.status === '0') {
              this.$message.success(res.msg)
              this.$emit('ok')
            }
          })
          .catch(() => { })
          .finally(() => {
            this.confirmLoading = false
            this.close()
          })
      } else {
        batchAddStation({
          menu_id: 83,
          scope_code: this.dataObj.scope_code,
          scope_name: this.dataObj.scope_name,
          details: [
            {
              station_code: this.checkedNodes.id,
              station_name: this.checkedNodes.name
            }
          ]
        })
          .then(res => {
            if (res.status === '0') {
              this.$message.success(res.msg)
              this.$emit('ok')
            }
          })
          .catch(() => { })
          .finally(() => {
            this.confirmLoading = false
            this.close()
          })
      }
      // if (!this.checkedNodes.length) return this.$message.warning('请选择目标记录')
      // switch (this.record.type) {
      //   case ORG_TYPES.unit:
      //     break
      //   case ORG_TYPES.department:
      //     if (ORG_TYPES.department !== this.currentNode.type) return this.$message.warning('请选择部门进行添加')
      //     this.confirmLoading = true
      //     addPermissionTreeNode({
      //       scope_code: this.currentNode.code,
      //       scope_name: this.currentNode.name,
      //       parent_id: this.record.scope_code,
      //       level_number: this.record.level_number + 1
      //     }).then(res => {
      //       if (res.status === '0') {
      //         this.$message.success(res.msg)
      //         this.$emit('ok')
      //       }
      //     }).catch(() => {
      //     }).finally(() => {
      //       this.confirmLoading = false
      //       this.close()
      //     })
      //     break
      //   case ORG_TYPES.post:
      //     const index = this.checkedNodes.findIndex(node => node.data.props.type !== ORG_TYPES.post)
      //     if (index > -1 || this.checkedNodes.length === 0) return this.$message.warning('请选择岗位进行添加')
      //     this.confirmLoading = true
      //     batchAddStation({
      //       scope_code: this.record.scope_code,
      //       details: this.checkedNodes.map(o => {
      //         return {
      //           station_code: o.data.props.code,
      //           station_name: o.data.props.name
      //         }
      //       })
      //     }).then(res => {
      //       if (res.status === '0') {
      //         this.$message.success(res.msg)
      //         this.$emit('ok')
      //       }
      //     }).catch(() => {
      //     }).finally(() => {
      //       this.confirmLoading = false
      //       this.close()
      //     })
      //     break
      //   default:
      //     console.error('invalid org type.')
      //     break
      // }
    },
    handleCancel () {
      this.close()
    },
    hiddenBtn (menu) {
      menu.hidden = true

      if (menu.children) {
        menu.children = menu.children.map(t => {
          return this.hiddenBtn(t)
        })
      }
      return menu
    },
    checkItem (key, { node }) {
      this.checkedNodes = node.dataRef
      console.log(this.checkedNodes, '1211212', node.dataRef)
      // this.dataSource = [node.dataRef]
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
        const childrens = menu.children
          .map(c => {
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
        data.children.forEach((x, i) => {
          if (this.dataObj.tag === 2) {
            if (x.type === 3) data.children = []
          }
        })
        data.children = data.children.map(d => {
          return this.dealTree(d)
        })
      }

      return data
    }
  }
  // filters: {
  //   types (type) {
  //     const maps = {
  //       1: '单位',
  //       2: '部门',
  //       3: '岗位'
  //     }
  //     return maps[type]
  //   }
  // }
}
</script>

<style lang="less" scoped>
/deep/ .line-table tr td:nth-child(2) {
  font-size: 0 !important;
}
</style>
