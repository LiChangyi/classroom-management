#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午1:55
"""
import hashlib

from bson import ObjectId
from flask import current_app

from app.libs.error import FormValidateError
from app.models import db
from app.models.classes import ClassModel

class UserModel(db.Document):
  # _id = db.StringField()
  wxId = db.StringField( required=True )
  name = db.StringField( required=True )
  avatar = db.StringField( required=True )
  schoolId = db.StringField( required=True )
  classId = db.ReferenceField(ClassModel)

  meta = {
    'collection': 'user',
    'ordering': ['name', 'schoolId']
  }

  # 添加一个用户
  @staticmethod
  def add_user(data):
    wxId = data['wxId'] + current_app.config['SECRET_KEY']
    m = hashlib.md5()
    m.update(wxId.encode("utf8"))
    wxId = m.hexdigest()

    clsId = ObjectId(data['classId'])

    user = UserModel(
      wxId = wxId,
      name = data['name'],
      avatar = data['avatar'],
      schoolId = data['schoolId'],
      classId = clsId
    )
    user.save()
    # 给对应班级添加人数
    ClassModel.objects(id = clsId).update_one(inc__stuNum=1)

  # 通过 objectId 获取用户信息
  @staticmethod
  def get_user(id):
    user = UserModel.objects(id = ObjectId(id)).first()
    if not user:
      raise FormValidateError(msg='用户不存在')
    dic = {
      'id': str(user['id']),
      'name': user['name'],
      'avatar': user['avatar'],
      'schoolId': user['schoolId'],
      'classroom': str(user['classId']['name'])
    }
    return dic

  # 修改用户信息
  @staticmethod
  def put_user(id, data):
    user = UserModel.objects(id = ObjectId(id))
    origin_classId = str(user[0]['classId']['id'])
    user.update(
      name= data['name'],
      avatar= data['avatar'],
      schoolId= data['schoolId'],
      classId= ObjectId(data['classId'])
    )
    # 如果换了班级,则修改班级人数
    if origin_classId != str(data['classId']):
      ClassModel.objects(id= ObjectId(origin_classId)).update_one(dec__stuNum=1)
      ClassModel.objects(id= ObjectId(data['classId'])).update_one(inc__stuNum=1)

  # 通过用户id删除用户
  @staticmethod
  def delete_user(id):
    user = UserModel.objects(id = ObjectId(id))
    clsId = user[0]['classId']['id']
    user.delete()
    # 给对应班级减去人数
    ClassModel.objects(id=clsId).update_one(dec__stuNum=1)