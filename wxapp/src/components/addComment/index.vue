<template>
  <div class="add-comment-box" @touchmove.stop="touchmove">
    <div class="wrap">
      <h1 class="title">添加评论</h1>
      <div class="content">
        <textarea
          class="content-text"
          v-model="content" 
          :maxlength=contentMaxLength
          :placeholder="'输入评论的内容，最多'+contentMaxLength+'字'"
          :fixed="true"
          :auto-focus="true"
        ></textarea>
      </div>
      <div class="tool">
        <button class="tool-btn" @click="cancel">取消</button>
        <button class="tool-btn" @click="ok">发布</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['content'],
  data() {
    return {
      contentMaxLength: 150,
    }
  },
  methods: {
    touchmove(e) {
      // console.log(e)
    },
    cancel(e) {
      this.$emit('inputOk', false);
    },
    ok() {
      this.$emit('inputOk', this.content);
    }
  }
}
</script>


<style lang="scss">
.add-comment-box {
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 9;
  background: rgba(0,0,0,0.6);
  .wrap {
    width: 70vw;
    min-width: 250rpx;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20rpx;
  }
  .title {
    text-align: center;
    font-size: 52rpx;
  }
  .content-text {
    border: 1px solid #ccc;
    width: 100%;
    margin: 50rpx 0;
    padding: 10rpx;
    box-sizing: border-box;
  }
  .tool {
    text-align: right;
  }
  .tool-btn {
    display: inline-block;
    width: 140rpx;
    margin-left: 50rpx;
  }
}
</style>

