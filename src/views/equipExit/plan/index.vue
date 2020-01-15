<template>
  <a-card :bordered="false" :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}">
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

// 动态切换组件
import List from '@/views/equipExit/plan/table/List'
import Edit from '@/views/equipExit/plan/table/Edit'
import Detail from '@/views/equipExit/plan/table/Detail'
export default {
  name: 'PlanExitList',
  components: {
    List,
    Edit,
    Detail
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
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload () {
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
    '$store.state.isreload' () {
      if (true)
        this.reload()
    },
    $route (to, from) {
      if (to.path === '/equipExit/planExitList') {
        this.reload()
      }
    }

  }
}
</script>
