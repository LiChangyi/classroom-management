#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午7:09
"""
import datetime

from bson import ObjectId

from app.models import db
from app.models.admin import AdminModel


# 资源分享
class ShareModel(db.Document):
  adminId = db.ReferenceField(AdminModel, required= True)
  created_at = db.DateTimeField(default=datetime.datetime.utcnow, required=True)
  title = db.StringField(required= True)
  content = db.StringField(required= True)

  meta = {
    'collection': 'share',
    'indexes': ['-created_at'],
    'ordering': ['-created_at']
  }

  # 添加一个资源
  @staticmethod
  def add_share(data):
    adminId = ObjectId(data['adminId'])
    title = data['title']
    content = data['content']
    share = ShareModel(
      adminId = adminId,
      title = title,
      content = content
    )
    share.save()

  # 修改一个资源
  @staticmethod
  def put_share(id, data):
    id = ObjectId(id)
    adminId= ObjectId(data['adminId'])
    title = data['title']
    content = data['content']
    share = ShareModel.objects(id = id)
    share.update(
      adminId = adminId,
      title = title,
      content = content
    )

  # 删除一个资源
  @staticmethod
  def delete_share(id):
    id = ObjectId(id)
    share = ShareModel.objects(id = id)
    share.delete()