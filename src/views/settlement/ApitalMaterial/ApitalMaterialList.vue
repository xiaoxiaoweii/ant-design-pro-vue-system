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

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/settlement/ApitalMaterial/table/List'
import Edit from '@/views/settlement/ApitalMaterial/table/Edit'
import Detail from '@/views/settlement/ApitalMaterial/table/Detail'
import Read from '@/views/settlement/ApitalMaterial/table/Read'

export default {
  name: 'ApitalMaterial',
  components: {
    AInput,
    ATextarea,
    List,
    Edit,
    Detail,
    Read
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
    // 刷新路由方法
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    },
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
      console.log(record)
    },
    handleRead (record) {
      this.record = record || ''
      this.currentComponet = 'Read'
      console.log(record)
    },
  },
  watch: {
    '$store.state.isreload' () {
      if (this.$store.state.isreload) {
        this.reload()
      }
      this.$store.state.isreload = false
    }
  }
}
</script>
