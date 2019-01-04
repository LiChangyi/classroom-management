<template>
  <div class="comment-item">
    <div class="header">
      <div class="avatar-box">
        <img :src="serverUrl + data.avatar" alt="loading fail">
      </div>
      <div class="info">
        <div class="user">{{data.userName}}({{data.schoolId}})</div>
        <p class="classroom">{{data.className}}</p>
      </div>
      <span class="change comment-btn" v-if="isShow" @click="changeComment">修改</span>
      <span class="delete comment-btn" v-if="isShow" @click="deleteComment">删除</span>
    </div>
    <div class="content">
      {{data.content}}
    </div>
    <p class="time">{{formatCreatedAt}}</p>
  </div>
</template>

<script>
import { formatTime } from '../../utils/formatTime';
import { serverUrl } from '../../config';
import { mapState } from 'vuex';

export default {
  props: ['data'],
  computed: {
    ...mapState([
      'user'
    ]),
    serverUrl() {
      return serverUrl;
    },
    formatCreatedAt() {
      return formatTime(this.data.created_at);
    },
    isShow() {
      return this.user.id === this.data.userId;
    }
  },
  methods: {
    deleteComment() {
      this.$emit('deleteComment', this.data.id);
    },
    changeComment() {
      this.$emit('changeComment', this.data.id);
    }
  }
}
</script>


<style lang="scss">
$headerH: 100rpx;
.comment-item {
  margin: 10rpx 0;
  border-bottom: 1px solid #ccc;
  padding: 10rpx;
  .header {
    position: relative;
    display: flex;
    height: $headerH;
  }
  .avatar-box {
    min-width: $headerH;
    width: $headerH;
    height: $headerH;
    align-items:center;
    img {
      width: $headerH;
      height: $headerH;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .info {
    flex: 1;
    align-items:center;
    margin-left: 30rpx;
    box-sizing: border-box;
    padding: 0.1 * $headerH 0;
    .user {
      line-height: 0.5 * $headerH;
      font-size: 34rpx;
      color: #000;
    }
    .classroom {
      line-height: 0.35 * $headerH;
      font-size: 28rpx;
      color: #777;
    }
  }
  .content {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx;
  }
  .time {
    font-size: 28rpx;
    color: #666;
    text-align: right;
  }
  .comment-btn {
    position: absolute;
    top: 20rpx;
    height: 40rpx;
    line-height: 1.5;
    padding: 0 10rpx;
    border-radius: 10rpx;
    font-size: 26rpx;
    color: #fff;
  }
  .delete {
    right: 0;
    background-color: #f50;
  }
  .change {
    right: 80rpx;
    background-color: #1890ff;
  }
}
</style>
