<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>-->
      <!-- <notice-icon class="action"/> -->
      <!-- 项目选择 -->
      <a-tree-select
        class="tree-select"
        style="width: 200px"
        :dropdownStyle="{ maxHeight: '400px', maxWidth: '280px', overflow: 'auto' }"
        :treeData="options"
        treeDefaultExpandAll
        @change="onChange"
        v-model="value"
      ></a-tree-select>
      <!-- 用户信息 -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <!-- <a-avatar
            class="avatar"
            size="small"
            :src="avatar()"
          />-->
          <span>
            {{ nickname() }}
            <a-icon type="down" />
          </span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-divider /> -->
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import { resetRouter } from '@/router'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data () {
    return {
      value: '选择单位',
      scope_name: '',
      pro_unit:'',
      pro_unit_code:'',
      fieldNames: {
        key: 'scope_code',
        value: 'scope_code',
        title: 'scope_name',
        children: 'child'
      },
      options: [],
      treeData: []
    }
  },
  watch: {
    value (value, a) {
      // commit('SET_MENU_KEY', value)
      if (localStorage.getItem('scope_code') !== value) {
        // this.$root.$emit('global::evt.multitabCloseAll')
        // this.$router.push('/dashboard/workplace')
      }
      // if (!localStorage.getItem('scope_code')) {
      //   localStorage.setItem('scope_code', value)
      // }
      
      this.$store.commit('SET_MENU_KEY', value)
      //获取项目工程的名称和编码
      this.$store.commit('SET_ORG_NAME', this.scope_name)
      localStorage.setItem('scope_code', value)
      // resetRouter({ scope_code: value }, this)
      //获取项目工程的所属单位和编码
      this.$store.commit('SET_MU', this.pro_unit)
      this.$store.commit('SET_MUC', this.pro_unit_code)
    }
  },
  created () {
    this.options = []
    this.options.push(this.userInfo().org)
    // 递归删除数组长度为0的child
    this.delChild(this.options)
    // resetRouter({ scope_code: this.value }, this)
    // this.findOne(this.options)
  },
  methods: {
    ...mapActions(['Logout', 'GenerateRoutes']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    handleLogout () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that
            .Logout({})
            .then(() => {
              // window.location.reload()
              localStorage.clear()
              that.$router.push({ path: '/logout' })
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel () { }
      })
    },
    onChange (value, name) {
      this.$store.state.isreload = !this.$store.state.isreload
      resetRouter({ scope_code: value }, this)
      this.scope_name = name[0]
      this.delChild2(this.options)
      this.$store.commit('SET_MU', this.pro_unit)
      this.$store.commit('SET_MUC', this.pro_unit_code)

      this.$store.commit('SET_ORG_NAME', this.scope_name)
      
      // this.$store.commit('setreload', true)
      
      if (this.$store.state.menu_key !== value) {
        // window.location.reload()
        // localStorage.setItem('scope_name', value)
        this.$root.$emit('global::evt.multitabCloseAll')
        this.$router.push('/dashboard/workplace')
      }
      this.$store.commit('SET_MENU_KEY', value)
    },
    delChild2(arr) {
      for(let i=0;i<arr.length;i++) {
        if(arr[i].scope_name === this.scope_name) {
          this.pro_unit = arr[i].project_manager_unit
          this.pro_unit_code = arr[i].project_manager_unit_code
        }
        if(arr[i].children.length>0) {
          this.delChild2(arr[i].children)
        }
      }
    },
    // 递归删除数组长度为0的child 并赋值最后一个子级
    delChild (arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i]['title'] = arr[i]['scope_name']
        arr[i]['key'] = arr[i]['scope_code']
        arr[i]['value'] = arr[i]['scope_code']
        arr[i]['children'] = arr[i]['child']
        if (arr[i]['isClick'] === 0) {
          arr[i]['disabled'] = true
        }
        if (arr[i]['scope_code'] === this.$store.state.user.first_key) {
          this.scope_name = arr[i].scope_name
          this.pro_unit = arr[i].project_manager_unit
          this.pro_unit_code = arr[i].project_manager_unit_code
          this.value = this.$store.state.user.first_key
        }
        if (arr[i]['key'].length > 0) {
          for (const key in arr[i]) {
            if (key === 'child') {
              arr[i]['children'] = arr[i]['child']
              if (arr[i]['child'].length === 0) {
                if (arr[i]['isClick'] === 1) {
                  arr[i]['disabled'] = false
                }
                // arr[i]['disabled'] = false
                // if (localStorage.getItem('scope_code')) {
                //   this.value = localStorage.getItem('scope_code')
                //   this.scope_name = localStorage.getItem('scope_name')
                //   return
                // }
                if (arr[i]['scope_code'] === this.$store.state.user.first_key) {
                  this.scope_name = arr[i].scope_name
                  this.pro_unit = arr[i].project_manager_unit
                  this.pro_unit_code = arr[i].project_manager_unit_code
                  this.value = this.$store.state.menu_key || this.$store.state.user.first_key
                }
                // this.value = arr[0].scope_code
                // this.scope_name = arr[0].scope_name
                delete arr[i][key]
              } else {
                this.delChild(arr[i][key])
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.tree-select {
  margin-right: 30px;
}
</style>
