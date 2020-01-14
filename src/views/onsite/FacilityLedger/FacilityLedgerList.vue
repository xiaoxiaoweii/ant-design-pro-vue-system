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

//临电台账
// 动态切换组件
import List from '@/views/onsite/FacilityLedger/table/List'

export default {
  name: 'FacilityLedger',
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
