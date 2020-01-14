<template>
  <a-card
    :bordered="false"  >
    <component
      v-if="isRouterAlive"
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>

// 动态切换组件
import List from '@/views/onsite/OperationSummary/table/List'

export default {
  name: 'OperationSummary',
  components: {
    List,
  },
  data () {
    return {
      isRouterAlive: true,
      currentComponet: 'List',
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
  },
  watch: {
    '$store.state.isreload'() {
      if (this.$store.state.isreload) {
        this.reload()
      }
      this.$store.state.isreload = false
    }
  }
}
</script>
