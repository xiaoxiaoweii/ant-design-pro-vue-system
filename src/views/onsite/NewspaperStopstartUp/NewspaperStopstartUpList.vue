<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
    <component
      @onEdit="handleEdit"
      @onGoBack="handleGoBack"
      :recording="record"
      :is="currentComponet"
      @onDetail="handleDetail"
    ></component>
  </a-card>
</template>

<script>
//自动设备报停启动
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/onsite/NewspaperStopstartUp/table/List'
import Edit from '@/views/onsite/NewspaperStopstartUp/table/Edit'
import Detail from '@/views/onsite/NewspaperStopstartUp/table/Detail'

export default {
  name: 'newspaperStopstartUp',
  components: {
    AInput,
    ATextarea,
    List,
    Edit,
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
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    },
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
      console.log(record)
    },
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>
