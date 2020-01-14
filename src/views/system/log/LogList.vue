<template>
  <a-card
    :bordered="false"
  >
    <component
      :is="currentComponet"
    ></component>
  </a-card>
</template>

<script>

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/system/log/table/List'

export default {
  name: 'LogList',
  components: {
    AInput,
    ATextarea,
    List
  },
  data () {
    return {
      currentComponet: 'List'
    }
  },
  watch: {
    '$route.path' () {
      this.currentComponet = 'List'
    }
  }
}
</script>
