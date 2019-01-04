<template>
  <div class="scan-box">
    <i 
      class="iconfont icon-SVG_saoyisao-miaobian"
      @click="scan"
    ></i>
    <span>扫码签到</span>
  </div>
</template>

<script>
export default {
  methods: {
    scan() {
      wx.scanCode({
        scanType: ['qrCode'],
        success: async ({result}) => {
          if (result) {
            // 签到
            try {
              const { success, msg } = await this.$http.api_post_sign({
                token: result
              });
              if (!success) return;
              wx.showToast({
                title: msg
              })
            } catch ( err ) {
              console.log(err);
              wx.showToast({
                title: '签到失败',
                image: '/static/img/fail.png'
              })
            }
          }
        },
        fail: () => {
          wx.showToast({
            title: '签到失败',
            image: '/static/img/fail.png'
          })
        }
      })
    }
  }
}
</script>


<style lang="scss">
.scan-box {
  height: 400rpx;
  text-align: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 50rpx;
  .iconfont {
    font-size: 200rpx;
    line-height: 300rpx;
  }
}
</style>
