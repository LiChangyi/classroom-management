#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午7:27
"""
from bson import ObjectId
from wtforms import StringField
from wtforms.validators import DataRequired

from app.forms.base import BaseForm
from app.models.share import ShareModel

# 添加资源,表单验证
class PostShareForm(BaseForm):
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
    share = ShareModel.objects(title = title).first()
    if share:
      raise ValueError('已经存在此标题的资源分享')

# shareId 验证
class ShareIdForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='shareId不能为空!')
  ])
  share = {}

  def validate_id(self, value):
    id = value.data
    try:
      id = ObjectId(id)
    except:
      raise ValueError('shareId有误')

    share = ShareModel.objects(id = id).first()
    if not share:
      raise ValueError('shareId有误')

    self.share = {
      "id": str(share['id']),
      'title': share['title'],
      'content': share['content'],
      'created_at': share['created_at'],
      'adminName': share['adminId']['name']
    }

# 修改资源表单验证
class PutShareForm(PostShareForm, ShareIdForm):
  def validate_title(self, value):
    title = value.data
    share = ShareModel.objects(title = title).first()
    if share and str(share['id']) != self.id.data:
      raise ValueError('已经存在此标题的资源分享')
