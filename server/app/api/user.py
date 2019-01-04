#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午1:49
"""
import datetime
import os
import random

from bson import ObjectId
from flask import request, g

from app.forms.user import UserRegisterForm, UserPutForm, UserDeleteForm, UserGetListForm
from app.libs.error import FormValidateError
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.classes import ClassModel
from app.models.user import UserModel

api = Redprint('user')

# 获取用户信息(获取自己的)
@api.route('')
@auth.login_required
def get_user():
  id = g.user.id
  data = UserModel.get_user(id)
  return Success(msg="获取用户信息成功!", data= data)


# 用户注册
@api.route('', methods = ['POST'])
def post_user():
  data = request.json
  form = UserRegisterForm(data= data)
  form.validate_for_api()
  print(request.json)
  UserModel.add_user(data = data)
  return Success(msg="注册成功!")


# 用户自己修改自己的信息
@api.route('', methods = ['PUT'])
@auth.login_required
def put_user():
  data = request.json or {}
  id = g.user.id
  data['id'] = id
  form = UserPutForm()
  form.validate_for_api()
  UserModel.put_user(id, data=data)
  return Success(msg='修改个人信息成功!')


# 管理员修改用户信息
@api.route('/<string:id>', methods = ['PUT'])
@auth.login_required
def super_put_user(id):
  data = request.json or {}
  data['id'] = id
  form = UserPutForm()
  form.validate_for_api()
  UserModel.put_user(id, data=data)
  return Success(msg='修改用户信息成功!')

# 管理员删除用户
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def super_delete_user(id):
  data = {
    "id": id
  }
  form = UserDeleteForm(data=data)
  form.validate_for_api()
  UserModel.delete_user(id)
  return Success(msg='删除用户成功!')


# 获取用户列表
@api.route('/list')
@auth.login_required
def get_user_list():
  data = request.args or {}
  form = UserGetListForm(data= data)
  form.validate_for_api()
  page = form.page.data
  size = form.size.data
  userName = data['userName'] or ''
  schoolId = data['schoolId'] or ''
  classroom = data['classroom'] or ''
  if classroom != '':
    try:
      classroom = ObjectId(classroom)
    except:
      return FormValidateError(msg= '班级id有误')
    cls = ClassModel.objects(id = classroom).first()
    if cls is None:
      return FormValidateError(msg='班级id有误')
    count = UserModel.objects(name__contains=userName, schoolId__contains=schoolId, classId = cls).count()
    users = UserModel.objects(name__contains=userName, schoolId__contains=schoolId, classId = cls).order_by('classId',
                                                                                             'schoolId').skip(
      (int(page) - 1) * int(size)).limit(int(size))
  else:
    count = UserModel.objects(name__contains = userName, schoolId__contains = schoolId).count()
    users = UserModel.objects(name__contains = userName, schoolId__contains = schoolId).order_by('classId', 'schoolId').skip((int(page)-1) * int(size)).limit(int(size))

  list = []
  for user in users:
    list.append({
      'id': str(user['id']),
      'name': user['name'],
      'classId': str(user['classId']['id']),
      'classname': str(user['classId']['name']),
      'schoolId': user['schoolId'],
      'avatar': user['avatar']
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


basedir = os.path.abspath(os.path.dirname(__name__)) + '/static/avatar/'
@api.route('/upload', methods=['POST'])
def upload_avatar():
  avatar = request.files['avatar']
  filename = create_uuid() + '.png'
  avatar.save(os.path.join(basedir,filename))
  return Success(msg='上传图片成功！', data= {
    'filename': '/avatar/' + filename
  })

def create_uuid():
  nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
  randomNum = random.randint(0,100)
  if randomNum <= 10:
    randomNum = str(0) + str(randomNum)
  uniqueNum = str(nowTime) + str(randomNum)
  return uniqueNum