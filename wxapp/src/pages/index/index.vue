<template>
  <main class="index-page">
    <h1 class="title">Python 课堂管理</h1>
    <p class="msg">{{tips.msg}}</p>
    <button class="btn" @click="jump">{{tips.btnTitle}}</button>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import { SET_USER_INFO } from '../../store/constants';

export default {
  mounted(){
    if (!this.user.is_login) {
      this.login();
      return;
    }
    this.is_register = true;
  },
  methods: {
    login () {
      wx.login({
        success: async (res) => {
          if (res.code) {
            res = await this.$http.api_get_openId(res.code);
            if (res.errmsg) {
              wx.showToast({
                title: res.errmsg,
                image: '/static/img/fail.png'
              });
              return;
            }
            // 将获取到的openId 拿去后台获取token
            try {
              const { success, data } = await this.$http.api_get_token(res.openid);
              if (!success) return;
              this.$store.commit(SET_USER_INFO, data)
              this.is_register = true;  
            } catch (err) {
              this.openid = res.openid;
              this.is_register = false;
            }
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    jump() {
      if (!this.is_register) {
        wx.redirectTo({
          url: `/pages/register/main?openid=${this.openid}`
        })
      } else {
        wx.switchTab({
          url: '/pages/user/main'
        })
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    tips() {
      if (!this.is_register) {
        return {
          msg: '还没有注册去完善信息！',
          btnTitle: '去完善信息'
        }
      }
      return {
        msg: '',
        btnTitle: '进入应用'
      }
    }
  },
  data () {
    return {
      is_register: false,
      openid: ''
    }
  }
}
</script>

<style lang="scss">
.index-page {
  height: 100vh;
  box-sizing: border-box; 
  overflow: hidden;
  background-color: #fff;
  color: #1a1818;
  text-align: center;
  padding-top: 25%;
  .title {
    font-size: 62rpx;
    font-weight: bold;
  }
  .msg {
    margin: 40rpx 0;
    font-size: 32rpx;
  }
  .btn {
    margin-top: 100rpx;
  }
}
</style>
