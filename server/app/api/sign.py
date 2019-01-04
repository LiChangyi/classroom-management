#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-7 下午5:45
"""
from flask import request, g, current_app
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from app.forms.sign import PostSignForm, UserPostSignForm, SuperPostSignForm, GetSignListForm, SignIdForm, \
  SuperDeleteSignForm
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.sign import SignModel

api = Redprint('sign')

# 创建签到表
@api.route('', methods = ['POST'])
@auth.login_required
def post_sign():
  data = request.json or {}
  data['adminId'] = g.user.id
  PostSignForm(data = data).validate_for_api()
  token = create_token(data= data).decode('ascii')
  data['token'] = token
  id = SignModel.add_sign(data= data)
  return Success(msg='创建签到表成功', data= {
    'id': id
  })

# 删除签到表
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def delete_sign(id):
  data = {
    'id': id
  }
  SignIdForm(data= data).validate_for_api()
  SignModel.delete_sign(signId= id)
  return Success(msg='删除签到表成功')


# 学生签到
@api.route('/user', methods = ['POST'])
@auth.login_required
def user_post_sign():
  data = request.json or {}
  userId = g.user.id
  data['userId'] = userId
  UserPostSignForm(data= data).validate_for_api()
  SignModel.user_sign(
    token= data['token'],
    userId= userId
  )
  return Success(msg='签到成功')

# 查看签到表 列表
@api.route('/list')
@auth.login_required
def get_sign_list():
  data = request.args
  form = GetSignListForm(data= data)
  form.validate_for_api()
  res = SignModel.get_sign_list(
    page= form.page.data,
    size= form.size.data,
    classId= form.classId.data
  )
  return Success(msg= '获取成功!', data= res)

# 获取签到表详情
@api.route('/<string:id>')
def get_sign(id):
  data = {
    'id': id
  }
  form = SignIdForm(data= data)
  form.validate_for_api()
  is_effective = form.is_effective
  sign = form.sign
  classrooms = []
  for room in sign['classroomIds']:
    classrooms.append({
      'id': str(room['id']),
      'name': room['name'],
      'stuNum': room['stuNum']
    })
  users = []
  for user in sign['signUsers']:
    users.append({
      'id': str(user['id']),
      'name': user['name'],
      'schoolId': user['schoolId'],
      'avatar': user['avatar']
    })
  res = {
    'id': str(sign['id']),
    'adminName': sign['adminId']['name'],
    'created_at': sign['created_at'],
    'name': sign['name'],
    'token': sign['token'],
    'classrooms': classrooms,
    'users': users,
    'is_effective': is_effective
  }
  return Success(msg= '查询成功!', data= res)


# 管理员手动添加签到
@api.route('/super', methods = ['POST'])
@auth.login_required
def super_post_sign():
  data = request.json or {}
  form = SuperPostSignForm(data= data)
  form.validate_for_api()
  SignModel.super_user_sign(
    signId= data['signId'],
    signUsers = form.signUsers
  )
  return Success(msg= '签到成功')

# 管理员手动删除签到成员
@api.route('/super', methods = ['DELETE'])
@auth.login_required
def super_delete_sign():
  data = request.json or {}
  print(data)
  form = SuperDeleteSignForm(data= data)
  form.validate_for_api()
  SignModel.super_delete_user_sign(
    signId= data['signId'],
    signUsers=  form.signUsers
  )
  return Success(msg= '删除成功')


# 生成签到表token
def create_token(data):
  name = data['name']
  classroomIds = data['classroomIds']
  expiration = int(data['expiration'])
  s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
  return s.dumps({
    'name': name,
    'classroomIds': classroomIds
  })


