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
import List from '@/views/repository/resource/table/List'

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
