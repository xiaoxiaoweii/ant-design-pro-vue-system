<template>
  <div class="logo">
    <LogoSvg alt="logo" />
    <h1 v-if="showTitle">{{ title }}</h1>
    <!-- <router-link :to="{name:'index'}">
      
    </router-link> -->
  </div>
</template>

<script>
import LogoSvg from '@/business/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '设备业务管理',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
