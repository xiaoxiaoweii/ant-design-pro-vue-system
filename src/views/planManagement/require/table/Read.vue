<template>
  <div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="需求计划单" :bordered="false">read</a-card>
    <!-- 设备明细 -->
    <a-card>设备明细</a-card>
    <a-modal
      title="已关联ECU"
      width="60%"
    >
      <template slot="footer">
        <a-button type="primary" @click.stop="()=>{ecuvisible=false}">返回</a-button>
      </template>
    </a-modal>
    <footer-tool-bar>
      <a-button type="primary" @click="validate" :loading="loading">提交</a-button>
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
