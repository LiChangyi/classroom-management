#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午1:59
"""
from bson import ObjectId

from app.models import db

class ClassModel(db.Document):
  name = db.StringField(required=True)
  stuNum = db.IntField(default=0)

  meta = {
    'collection': 'class'
  }

  # 添加一个班级
  @staticmethod
  def add_classroom(name):
    cls = ClassModel(
      name = name
    )
    cls.save()

  # 修改班级
  @staticmethod
  def put_classroom(id, name):
    id = ObjectId(id)
    cls = ClassModel.objects(id = id)
    cls.update(
      name = name
    )

  # 删除班级
  @staticmethod
  def delete_classroom(id):
    id = ObjectId(id)
    cls = ClassModel.objects(id=id)
    cls.delete()
