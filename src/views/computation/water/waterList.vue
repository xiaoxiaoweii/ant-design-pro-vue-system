<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
    <component
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
import List from '@/views/computation/water/table/List'
import Edit from '@/views/computation/water/table/Edit'
import Read from '@/views/computation/water/table/Read'
import Detail from '@/views/computation/water/table/Detail'
export default {
  name: ' waterList ',
  components: {
    AInput,
    ATextarea,
    List,
    Edit,
    Read,
    Detail
  },
  data () {
    return {
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
    handleRead (record) {
      this.record = record || ''
      this.currentComponet = 'Read'
      console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$store.state.isreload'() {
      if (true) {
       this.reload()}
    },
    $route(to, from) {
      if (to.path === '/computation/water/waterList') {
        if (!this.$store.state.keepaliveArr.includes('/computation/water/waterList')) {
          this.reload()
        }
        this.$store.state.keepaliveArr.push('/computation/water/waterList')
      }
    }

  }
}
</script>
