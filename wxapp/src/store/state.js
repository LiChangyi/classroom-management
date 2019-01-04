const defaultPagination = {
  count: 0,
  page: 1,
  size: 10
}

let user = {
  is_login: false,
  avatar: '',
  id: '',
  name: '',
  token: '',
  classroom: '',
  schoolId: ''
}

try {
  const data = wx.getStorageSync('user');
  if (data) {
    user = JSON.parse(data);
  }
} catch (e) {
  console.log(e);
}

const state = {
  // 话题列表
  topic: {
    is_request: true,
    list: [],
    pagination: defaultPagination
  },
  // 分享列表
  share: {
    is_request: true,
    list: [],
    pagination: defaultPagination
  },
  // 班级列表
  classroom: {
    is_request: true,
    list: []
  },
  // 用户信息
  user: user
}

export default state;
