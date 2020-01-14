<template>
  <!-- wbs弹框 -->
  <a-modal
    class="modal-box"
    title="请选择"
    v-model="visible"
    width="40%"
    @ok="handleSubmit()"
    @cancel="handleCancel"
  >
    <ZTree
      ref="myztree"
      class="ztree1"
      :setting="settingTree"
      :nodes="treeData"
      @onClick="treeClick"
      @onCreated="handleCreated"
      :ishow="true"
    />
  </a-modal>
</template>

<script>
import { ZTree } from '@/components'
import { queryProjectName } from '@/api/planManagement/require'
export default {
  name: 'wbsModal',
  props: {
    // queryData: {
    //   type: Function,
    //   required: true
    // }
  },
  components: {
    ZTree
  },
  data () {
    return {
      visible: false,
      searchText: '',
      treeData: [],
      selectNode: String,
      settingTree: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'name'
            // children: 'children'
          }
        }
      }
    }
  },
  methods: {
    add () {
      this.visible = true
      this.$nextTick(() => {
        queryProjectName({ creator_org_id: this.$store.state.menu_key }).then(res => {
          this.treeData = res.responseObject
          this.delChild(this.treeData)
        })
      })
    },

    delChild (arr) {
      arr.forEach(x => {
        if (!x['children'].length) {
          delete x['children']
        } else {
          this.delChild(x['children'])
        }
      })
    },

    treeClick (evt, treeId, treeNode) {
      if (!treeNode.oldname) {
        this.selectNode = treeNode.name
        return
      }
      if (treeNode.oldname.search('span') != -1) {
        let a = treeNode.oldname.indexOf('>')
        treeNode.oldname = treeNode.oldname.slice(a + 1)
        let b = treeNode.oldname.indexOf('<')
        treeNode.oldname = treeNode.oldname.slice(0, b)
      }
      this.selectNode = treeNode.oldname
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },

    handleSubmit () {
      if (!this.selectNode) return this.noSelect()
      this.$emit('ok', this.selectNode || null)
      this.visible = false
    },
    handleCancel () {
      this.$refs.myztree.valTree = ''
      this.visible = false
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
  }
}
</script>

<style>
</style>