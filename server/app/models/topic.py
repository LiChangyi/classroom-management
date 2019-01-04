#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午9:08
"""
import datetime

from bson import ObjectId

from app.models import db
from app.models.admin import AdminModel


class TopicModel(db.Document):
  title = db.StringField(required=True)
  content = db.StringField(required=True)
  created_at = db.DateTimeField(default=datetime.datetime.utcnow, required=True)
  adminId = db.ReferenceField(AdminModel, required = True)

  meta = {
    'collection': 'topic',
    'indexes': ['-created_at'],
    'ordering': ['-created_at']
  }

  # 添加一个话题
  @staticmethod
  def add_topic(data):
    adminId = ObjectId(data['adminId'])
    title = data['title']
    content = data['content']
    topic = TopicModel(
      adminId=adminId,
      title=title,
      content=content
    )
    topic.save()

  # 修改一个话题
  @staticmethod
  def put_topic(id, data):
    id = ObjectId(id)
    adminId = ObjectId(data['adminId'])
    title = data['title']
    content = data['content']
    topic = TopicModel.objects(id=id)
    topic.update(
      adminId=adminId,
      title=title,
      content=content
    )

  # 删除一个话题
  @staticmethod
  def delete_topic(id):
    id = ObjectId(id)
    topic = TopicModel.objects(id=id)
    topic.delete()
