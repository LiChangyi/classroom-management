<template>
  <main class="user-page">
    <div class="user-info">
      <img class="avatar" :src="serverUrl + user.avatar" alt="avatar">
      <p class="user-name">{{user.name}}</p>
      <p class="user-schoolId">{{user.schoolId}}</p>
      <p class="classroom">{{user.classroom}}</p>
      <button class="change-info-btn" @click="jump">修改信息</button>
    </div>
  </main>
</template>

<script>
import { GET_USER_INFO } from '../../store/constants';
import { serverUrl } from '../../config';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'user'
    ]),
    serverUrl() {
      return serverUrl;
    }
  },
  beforeMount() {
    if ( this.user.schoolId === '' ) {
      this.$store.dispatch(GET_USER_INFO);
    } 
  },
  methods: {
    jump() {
      wx.navigateTo({
        url: '/pages/register/main'
      })
    }
  }
}
</script>


<style lang="scss">
.user-page {
 .user-info {
   width: 100%;
   text-align: center;
   padding-top: 180rpx;
   .avatar {
     width: 320rpx;
     height: 320rpx;
     border-radius: 50%;
   }
   .user-name {
     font-size: 62rpx;
     font-weight: bold;
     margin: 20rpx 0;
   }
   .user-schoolId, .classroom {
     font-size: 42rpx;
   }
   .user-schoolId {
    margin: 20rpx 0 5rpx;
   }
   .change-info-btn {
     margin-top: 40rpx;
     width: 320rpx;
     height: 80rpx;
     line-height: 80rpx;
     background: #efb336;
     color: #fff;
     border-radius: 14rpx;
     &:active {
      background: #fff;
      border: 1px solid #efb336;
      color: #efb336;
     }
   }
 }
}
</style>
