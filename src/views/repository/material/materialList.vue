<template>
  <a-card
    :bordered="false"
  >
    <component
      v-if="isRouterAlive"
      :recording="record"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/repository/material/table/List'

export default {
  name: 'facilitiesListt',
  components: {
    AInput,
    ATextarea,
    List
  },
  data () {
    return {
      isRouterAlive: true,
      currentComponet: 'List',
      record: '',
      bodyStyle: {
        background: '#f0f2f5',
        padding: 0
      }
    }
  },
  created () {

  },
  methods: {
    // 刷新路由方法
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    // handleEdit (record) {
    //   this.record = record || ''
    //   this.currentComponet = 'Edit'
    //   console.log(record)
    // },
    // handleGoBack () {
    //   this.record = ''
    //   this.currentComponet = 'List'
    // }
  },
  watch: {
    // '$route.path' () {
    //   this.record = ''
    //   this.currentComponet = 'List'
    // }
    
    '$store.state.isreload'() {
      if (this.$store.state.isreload) {
        this.reload()
      }
      this.$store.state.isreload = false
    }
  }
}
</script>
