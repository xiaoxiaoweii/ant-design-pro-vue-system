<template>
  <a-card
    :bordered="false"
    :bodyStyle="currentComponet === 'Edit' ? bodyStyle : {}"
  >
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
import List from '@/views/planManagement/transform/table/List'
import Edit from '@/views/planManagement/transform/table/Edit'
import Read from '@/views/planManagement/transform/table/Read'
import Detail from '@/views/planManagement/transform/table/Detail'
export default {
  name: 'transformList',
  components: {
    AInput,
    ATextarea,
    List,
    Read,
    Edit,
    Detail
  },
  data () {
    return {
      isRouterAlive:true,
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
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    handleEdit (record) {
      this.record = record || ''
      this.currentComponet = 'Edit'
      // console.log(record)
    },
    handleDetail (record) {
      this.record = record || ''
      this.currentComponet = 'Detail'
      // console.log(record)
    },
    handleRead (record) {
      this.record = record || ''
      this.currentComponet = 'Read'
      // console.log(record)
    },
    handleGoBack () {
      this.record = ''
      this.currentComponet = 'List'
    }
  },
  watch: {
    '$store.state.isreload'() {
       this.reload()
    },
    $route(to, from) {
      if (to.path === '/planManagement/facitransformsList') {
        this.reload()
        // if (!this.$store.state.keepaliveArr.includes('/planManagement/facitransformsList')) {
        //   this.reload()
        // }
        // this.$store.state.keepaliveArr.push('/planManagement/facitransformsList')
      }
    }

  }
}
</script>
