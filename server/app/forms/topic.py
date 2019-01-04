#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午9:26
"""

from bson import ObjectId
from wtforms import StringField
from wtforms.validators import DataRequired

from app.forms.base import BaseForm
from app.models.topic import TopicModel

# 添加话题,表单验证
class PostTopicForm(BaseForm):
  adminId = StringField(validators=[
    DataRequired(message='检验管理员失败!')
  ])
  title = StringField(validators=[
    DataRequired(message='标题不能为空!')
  ])
  content = StringField(validators=[
    DataRequired(message='内容不能为空!')
  ])

  def validate_title(self, value):
    title = value.data
    topic = TopicModel.objects(title = title).first()
    if topic:
      raise ValueError('已经存在此标题的资源分享')

# topicId 验证
class TopicIdForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='topicId不能为空!')
  ])
  topic = {}

  def validate_id(self, value):
    id = value.data
    try:
      id = ObjectId(id)
    except:
      raise ValueError('topicId有误')

    topic = TopicModel.objects(id = id).first()
    if not topic:
      raise ValueError('topicId有误')

    self.topic = {
      "id": str(topic['id']),
      'title': topic['title'],
      'content': topic['content'],
      'created_at': topic['created_at'],
      'adminName': topic['adminId']['name']
    }

# 修改话题表单验证
class PutTopicForm(PostTopicForm, TopicIdForm):
  def validate_title(self, value):
    title = value.data
    topic = TopicModel.objects(title = title).first()
    if topic and str(topic['id']) != self.id.data:
      raise ValueError('已经存在此标题的话题')

