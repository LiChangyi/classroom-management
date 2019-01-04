#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-7 下午3:47
"""
from bson import ObjectId
from wtforms import StringField
from wtforms.validators import DataRequired

from app.forms.base import BaseForm
from app.forms.user import UserGetListForm
from app.models.comment import CommentModel
from app.models.topic import TopicModel
from app.models.user import UserModel


class PostCommentForm(BaseForm):
  userId = StringField(validators=[
    DataRequired(message='检验用户失败!')
  ])
  topicId = StringField(validators=[
    DataRequired(message='topicId不能为空!')
  ])
  content = StringField(validators=[
    DataRequired(message='评论内容不能为空!')
  ])

  def validate_userId(self, value):
    try:
      userId = ObjectId(value.data)
    except:
      raise ValueError('检验用户失败!')

    user = UserModel.objects(id = userId).first()
    if not user:
      raise ValueError('检验用户失败!')

  def validate_topicId(self, value):
    try:
      topicId = ObjectId(value.data)
    except:
      raise ValueError('话题不存在!')

    topic = TopicModel.objects(id=topicId).first()
    if not topic:
      raise ValueError('话题不存在!')

# 用户修改自己的评论
class PutCommentForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='评论id不能为空!')
  ])
  userId = StringField(validators=[
    DataRequired(message='检验用户失败!')
  ])
  content = StringField(validators=[
    DataRequired(message='评论内容不能为空!')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise ValueError('评论id无效!')
    comment = CommentModel.objects(id = id).first()
    if not comment:
      raise ValueError('评论id无效!')

    userId = self.userId.data
    if str(comment['userId']['id']) != userId:
      raise ValueError('违规操作!')

  def validate_userId(self, value):
    try:
      userId = ObjectId(value.data)
    except:
      raise ValueError('检验用户失败!')

    user = UserModel.objects(id = userId).first()
    if not user:
      raise ValueError('检验用户失败!')


# 管理员删除用户评论
class SuperDeleteCommentForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='评论id不能为空!')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise ValueError('评论id无效!')
    comment = CommentModel.objects(id=id).first()
    if not comment:
      raise ValueError('评论id无效!')


# 用户删除自己的评论
class DeleteCommentForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='评论id不能为空!')
  ])
  userId = StringField(validators=[
    DataRequired(message='检验用户失败!')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise ValueError('评论id无效!')
    comment = CommentModel.objects(id=id).first()
    if not comment:
      raise ValueError('评论id无效!')
    userId = self.userId.data
    if str(comment['userId']['id']) != userId:
      raise ValueError('违规操作!')


class SuperPutCommentForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='评论id不能为空!')
  ])
  content = StringField(validators=[
    DataRequired(message='评论内容不能为空!')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise ValueError('评论id无效!')
    comment = CommentModel.objects(id = id).first()
    if not comment:
      raise ValueError('评论id无效!')

# 获取评论列表表单验证
class GetCommentListForm(UserGetListForm):
  topicId = StringField(validators=[
    DataRequired(message='topicId不能为空!')
  ])

  def validate_topicId(self, value):
    try:
      topicId = ObjectId(value.data)
    except:
      raise ValueError('话题不存在!')

    topic = TopicModel.objects(id=topicId).first()
    if not topic:
      raise ValueError('话题不存在!')

