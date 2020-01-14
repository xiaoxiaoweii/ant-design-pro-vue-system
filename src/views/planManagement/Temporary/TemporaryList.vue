<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
    <component
    v-if="isRouterAlive"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
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
import List from '@/views/planManagement/Temporary/table/List'
import Edit from '@/views/planManagement/Temporary/table/Edit'
import Read from '@/views/planManagement/Temporary/table/Read'

export default {
  name: 'Temporary',
  components: {
    AInput,
    ATextarea,
    List,
    Edit,
    Read
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
  provide () {
    return {
      reload: this.reload
    }
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
      // console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    },
    handleRead (record) {
      this.record = record || ''
      this.currentComponet = 'Read'
      // console.log(record)
    },
  },
  watch: {
    '$store.state.isreload'() {
      this.reload()
    },
    $route(to,from) {
      if (to.path === '/planManagement/temporaryList') {
        if (!this.$store.state.keepaliveArr.includes('/planManagement/temporaryList')) {
          this.reload()
        }
        this.$store.state.keepaliveArr.push('/planManagement/temporaryList')
      }
    }
  }
}
</script>
