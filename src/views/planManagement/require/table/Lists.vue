<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="需求计划单" :bordered="false">list</a-card>
    <!-- 设备明细 -->
    <a-card class="card" title="设备明细" :bordered="false">设备明细</a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar>
      <a-button type="primary">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
export default {
  components: {
    FooterToolBar
  }
}
</script>

<style>
</style>
