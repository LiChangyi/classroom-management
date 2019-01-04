<template>
  <main class="home-page">
    <Scan />
    <h1 class="title">资源分享列表</h1>
    <div class="share-box">
      <div class="share-item"
        v-for="item in list"
        :key="item.id"
        @click="toShareDetail(item.id)"
      >
        <p class="item-title">{{item.title}}</p>
        <p class="tool">{{item.adminName}} {{item.created_at}}</p>
      </div>
    </div>
    <p class="tips" @click="loading(tips.is_loading)">{{tips.message}}</p>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import { GET_SHARE_LIST } from '../../store/constants';
import { formatTime } from '../../utils/formatTime';
import Scan from '../../components/scan';

export default {
  beforeMount() {
    if ( this.share.is_request ) {
      this.get_share_list();
    }
  },
  computed: {
    ...mapState([
      'share'
    ]),
    pagination() {
      return this.share.pagination;
    },
    list() {
      return this.share.list.map(item => {
        item.created_at = formatTime(item.created_at);
        return item;
      })
    },
    tips() {
      const count = this.share.pagination.count || 0;
      const length = this.share.list.length;
      return length < count ? {is_loading: true, message: "加载更多" } : {is_loading: false, message: "没有啦~~" };
    }
  },
  methods: {
    loading(mark = false) {
      if (!mark) return;
       this.get_share_list(Object.assign(this.pagination, {
        page: this.pagination.page + 1
      }))
    },
    get_share_list(opts = this.pagination) {
      this.$store.dispatch(GET_SHARE_LIST, opts);
    },
    toShareDetail(id) {
      wx.navigateTo({
        url: `/pages/shareDetail/main?id=${id}`
      });
    }
  },
  components: { Scan }
}
</script>

<style lang="scss">
.home-page {
  padding: 10rpx;
  .title {
    font-size: 42rpx;
  }
  .share-item {
    border-bottom: 1px solid #ccc;
    margin-top: 10rpx;
    padding: 10rpx;
    .item-title {
      font-size: 36rpx;  
    }
    .tool {
      color: #333;
      font-size: 28rpx;
      text-align: right;
    }
  }
}
</style>
