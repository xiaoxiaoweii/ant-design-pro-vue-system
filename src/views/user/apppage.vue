<template>
  <div class="content">
    <span>页面正在跳转中，请稍等......</span>
    <br />
    <a href="javascript:;" class="login-button">如果页面未跳转，点击立即跳转</a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
document.addEventListener('UniAppJSBridgeReady', function () {
  uni.postMessage({
    data: {
      action: 'postMessage'
    }
  });
  document.querySelector('.login-button').addEventListener('click', function (e) {
    console.log('uniapp 业务系统')
    const arr = window.location.href.split('?')
    const loginParams = arr[1].split('=')
    const str = loginParams[1] || ''
    // uni.postMessage({
    //   data: {
    //     action: 'postMessage'
    //   }
    // });
    uni.navigateTo({
      url: "relogin?authCode=" + str
    })
  });
});
export default {
  mounted () {
    localStorage.clear()
    setTimeout(() => {
      document.querySelector('.login-button').click()
    }, 1500)
    // const arr = window.location.href.split('?')
    // const loginParams = arr[1].split('=')
    // this.Login({ authCode: loginParams[1] })
    //   .then((res) => this.loginSuccess(res))
    //   .catch(err => {
    //     this.requestFailed(err)
    //   })
  },
  methods: {
    ...mapActions(['Login']),

    loginSuccess (res) {
      console.log(res)
      this.$router.push({ name: 'index' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$router.push({ name: 'relogin' })
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 500px;
  text-align: center;
  margin: 0 auto;
  span {
    display: inline-block;
    margin: 0 auto;
    margin-top: 100px;
  }
}
</style>
