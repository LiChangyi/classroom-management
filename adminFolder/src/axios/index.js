import axios from 'axios';
import { createHashHistory } from 'history';
import { message } from 'antd';

const history = createHashHistory();

// 全局设置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

// request 拦截器
instance.interceptors.request.use(
  config => {
    // 每次发送请求，检查 sessionStorage 中是否有 token,如果有放在headers中
    const user = JSON.parse(window.sessionStorage.getItem('user')) || {};
    const token = user.token || '';
    if( token !== '' ){
      config.headers.Authorization = `token ${token}`;
    }
    message.loading('loading...!', 0);
    return config;
  },
  err => {
    return Promise.reject(err);
  }
)

// response 拦截器
instance.interceptors.response.use(
  response => {
    message.destroy();
    return response.data;
  },
  error => {
    const { response = {} } = error;
    const { status } = response;
    message.destroy();
    // 没有登录,跳转到登录页面
    if ( status === 401 ){
      const { msg } = response.data;
      msg && message.error(msg);
      history.push('/login');
    }
    // 表单填写错误
    if ( status === 400 ) {
      const { msg } = response.data;
      message.error(msg);
    }
    return false;
  }
)

export default {
  // 管理员登录 
  api_get_token(data) {
    return instance.post('/api/token', data);
  },
  // 获取用户列表
  api_get_user_list({page = 1, size = 10, userName = '', schoolId = '', classroom = ''}){
    classroom = classroom === 'all' ? '' : classroom;
    const url = `/api/user/list?page=${page}&size=${size}&userName=${userName}&schoolId=${schoolId}&classroom=${classroom}`;
    return instance.get(url);
  },
  // 获取班级列表
  api_get_classroom_list() {
    return instance.get('/api/classroom')
  },
  // 添加班级
  api_post_classroom(data) {
    return instance.post('/api/classroom', data);
  },
  // 修改班级
  api_put_classroom({id, name}) {
    return instance.put(`/api/classroom/${id}`, { name });
  },
  // 删除班级
  api_delete_classroom(id) {
    return instance.delete(`/api/classroom/${id}`);
  },
  // 修改学生信息
  api_put_user({ id,data }) {
    return instance.put(`/api/user/${id}`, data);
  },
  // 删除学生
  api_delete_user(id) {
    return instance.delete(`/api/user/${id}`)
  },
  // 获取话题列表
  api_get_topic_list({ page = 1, size = 10, keyword = '' }) {
    return instance.get(`/api/topic/list?page=${page}&size=${size}&keyword=${keyword}`);
  },
  // 获取话题详情
  api_get_topic(id) {
    return instance.get(`/api/topic/${id}`);
  },
  // 修改话题
  api_put_topic(id, data) {
    return instance.put(`/api/topic/${id}`, data);
  },
  // 添加话题
  api_post_topic(data) {
    return instance.post('/api/topic', data);
  },
  // 删除话题
  api_delete_topic(id) {
    return instance.delete(`/api/topic/${id}`);
  },
  // 根据 topic Id 来获取评论
  api_get_comment_list({topicId = '', page = 1, size = 10 } = {}) {
    return instance.get(`/api/comment/list?topicId=${topicId}&page=${page}&size=${size}`);
  },
  // 修改评论
  api_put_comment(id, data) {
    return instance.put(`/api/comment/super/${id}`, data);
  },
  // 删除评论
  api_delete_comment(id) {
    return instance.delete(`/api/comment/super/${id}`);
  },
  // 获取分享列表
  api_get_share_list({ page = 1, size = 10, keyword = '' }) {
    return instance.get(`/api/share/list?page=${page}&size=${size}&keyword=${keyword}`);
  },
  // 获取话题详情
  api_get_share(id) {
    return instance.get(`/api/share/${id}`);
  },
  // 添加分享
  api_post_share(data) {
    return instance.post('/api/share', data);
  },
  // 修改分享
  api_put_share(id, data) {
    return instance.put(`/api/share/${id}`, data);
  },
  // 删除分享
  api_delete_share(id) {
    return instance.delete(`/api/share/${id}`);
  },
  // 获取签到列表
  api_get_sign_list({current = 1, pageSize = 10, classId = ''} = {}) {
    let url = `/api/sign/list?page=${current}&size=${pageSize}`;
    if (classId !== 'all' && classId !== '' ) {
      url += `&classId=${classId}`;
    }
    return instance.get(url);
  },
  // 删除签到表
  api_delete_sign(id) {
    return instance.delete(`/api/sign/${id}`);
  },
  // 签到表详情
  api_get_sign(id) {
    return instance.get(`/api/sign/${id}`);
  },
  // 删除用户的签到
  api_delete_sign_user(data) {
    return instance.delete(`/api/sign/super`, {data});
  },
  // 帮用户签到
  api_post_sign_user(data) {
    return instance.post(`/api/sign/super`, data);
  },
  // 创建签到表
  api_post_sign(data) {
    return instance.post('/api/sign', data);
  }
}
