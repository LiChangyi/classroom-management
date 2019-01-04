<template>
  <main class="topic-detail-page">
    <article>
      <h1 class="title">{{topic.title}}</h1>
      <div class="other-info">
        <span class="author">管理员:{{topic.author}}</span>
        <span class="time">时间:{{formatCreatedAt}}</span>
      </div>
      <div class="content">
        <wxParse :content="topic.content" />
      </div>
    </article>
    <div class="comment-box">
      <h1 class="title">用户留言</h1>
      <CommentItem 
        v-for="item in list"
        :key="item.id"
        :data="item"
        @deleteComment="deleteComment"
        @changeComment="changeComment"
      />
      <div class="tips" @click="loading(tips.is_loading)">{{tips.msg}}</div>
    </div>
    <i class="iconfont icon-liuyan add-comment-btn"
      @click="addCommentBtn"
    ></i>
    <addComment
      v-if="isShow"
      :content="message"
      @inputOk="inputOk"
    />
  </main>
</template>

<script>
import wxParse from 'mpvue-wxparse';
import CommentItem from '../../components/CommentItem';
import addComment from '../../components/addComment';
import { formatTime } from '../../utils/formatTime';
import { mapState } from 'vuex';

const actions = ['add', 'change'];

export default {
  components: { wxParse, CommentItem, addComment },
  beforeMount () {
    const { id = "" } = this.$mp.query;
    this.list = [];
    this.id = id;
    this.topic = {
      id: '',
      title: '',
      author:'',
      content: '',
      created_at: '',
    }
    this.get_detail(id);
  },
  data () {
    return {
      topic: {
        id: '',
        title: '',
        author:'',
        content: '',
        created_at: '',
      },
      pagination: {
        count: 0,
        size: 10,
        page: 1
      },
      list: [],
      isShow: false,
      action: actions[0],
      message: ''
    }
  },
  methods:{
    async get_detail(id) {
      const { success, data } = await this.$http.api_get_topic(id);
      if (!success) return;
      this.topic = {
        id: data.id,
        title: data.title,
        author: data.adminName,
        content: data.content,
        created_at: data.created_at
      }
      this.get_comment_list();
    },
    // 获取评论列表
    async get_comment_list() {
      const opts = {
        id: this.id,
        page: this.pagination.page,
        size: this.pagination.size
      }
      const { success, data } = await this.$http.api_get_comment_list(opts);
      if (!success) return;
      const { list, pagination } = data;
      this.pagination = pagination;
      this.list = [...this.list].concat(list || []);
    },
    loading(mark = false) {
      if (!mark) return;
      this.pagination.page++;
      this.get_comment_list();
    },
    inputOk(content) {
      if (content === '') {
        wx.showToast({
          title: '请输入内容',
          image: '/static/img/fail.png'
        })
        return;
      }
      if (!content) {
        this.isShow = false;
        return;
      }
      if ( this.action === actions[0] ) {
        // 添加评论
        this.addUserComment(content);
      } else if ( this.action === actions[1]) {
        // 修改评论
        this.changeUserComment(content);
      }
      
    },
    // 添加评论
    async addUserComment(content) {
      const { success, msg } = await this.$http.api_post_comment({
        topicId: this.id,
        content
      });
      if (!success) return;
      wx.showToast({
        title: msg
      })
      this.isShow = false;
      this.list.unshift({
        avatar: this.user.avatar,
        className: this.user.classroom,
        content,
        created_at: new Date(),
        id: '',
        schoolId: this.user.schoolId,
        userId: this.user.id,
        userName: this.user.name,
      })
    },
    // 修改评论
    async changeUserComment(content) {
      try {
        const id = this.curId;
        const { success, msg } = await this.$http.api_put_comment(id, {
          topicId: this.id,
          content
        });
        if (!success) return;
        wx.showToast({
          title: msg
        })
        this.isShow = false;
        const index = this.list.findIndex(item => item.id === id);
        if ( index >= 0 ) {
          this.list[index].content = content;
        }
      } catch(err) {
        console.log(err);
      }
    },
    // 删除评论
    deleteComment(id) {
      if (id === '') {
        wx.showToast({
          title: "删除失败,请重新进入此页!",
          icon: 'none'
        })
        return;
      }
      wx.showModal({
        title: '删除留言',
        content: '是否删除此条留言,此操作不能回退,请谨慎操作!',
        showCancel: true,
        success: async (res) =>{
          if (res.confirm) {
            const { success, msg } = await this.$http.api_delete_comment(id);
            if (!success) return;
            wx.showToast({
              title: msg
            })
            const index = this.list.findIndex(item => item.id === id);
            if (index >= 0) {
              this.list.splice(index, 1);
            }
          }
        }
      })
    },
    // 修改评论
    changeComment(id) {
      if (id === '') {
        wx.showToast({
          title: "修改失败,请重新进入此页!",
          icon: 'none'
        })
        return;
      }
      wx.showModal({
        title: '修改留言',
        content: '是否修改此条留言,此操作不能回退,请谨慎操作!',
        showCancel: true,
        success: (res) =>{
          this.action = actions[1];
          const index = this.list.findIndex(item => item.id === id);
          this.curId = id;
          this.message = this.list[index].content;
          this.isShow = true;
        }
      })
    },
    addCommentBtn() {
      this.action = actions[0];
      this.message = '';
      this.isShow = true;
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    formatCreatedAt() {
      return formatTime(this.topic.created_at);
    },
    tips() {
      if ( this.list.length === 0 ) {
        return {
          msg: "还没有人留言...",
          is_loading: false
        }
      }
      if ( this.pagination.count > this.list.length ) {
        return {
          msg: "加载更多",
          is_loading: true
        }
      }
      return {
        msg: '没有啦!',
        is_loading: false
      }
    }
  }
}
</script>

<style>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>

<style lang="scss">
.topic-detail-page {
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
  .add-comment-btn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    font-size: 42rpx;
    background-color: #1a1818;
    position: fixed;
    right: 40rpx;
    bottom: 40rpx;
    color: #fff;
    line-height: 80rpx;
    text-align: center;
    box-shadow: 0 0 10px #ccc;
  }
}
</style>
