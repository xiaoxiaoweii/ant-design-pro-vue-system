<template>
  <div class="content">
    <p>后端：</p>
    <div>
      <div>
        <span>版本号：</span>
        {{ ushiro.version }}
      </div>
      <div>
        <span>commit：</span>
        {{ ushiro.commit }}
      </div>
      <div>
        <span>时间：</span>
        {{ ushiro.dateTime }}
      </div>
    </div>
    <br />
    <p>前端：</p>
    <div>
      <div>
        <span>版本号：</span>
        VERSION
      </div>
      <div>
        <span>commit：</span>
        COMMIT
      </div>
      <div>
        <span>时间：</span>
        DATETIME
      </div>
    </div>
  </div>
</template>

<script>
import { getVersion } from '@/api/user'

export default {
  data () {
    return {
      ushiro: {}
    }
  },
  created () {
    getVersion().then(res => {
      if (res.status === '0') {
        this.ushiro = res.responseObject
      }
    })
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  margin: 0 auto;
  padding-left: 35%;
  padding-top: 8%;
  // text-align: center;
  p {
    font-size: 26px;
    font-weight: 700;
  }
  div {
    font-size: 18px;
  }
  span {
    display: inline-block;
    font-weight: 400;
  }
}
</style>
