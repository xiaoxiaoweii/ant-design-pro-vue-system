<template>
  <div class="d1">
    <a-card title="提示" style="width: 100%">
      <p>
        <span>
          <span class="s1">您已退出成功。</span>
          <span class="s2" @click="goon">点击继续访问</span>
        </span>
      </p>
    </a-card>
  </div>
</template>

<script>
import { openid } from '@/api/common'

export default {
  mounted() {
    var ahead = document.querySelector('.ant-card-head')
    ahead.style.backgroundColor = '#eee'
  },
  methods: {
    goon() {
      // this.$router.push({ path: '/user/login'})
      openid({flag: 0}).then(res => {
        console.log(res)
        window.location.href = res
      })
    }
  }
}
</script>

<style scoped lang="css">
.s1 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #ca3d3d;
  font-size: 15px;
  font-weight: bold;
}
.s2 {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  color: #44a1e2;
  font-size: 15px;
  font-weight: bold;
}
.s2:hover {
  cursor: pointer;
}
.d1 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
  width: 80%;
}
.d1 .ant-card-head {
  background-color: #eee !important;
}
p {
  border: 1px #ef9292 solid;
  height: 55px;
  background-color: #f3dfde;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 31px;
}
</style>
