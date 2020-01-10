<template>
  <a-card>
    <component
      :is="currentComponet"
    ></component>
    <a-button
      @click="handleEdit"
    >111</a-button>
    <a-button
      @click="handleDetail"
    >222</a-button>
  </a-card>
</template>
<style lang='less'>
@import '~ant-design-vue/lib/style/themes/default.less';
</style>
<script>
// 导入antdesign组件
import AInput from 'ant-design-vue/es/input/Input'
import ATextarea from 'ant-design-vue/es/input/TextArea'
// 导入组件
import List from '@/views/planManagement/require/table/List'
import Lists from '@/views/planManagement/require/table/Lists'
import Edit from '@/views/planManagement/require/table/Edit'
import Read from '@/views/planManagement/require/table/Read'
import Detail from '@/views/planManagement/require/table/Detail1'
export default {
  name: 'RequireList',
  components: {
    AInput,
    ATextarea,
    List,
    Lists,
    Read,
    Edit,
    Detail
  },
  data () {
    return {
      currentComponet: 'Lists'
    }
  },
  methods: {
    handleEdit () {
      this.currentComponet = 'Edit'
      console.log('edit')
    },
    handleDetail (record) {
      this.currentComponet = 'Detail'
      console.log('detail')
    }

  }
}
</script>
<style>
</style>
