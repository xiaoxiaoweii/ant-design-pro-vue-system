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

import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/equipmentMobilization/roadTransport/table/List'
import Edit from '@/views/equipmentMobilization/roadTransport/table/Edit'
import Detail from '@/views/equipmentMobilization/roadTransport/table/Detail'
export default {
  name: 'roadTransportList',
  components: {
    AInput,
    ATextarea,
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
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
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
