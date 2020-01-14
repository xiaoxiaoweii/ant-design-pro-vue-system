<template>
  <a-card :bordered="false" :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}">
    <component
      v-if="isRouterAlive"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      @onDetail="handleDetail"
      :recording="record"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>
import List from '@/views/equipExit/subcontractor/table/List'
import Edit from '@/views/equipExit/subcontractor/table/Edit'
import Detail from '@/views/equipExit/subcontractor/table/Detail'
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
      if (to.path === '/leaseOut/leaseOutList') {
        if (!this.$store.state.keepaliveArr.includes('/leaseOut/leaseOutList')) {
          this.reload()
        }
        this.$store.state.keepaliveArr.push('/leaseOut/leaseOutList')
      }
    }

  }
}
</script>
