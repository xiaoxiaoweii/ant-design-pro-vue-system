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
//设备材料价格库
// 动态切换组件
import List from '@/views/onsite/MaterialPrice/table/List'

export default {
  name: 'MaterialPrice',
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
