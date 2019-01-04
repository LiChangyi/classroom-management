<template>
  <main class="topic-page">
    <ul>
      <li
        class="topic-item"
        v-for="(item, index) in list"
        :key="index"
        @click="gotoTopicDetail(item.id)"
      >
        <p class="title">{{item.title}}</p>
        <p class="author">author: {{item.adminName}}</p>
        <p class="time">{{item.created_at}}</p>
      </li>
    </ul>
    <p class="tips" @click="loading(tips.is_loading)">{{tips.message}}</p>
  </main>
</template>

<script>
import { formatTime } from '../../utils/formatTime';
import { GET_TOPIC_LIST } from '../../store/constants';

export default {
  beforeMount() {
    if ( this.$store.state.topic.is_request ) {
      this.get_topic_list();
    }
  },
  computed: {
    list() {
      return this.$store.state.topic.list.map(item => {
        item.created_at = formatTime(item.created_at);
        return item;
      })
    },
    pagination() {
      return this.$store.state.topic.pagination;
    },
    tips() {
      const count = this.$store.state.topic.pagination.count || 0;
      const length = this.$store.state.topic.list.length;
      return length < count ? {is_loading: true, message: "加载更多" } : {is_loading: false, message: "没有啦~~" };
    }
  },
  methods: {
    get_topic_list(opts = this.pagination) {
      this.$store.dispatch(GET_TOPIC_LIST, opts);
    },
    loading(bool) {
      if ( !bool ) return;
      this.get_topic_list(Object.assign(this.pagination, {
        page: this.pagination.page + 1
      }))
    },
    gotoTopicDetail(id) {
      wx.navigateTo({
        url: `/pages/topicDetail/main?id=${id}`
      });
    }
  }
}
</script>

<style lang="scss">
.topic-page {
  padding: 20rpx;
  .topic-item {
    padding: 20rpx 10rpx;
    border-bottom: 1px solid #ccc;
  }
  .title {
    margin: 5rpx 0;
    font-size: 36rpx;
    line-height: 54rpx;
    max-height: 108rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .author {
    font-size: 32rpx;
    margin-top: 10rpx;
  }
  .time {
    font-size: 30rpx;
    text-align: right;
  }
}
</style>

