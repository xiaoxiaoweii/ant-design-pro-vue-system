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
    ></component>
  </a-card>
</template>

<script>
import ATextarea from 'ant-design-vue/es/input/TextArea'
import AInput from 'ant-design-vue/es/input/Input'
// 动态切换组件
import List from '@/views/pricepool/Procurement/table/List'
import Edit from '@/views/pricepool/Procurement/table/Edit'

export default {
  name: 'Procurement',
  components: {
    AInput,
    ATextarea,
    List,
    Edit
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
    }
  },
  watch: {
    '$route.path' () {
      this.record = ''
      this.currentComponet = 'List'
    }
  }
}
</script>
