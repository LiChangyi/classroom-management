<template>
  <main class="register-page">
    <div class="avatar" @click="uploadTap">
      <img class="preview" :src="imgSrc" alt="img loading fail">
    </div>
    <div class="form-item">
      <span class="item-title">学号</span>
      <input class="content" type="text" v-model="schoolId">
    </div>
    <div class="form-item">
      <span class="item-title">姓名</span>
      <input class="content" type="text" v-model="name">
    </div>
    <div class="form-item">
      <span class="item-title">班级</span>
      <select class="content" @change="bindselectChange" :value="index" :range="list">
        {{list[index]}}
      </select>
    </div>
    <button class="submit" @click="submit">确定</button>
    <UploadImg
      v-if="isShow"
      :src="src"
      @getImage="getImage"
    />
  </main>
</template>

<script>
import UploadImg from '../../components/uploadImg';
import { GET_CLASSROOM_LIST, SET_USER_INFO } from '../../store/constants';
import { serverUrl } from '../../config';
import { mapState } from 'vuex';

const defaultSrc = '/static/img/add.png';

export default {
  beforeMount() {
    const { openid = '' } = this.$mp.query;
    this.openId = openid;
    console.log(this.classroom)
    if (this.classroom.is_request ) {
      this.get_classroom_list();
    }
    if (openid === '') {
      console.log(this.user);
      this.id = this.user.id;
      this.imgSrc = serverUrl + this.user.avatar;
      this.name = this.user.name;
      this.schoolId = this.user.schoolId;
      this.clsroom = this.user.classroom;
    }
  },
  data () {
    return {
      isShow: false,
      src: '',
      id: '',
      imgSrc: defaultSrc,
      index: 0,
      name: '',
      schoolId: '',
      openId: '',
      clsroom: '',
      isUpload: false
    }
  },
  components: { UploadImg },
  computed: {
    ...mapState([
      'classroom',
      'user'
    ]),
    list() {
      return this.classroom.list.map( item => item.name ); 
    },
    cur() {
      if ( this.clsroom !== '') {
        const index = this.classroom.list.findIndex(item => item.name === this.clsroom);
        if (index >= 0) {
          this.index = index;
        }
      }
    }
  },
  methods: {
    uploadTap () {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const src = res.tempFilePaths[0];
          this.isShow = true;
          this.src = src;
        }
      })
    },
    getImage (avatar) {
      this.isShow = false;
      if (!avatar) return;
      this.isUpload = true;
      this.imgSrc = avatar;
    },
    get_classroom_list() {
      this.$store.dispatch(GET_CLASSROOM_LIST);
    },
    bindselectChange(e) {
      const { value = 0 } = e.target;
      this.index = Number(value);
    },
    uploadFile(filePath) {
      return new Promise((reslove, reject) => {
        wx.uploadFile({
          url: serverUrl + '/api/user/upload',
          filePath,
          name: 'avatar',
          success: (res) => {
            reslove(JSON.parse(res.data));
          },
          fail: (err) => {
            reject(err);
          }
        })
      })
    },
    async submit() {
      const opts = {
        avatar: this.imgSrc,
        name: this.name,
        schoolId: this.schoolId,
        classId: this.classroom.list[this.index].id
      }
      if (opts.avatar === defaultSrc) {
        wx.showToast({
          title: '请上传头像！',
          icon: 'none'
        });
        return;
      }
      if (opts.name === '' || opts.schoolId === '' ) {
        wx.showToast({
          title: '请填写完整表单信息！',
          icon: 'none'
        });
        return;
      }
      const schoolIdReg = /^\d{12}$/;
      if ( !schoolIdReg.test(opts.schoolId) ) {
        wx.showToast({
          title: '学号必须是12位纯数字',
          icon: 'none'
        });
        return;
      }
      
      if (!this.isUpload) {
        // 不用上传图片
        opts.avatar = this.user.avatar;
        opts.id = this.id;
        this.$http.api_put_user(opts)
        .then(({success, msg}) => {
          if (!success) return;
            wx.showToast({
            title: msg
          })
          this.$store.commit(SET_USER_INFO, {
            avatar: opts.avatar,
            name: opts.name,
            schoolId: opts.schoolId,
            classroom: this.classroom.list[this.index].name
          })
        })
        .catch(err =>{
          console.log(err);
        })
      } else {
        // 需要上传图片
        // 先上传图片
        const { data = {} } = await this.uploadFile(opts.avatar);
        
        opts.avatar = data.filename;
        if ( this.openId !== '' ) {
          // 用户注册
          opts.wxId = this.openId;
          opts.type = 200;
          this.$http.api_post_user(opts)
          .then(({ success, msg }) => {
            if (!success) return;
            wx.showToast({
              title: msg
            })
            wx.redirectTo({
              url: `/pages/index/main`
            })
          })
          .catch(err =>{
            console.log(err);
          })
        } else {
          // 用户修改个人信息
          console.log(opts)
          opts.id = this.id;
          this.$http.api_put_user(opts)
          .then(({success, msg}) => {
            if (!success) return;
              wx.showToast({
              title: msg
            })
            this.$store.commit(SET_USER_INFO, {
              avatar: opts.avatar,
              name: opts.name,
              schoolId: opts.schoolId,
              classroom: this.classroom.list[this.index].name
            })
          })
          .catch(err =>{
            console.log(err);
          })
        }
      }
    }
  }
}

</script>

<style lang="scss">
.register-page {
  // padding: 20rpx;
  text-align: center;
  .avatar {
    width: 240rpx;
    height: 240rpx;
    margin: 20rpx auto;
    border: 1px solid #ccc;
    border-radius: 50%;
  }
  .preview {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .form-item {
    height: 52rpx;
    margin: 40rpx 0;
    font-size: 32rpx;
    line-height: 48rpx;
  }
  .item-title {
    display: inline-block;
    width: 120rpx;
    min-width: 120rpx;
    text-align: center;
    vertical-align: bottom;
  }
  .content {
    text-align: left;
    display: inline-block;
    width: 55%;
    box-sizing: border-box;
    height: 42rpx;
    vertical-align: bottom;
  }
  input {
    border-bottom: 1px dotted #ccc;
  }
  .submit {
    margin-top: 80rpx;
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
</style>

