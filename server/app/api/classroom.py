#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午8:54
"""
from flask import request
from pymongo import auth

from app.forms.classroom import ClassRoomForm, ClassRoomPutForm, ClassRoomDeleteForm
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.classes import ClassModel
from app.models.user import UserModel

api = Redprint('classroom')


# 获取班级列表
@api.route('')
def get_classroom():
  classrooms = ClassModel.objects().order_by('name')
  data = []
  for cls in classrooms:
    data.append({
      'id': str(cls['id']),
      'name': cls['name'],
      'stuNum': cls['stuNum']
    })
  return Success(msg='获取班级列表成功!',data=data)

# 添加班级
@api.route('', methods = ['POST'])
@auth.login_required
def post_classroom():
  data = request.json
  ClassRoomForm(data=data).validate_for_api()
  ClassModel.add_classroom(name=data['name'])
  return Success(msg='添加班级成功!')

# 修改班级
@api.route('/<string:id>', methods = ['PUT'])
@auth.login_required
def put_classroom(id):
  data = request.json or {}
  data['id'] = id
  ClassRoomPutForm(data=data).validate_for_api()
  ClassModel.put_classroom(id=id, name=data['name'])
  return Success(msg='修改班级成功!')

# 删除班级
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def delete_classroom(id):
  data = {
    'id': id
  }
  ClassRoomDeleteForm(data=data).validate_for_api()
  ClassModel.delete_classroom(id= id)
  return Success(msg='删除班级成功!')

