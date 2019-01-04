#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午9:21
"""
from bson import ObjectId
from wtforms import StringField
from wtforms.validators import DataRequired

from app.forms.base import BaseForm
from app.libs.error import FormValidateError
from app.models.classes import ClassModel


class ClassRoomForm(BaseForm):
  name = StringField(validators=[
    DataRequired(message='班级名不能为空')
  ])

  def validate_name(self, value):
    name = value.data
    cls = ClassModel.objects(name = name).first()
    if cls:
      raise FormValidateError(msg='班级名重复')

# 删除班级表单验证
class ClassRoomDeleteForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='id不能为空')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise FormValidateError(msg='班级id无效')
    cls = ClassModel.objects(id=id).first()
    if not cls:
      raise FormValidateError(msg='班级id无效')

# 修改班级表单验证
class ClassRoomPutForm(ClassRoomForm, ClassRoomDeleteForm ):
  pass
