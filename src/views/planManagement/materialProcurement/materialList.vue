<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
    <component
      v-if="isRouterAlive"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      @onDetail="handleDetail"
      @onRead="handleRead"
      :recording="record"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/planManagement/materialProcurement/table/List'
import Edit from '@/views/planManagement/materialProcurement/table/Edit'
import Read from '@/views/planManagement/materialProcurement/table/Read'
import Detail from '@/views/planManagement/materialProcurement/table/Detail'
export default {
  name: 'RequireList',
  components: {
    AInput,
    ATextarea,
    List,
    Read,
    Edit,
    Detail
  },
  data () {
    return {
      isRouterAlive:true,
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
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
    },
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
    },
    handleRead (record) {
      this.record = record || ''
      this.currentComponet = 'Read'
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    },
    $route(to,from) {
      if (to.path === '/planManagement/materialList') {
        this.reload()
        // if (!this.$store.state.keepaliveArr.includes('/planManagement/materialList')) {
        //   this.reload()
        // }
        // this.$store.state.keepaliveArr.push('/planManagement/materialList')
      }
    }
  }
}
</script>
