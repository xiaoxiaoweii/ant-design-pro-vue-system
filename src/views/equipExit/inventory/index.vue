<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
    <component
      v-if="isRouterAlive"
      @onDetail="handleDetail"
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      :recording="record"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>

// 动态切换组件
import List from '@/views/equipExit/inventory/table/List'
import Edit from '@/views/equipExit/inventory/table/Edit'
import Detail from '@/views/equipExit/inventory/table/Detail'
export default {
  components: {
    List,
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
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
    },
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
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
      if (to.path === '/planManagement/rentalList') {
        if (!this.$store.state.keepaliveArr.includes('/planManagement/rentalList')) {
          this.reload()
        }
        this.$store.state.keepaliveArr.push('/planManagement/rentalList')
      }
    }
  }
}
</script>
