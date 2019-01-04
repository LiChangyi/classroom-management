#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午9:19
"""
from flask import request, g

from app.forms.topic import PostTopicForm, PutTopicForm, TopicIdForm
from app.forms.user import UserGetListForm
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.topic import TopicModel

api = Redprint('topic')

# 获取话题列表
@api.route('/list')
def get_topic_list():
  form = UserGetListForm(data=request.args)
  form.validate_for_api()
  page = form.page.data
  size = form.size.data
  keyword = str(request.args['keyword']) or '';
  count = TopicModel.objects(title__contains = keyword).count()
  topics = TopicModel.objects(title__contains = keyword).order_by('-created_at').skip((int(page) - 1) * int(size)).limit(int(size))
  list = []
  for topic in topics:
    list.append({
      'id': str(topic['id']),
      'title': topic['title'],
      'created_at': topic['created_at'],
      'adminName': topic['adminId']['name']
    })
  data = {
    'pagination': {
      'count': count,
      'size': int(size),
      'page': int(page)
    },
    'list': list
  }
  return Success(msg='获取成功!', data=data)


# 获取话题详情
@api.route('/<string:id>')
def get_topic(id):
  data = {
    'id': id
  }
  form = TopicIdForm(data=data)
  form.validate_for_api()
  return Success(msg='获取成功!', data=form.topic)


# 创建话题
@api.route('', methods = ['POST'])
@auth.login_required
def post_topic():
  data = request.json or {}
  data['adminId'] = g.user.id
  print(data)
  PostTopicForm().validate_for_api()
  TopicModel.add_topic(data= data)
  return Success(msg='创建话题成功!')

# 修改话题
@api.route('/<string:id>', methods = ['PUT'])
@auth.login_required
def put_topic(id):
  data = request.json or {}
  data['id'] = id
  data['adminId'] = g.user.id
  PutTopicForm(data=data).validate_for_api()
  TopicModel.put_topic(id, data=data)
  return Success(msg='修改话题成功!')

# 删除话题
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def delete_topic(id):
  data = {
    'id': id
  }
  form = TopicIdForm(data=data)
  form.validate_for_api()
  TopicModel.delete_topic(id)
  return Success(msg='删除话题成功!')

