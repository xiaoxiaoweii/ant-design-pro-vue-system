<template>
  <div class="permission-auth-model">
    <a-modal
      title="功能授权"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :okButtonProps="{ props: { disabled: confirmDisable }} "
      @ok="handleOk"
      @cancel="handleCancel"
      style="height: 550px"
    >
      <!-- <a-input-search
        style="margin-bottom: 8px"
        placeholder="关键字搜索"
        @change="onSearch"
      /> -->
      <a-tree
        checkable
        v-model="checkedKeys"
        :treeData="menuTree"
        @check="checkItem"
      >
      </a-tree>
    </a-modal>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { findOne, create } from '@/api/permission'
import { getMultiMenuTree } from '@/api/user'

export default {
  name: 'EnumModal',
  components: {
    STree
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
      selectSys: [],
      checkSys: [],
      checkedKeys: [],
      search: '',
      record: null,
      formlayout: {
        labelCol: {
          xs: { span: 4 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 18 }
        }
      },
      visible: false,
      confirmLoading: false,
      confirmDisable: true,
      menuList: [],
      authList: [],
      menuBtn: {
        entry: 'a10001',
        edit: 'a10002',
        review: 'a10003',
        retrieve: 'a10004'
      }
    }
  },
  methods: {
    add (record) {
      this.record = Object.assign({}, record)
      this.edit(record)
    },
    edit (record) {
      console.log(record)
      getMultiMenuTree({ parentIds: [14, 32, 38, 47, 55, 65, 71, 74, 77, 79, 82], flag: 1 }).then(res => {
        this.menuList = res.responseList.map(menu => {
          const m = Object.assign({}, menu)
          return this.setMenuKey(m)
        })
        console.log(this.menuList)
        findOne(Object.assign(record, { menu_id: 83 })).then(res => {
          this.authList = res.responseList
          console.log(this.authList)
          const menuKeys = this.authList.filter(auth => auth.authority_button_codes && auth.authority_button_codes.length > 0)
          const menuKeys2 = this.authList.filter(auth => !auth.authority_button_codes)
          const checkedKeys = []
          menuKeys.forEach(m => {
            checkedKeys.push(...m.authority_button_codes.split(',').map(auth => `${m.menu_code}${auth}`))
          })
          menuKeys2.forEach(m => {
            checkedKeys.push(m.menu_code)
          })
          console.log(checkedKeys)
          this.checkedKeys = [...checkedKeys, ...this.checkSys]
          if (this.selectSys.length > 0) this.checkedKeys = this.selectSys
          console.log(this.checkedKeys)
        })
      })
      this.visible = true
      this.confirmDisable = true
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.selectSys = []
    },
    handleOk () {
      this.confirmLoading = true
      const authKeys = this.checkedKeys.filter(key => key.includes('a'))
      const authKeys2 = this.checkedKeys.filter(key => key.indexOf('a') === -1)
      const menuSet = new Set(authKeys.map(aKey => aKey.split('a')[0]))
      const menuKeys = [...menuSet]
      const menus = menuKeys.map(key => {
        return {
          menu_code: key,
          authority_button_codes: authKeys.filter(aKey => aKey.split('a')[0] === key).map(aKey => `a${aKey.split('a')[1]}`).join(',')
        }
      })

      const system = ['82', '83', '84', '85', '86', '87', '88']
      system.map(x => {
        if (authKeys2.includes(x)) {
          menus.push({
            menu_code: x,
            authority_button_codes: ''
          })
        }
      })

      create({
        menu_id: 83,
        scope_code: this.record.scope_code,
        user_station_id: this.record.user_station_id,
        is_flag: this.record.is_flag,
        menus: menus
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
      console.log(1)
      this.close()
    },
    checkItem (a, e) {
      console.log('check', a, e)
      this.selectSys = a
      this.confirmDisable = false
    },
    onChange (e, col) {
      this.authItem[0][col] = e.target.checked
    },
    onSearch (e) {
      this.search = e.target.value
      const menuKeys = this.authList.filter(auth => auth.authority_button_codes.length > 0)
      const checkedKeys = []
      menuKeys.forEach(m => {
        checkedKeys.push(...m.authority_button_codes.split(',').map(auth => `${m.menu_code}${auth}`))
      })
      this.checkedKeys = checkedKeys
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

    // 递归处理数据
    setMenuKey (menu) {
      if (menu.children) {
        menu.children = menu.children.map(m => {
          if (m.authority_button_code) {
            m.key = `${menu.menuCode}${m.authority_button_code}`
          } else {
            m.key = m.menuCode
          }
          if (m.children) {
            m = this.setMenuKey(m)
          }
          if (m.key === 'system') {
            this.checkSys = m.children.map(d => {
              return d.menuCode
            })
          }
          return m
        })
      }
      return menu
    }
  }
}
</script>

<style lang="less">
.permission-auth-model {
  /deep/ .line-table tr td:nth-child(2) {
    font-size: 0 !important;
  }
}
.ant-modal-content {
  height: 100%;
  .ant-modal-body {
    height: calc(100% - 108px);
    overflow: auto;
  }
}
</style>
