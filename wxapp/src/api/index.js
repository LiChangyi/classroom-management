import Fly from 'flyio/dist/npm/wx';
import { serverUrl, appid, secret } from '../config';

const fly = new Fly();
fly.config.baseURL = serverUrl;

// 请求拦截器
fly.interceptors.request.use((request) => {
  wx.showLoading({
    title: 'loading',
    mask: true
  });
  try {
    const data = wx.getStorageSync('user');
    if (data) {
      const { token } = JSON.parse(data) || {};
      if (token) {
        request.headers.Authorization = `token ${token}`;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return request;
})

// 响应拦截器
fly.interceptors.response.use(
  response => {
    wx.hideLoading();
    return response.data;
  },
  err => {
    const { msg } = err.response.data;
    wx.hideLoading();
    wx.showToast({
      title: msg,
      image: '/static/img/fail.png',
      duration: 3000
    });
    const status = err.status;
    if (status === 401) {
      wx.redirectTo({
        url: '/pages/index/main'
      })
    }
    return Promise.reject(err.response.data);
  }
);

export default {
  // 获取用户的 openId
  api_get_openId (code) {
    return fly.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`);
  },
  // 获取token
  api_get_token (id) {
    return fly.post(`/api/token`, {
      wxId: id,
      type: 200
    });
  },
  // 获取话题列表
  api_get_topic_list ({page = 1, size = 10}) {
    return fly.get(`/api/topic/list?page=${page}&size=${size}&keyword=`);
  },
  // 获取分享列表
  api_get_share_list ({page = 1, size = 10}) {
    return fly.get(`/api/share/list?page=${page}&size=${size}&keyword=`);
  },
  // 获取分享详情
  api_get_share (id) {
    return fly.get(`/api/share/${id}`);
  },
  // 获取话题详情
  api_get_topic (id) {
    return fly.get(`/api/topic/${id}`);
  },
  // 根据topicId 获取评论列表
  api_get_comment_list ({id, page = 1, size = 10} = {}) {
    return fly.get(`/api/comment/list?topicId=${id}&page=${page}&size=${size}`);
  },
  // 获取班级列表
  api_get_classroom_list () {
    return fly.get('/api/classroom');
  },
  // 用户注册
  api_post_user (data) {
    return fly.post('/api/user', data);
  },
  // 用户修改个人信息
  api_put_user (data) {
    return fly.put('/api/user', data);
  },
  // 根据id 获取用于信息
  api_get_user () {
    return fly.get(`/api/user`);
  },
  // 用户评论
  api_post_comment (data) {
    return fly.post(`/api/comment`, data);
  },
  // 用户删除评论
  api_delete_comment (id) {
    return fly.delete(`/api/comment/${id}`);
  },
  // 用户修改评论
  api_put_comment (id, data) {
    return fly.put(`/api/comment/${id}`, data);
  },
  // 用户签到
  api_post_sign (data) {
    return fly.post('/api/sign/user', data);
  }
}
