#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-7 下午5:34
"""
import datetime

import mongoengine
from bson import ObjectId
from flask import jsonify

from app.models import db
from app.models.admin import AdminModel
from app.models.classes import ClassModel
from app.models.user import UserModel


class SignModel(db.Document):
  name = db.StringField(required=True)
  adminId = db.ReferenceField(AdminModel)
  classroomIds = db.ListField(db.ReferenceField(ClassModel))
  signUsers = db.ListField(db.ReferenceField('UserModel'), default = [])
  token= db.StringField(required=True)
  created_at = db.DateTimeField(default=datetime.datetime.utcnow, required=True)

  meta = {
    'collection': 'sign',
    'indexes': ['-created_at'],
    'ordering': ['-created_at'],
    'strict': False
  }

  # 保存签到表到数据库
  @staticmethod
  def add_sign(data):
    name = data['name']
    adminId = ObjectId(data['adminId'])
    classroomIds = []
    for cls in data['classroomIds'].split('|'):
      classroomIds.append(ObjectId(cls))
    token = data['token']
    sign = SignModel(
      name = name,
      adminId = adminId,
      classroomIds = classroomIds,
      token = token
    )
    sign.save()
    return str(sign['id'])

  # 学生签到
  @staticmethod
  def user_sign(token, userId):
    userId = ObjectId(userId)
    sign = SignModel.objects(token = token)
    sign.update_one(add_to_set__signUsers=userId)

  # 老师帮学生签到
  @staticmethod
  def super_user_sign(signId, signUsers):
    signId = ObjectId(signId)
    sign = SignModel.objects(id= signId)
    sign.update_one(add_to_set__signUsers=signUsers)

  # 老师手动删除签到
  @staticmethod
  def super_delete_user_sign(signId, signUsers):
    signId = ObjectId(signId)
    sign = SignModel.objects(id=signId)
    sign.update_one(pull_all__signUsers=signUsers)

  # 获取签到表列表
  @staticmethod
  def get_sign_list(page, size, classId):
    if classId is not None:
      classId = ObjectId(classId)
      cls = ClassModel.objects(id = classId).first()
      if cls:
        clss = SignModel.objects(classroomIds__in = [classId]).order_by('-created_at').skip((page-1) * size).limit(size)
        count = SignModel.objects(classroomIds__in = [classId]).count()
      else:
        clss = []
        count = 0
    else:
      clss = SignModel.objects().order_by('-created_at').skip((page - 1) * size).limit(size)
      count = SignModel.objects().count()
    data = []
    for cls in clss:
      classrooms = []
      for room in cls['classroomIds']:
        classrooms.append({
          'id': str(room['id']),
          'name': room['name'],
          'stuNum': room['stuNum']
        })
      data.append({
        'id': str(cls['id']),
        'name': cls['name'],
        'adminName': cls['adminId']['name'],
        'classrooms': classrooms,
        'created_at': cls['created_at']
      })
    res = {
      'pagination': {
        'count': count,
        'size': size,
        'page': page
      },
      'list': data
    }
    return res

  # 删除签到表
  @staticmethod
  def delete_sign(signId):
    signId = ObjectId(signId)
    sign = SignModel.objects(id = signId)
    sign.delete()
