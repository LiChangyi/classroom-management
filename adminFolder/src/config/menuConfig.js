module.exports = [
  {
    path: '/home',
    key: 'home',
    title: '首页'
  }, {
    path: '/user',
    key: 'user',
    title: '用户管理'
  }, {
    path: '/classroom',
    key: 'classroom',
    title: '班级管理'
  }, {
    key: 'topic',
    title: '话题管理',
    children: [
      {
        path: '/topic/list',
        key: 'topic.list',
        title: '话题列表'
      },
      {
        path: '/topic/add',
        key: 'topic.add',
        title: '添加话题'
      }
    ]
  }, {
    key: 'share',
    title: '分享管理',
    children: [
      {
        path: '/share/list',
        key: 'share.list',
        title: '分享列表'
      },
      {
        path: '/share/add',
        key: 'share.add',
        title: '添加分享'
      }
    ]
  }, {
    key: 'sign',
    title: '签到管理',
    children: [
      {
        path: '/sign/list',
        key: 'sign.list',
        title: '签到表列表'
      }, {
        path: '/sign/add',
        key: 'sign.add',
        title: '创建签到表'
      }
    ]
  }
]