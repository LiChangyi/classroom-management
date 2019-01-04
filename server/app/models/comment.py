#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午8:40
"""
import datetime

from bson import ObjectId

from app.models import db
from app.models.topic import TopicModel
from app.models.user import UserModel


class CommentModel(db.Document):
  userId = db.ReferenceField(UserModel, required = True)
  topicId = db.ReferenceField(TopicModel, required = True)
  created_at = db.DateTimeField(default=datetime.datetime.utcnow, required=True)
  content = db.StringField(required = True)

  meta = {
    'collection': 'comment',
    'indexes': ['-created_at'],
    'ordering': ['-created_at']
  }

  # 创建评论
  @staticmethod
  def add_comment(data):
    userId= ObjectId(data['userId'])
    topicId= ObjectId(data['topicId'])
    content = data['content']

    comment = CommentModel(
      userId = userId,
      topicId = topicId,
      content = content
    )
    comment.save()

  # 修改评论
  @staticmethod
  def put_comment(data):
    id = ObjectId(data['id'])
    content = data['content']

    comment = CommentModel.objects(id = id)
    comment.update(
      content=content
    )

  # 删除评论
  @staticmethod
  def delete_comment(id):
    id = ObjectId(id)
    comment = CommentModel.objects(id = id)
    comment.delete()

  # 获取评论
  @staticmethod
  def get_comment_list(data):
    topicId = ObjectId(data['topicId'])
    page = int(data['page'])
    size = int(data['size'])
    count = CommentModel.objects(topicId = topicId).count()
    comments = CommentModel.objects(topicId = topicId).order_by('-created_at').skip((page-1) * size).limit(size)
    list = []
    for comment in comments:
      list.append({
        'id': str(comment['id']),
        'created_at': comment['created_at'],
        'userId': str(comment['userId']['id']),
        'userName': str(comment['userId']['name']),
        'schoolId': str(comment['userId']['schoolId']),
        'avatar': str(comment['userId']['avatar']),
        'className': str(comment['userId']['classId']['name']),
        'content': comment['content']
      })

    res = {
      'list': list,
      'pagination': {
        'count': count,
        'size': size,
        'page': page
      }
    }
    return res