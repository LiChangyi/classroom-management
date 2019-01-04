import * as constants from './constants';
const defaultPagination = {
  count: 0,
  page: 1,
  size: 10
}

const mutations = {
  [constants.SET_TOPIC_LIST] (state, data) {
    const list = [...state.topic.list].concat(data.list || []);
    state.topic = {
      is_request: false,
      list,
      pagination: data.pagination || defaultPagination
    }
  },
  [constants.SET_SHARE_LIST] (state, data) {
    const list = [...state.share.list].concat(data.list || []);
    state.share = {
      is_request: false,
      list,
      pagination: data.pagination || defaultPagination
    }
  },
  [constants.SET_CLASSROOM_LIST] (state, data) {
    state.classroom = {
      is_request: false,
      list: data
    }
  },
  [constants.SET_USER_INFO] (state, data) {
    state.user = Object.assign(state.user, data, {
      is_login: true
    });
    wx.setStorage({
      key: 'user',
      data: JSON.stringify(state.user)
    })
  }
}

export default mutations;
