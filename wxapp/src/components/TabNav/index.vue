<template>
  <div class="tabbar">
    <div 
      v-for="(item, index) in navList"
      :key="index"
      @click="selectNavItem(index, item.pagePath)"
      :class="index === tabBarIndex ? 'tabbar-item active' : 'tabbar-item'"
    >
      <i :class="'iconfont ' + item.fontClass"></i>
      <span class="nav-title">{{item.text}}</span>
    </div>
  </div>
</template>

<script>
const navList = [
  {
    pagePath: '/pages/home/main',
    fontClass: 'icon-shouye',
    text: '首页'
  }, {
    pagePath: '/pages/topic/main',
    fontClass: 'icon-xuexi',
    text: '话题'
  }, {
    pagePath: '/pages/user/main',
    fontClass: 'icon-gerenzhongxinwoderenwubiaozhuntoumianxing',
    text: '个人'
  }
]
import { SET_TABBARINDEX } from '../../store/constants';
export default {
  data () {
    return {
      navList
    }
  },
  methods: {
    selectNavItem (index, pagePath) {
      const { tabBarIndex } = this.$store.state;
      if ( index === this.tabBarIndex ) return false;
      this.$store.commit(SET_TABBARINDEX, index);
      wx.switchTab({
        url: pagePath
      })
    }
  },
  computed: {
    tabBarIndex() {
      return this.$store.state.tabBarIndex;
    }
  }
}
</script>

<style lang="scss">
$height: 120rpx;
.tabbar {
  padding: 10rpx 0;
  display: flex;
  height: $height;
  min-height: $height;
  background-color: #1a1818;
  color: #fff;
  .tabbar-item {
    flex-grow: 1;
    min-width: 33%;
    text-align: center;
    color: #fff;
    transform: all .24s;
  }
  .iconfont {
    height: 0.618 * $height;
    line-height: 0.618 * $height;
    font-size: 52rpx;
  }
  .nav-title {
    font-size: 30rpx;
  }
  .active {
    color: #efb336;
  }
}
</style>
