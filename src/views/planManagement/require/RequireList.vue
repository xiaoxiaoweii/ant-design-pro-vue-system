<template>
  <a-card>
    <list></list>
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
import TableList from '@/views/planManagement/require/table/table'
import Edit from '@/views/planManagement/require/table/Edit'
import Read from '@/views/planManagement/require/table/Read'
import Detail from '@/views/planManagement/require/table/Detail1'
export default {
  name: 'RequireList',
  components: {
    AInput,
    ATextarea,
    List,
    TableList,
    Read,
    Edit,
    Detail
  }
}
</script>

<style>
</style>
