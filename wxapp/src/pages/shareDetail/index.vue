<template>
  <main class="share-detail-page">
    <article>
      <h1 class="title">{{share.title}}</h1>
      <div class="other-info">
        <span class="author">管理员:{{share.author}}</span>
        <span class="time">时间:{{formatCreatedAt}}</span>
      </div>
      <div class="content">
        <wxParse :content="share.content" />
      </div>
    </article>
  </main>
</template>

<script>
import wxParse from 'mpvue-wxparse';
import { formatTime } from '../../utils/formatTime';

export default {
  components: {wxParse},
  data() {
    return {
      share: {
        adminName: "",
        content: "",
        created_at: "",
        id: "",
        title: ""
      }
    }
  },
  beforeMount () {
    const { id = "" } = this.$mp.query;
    this.share = {
      adminName: "",
      content: "",
      created_at: "",
      id: "",
      title: ""
    }
    this.get_detail(id);
  },
  methods: {
    async get_detail(id) {
      const { success, data } = await this.$http.api_get_share(id);
      if (!success) return;
      this.share = data;
    }
  },
  computed: {
    formatCreatedAt() {
      return formatTime(this.share.created_at);
    }
  }
}
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>

<style lang="scss">
.share-detail-page {
  padding: 30rpx;
  .title {
    font-size: 42rpx;
  }
  .other-info {
    font-size: 28rpx;
    color: #777;
    margin: 20rpx 0;
  }
  .author {
    margin-right: 50rpx;
  }
}
</style>
