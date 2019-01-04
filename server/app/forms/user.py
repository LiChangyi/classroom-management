#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午3:10
"""
import hashlib
import re

from bson import ObjectId
from flask import current_app
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, length

from app.forms.base import BaseForm
from app.libs.error import FormValidateError
from app.models.classes import ClassModel
from app.models.user import UserModel


class UserBaseForm(BaseForm):
  name = StringField(validators=[
    DataRequired(message='姓名不能为空'),
    length(message="名字长度应该为2-24位",
           min= 2,
           max= 24)
  ])
  avatar = StringField(validators=[
    DataRequired(message='头像不能为空')
  ])
  schoolId = StringField(validators=[
    DataRequired(message='学号不能为空')
  ])
  classId = StringField(validators=[
    DataRequired(message='班级不能为空')
  ])

  # 验证班级id是否存在
  def validate_classId(self, value):
    try:
      classId = ObjectId(value.data)
    except:
      raise FormValidateError(msg='无效的班级')
    cls = ClassModel.objects( id = classId).first()
    if not cls:
      raise FormValidateError(msg='无效的班级')

  def validate_schoolId(self, value):
    schoolId = value.data
    if len(schoolId) == 12 and re.match(r'\d{12}', schoolId):
      pass
    else:
      raise FormValidateError(msg='学号必须是12位的纯数字')


# 用户注册验证
class UserRegisterForm(UserBaseForm):
  wxId = StringField(validators=[
    DataRequired(message='微信id不能为空')
  ])

  def validate_wxId(self, value):
    wxId = value.data + current_app.config['SECRET_KEY']
    m = hashlib.md5()
    m.update(wxId.encode("utf8"))
    wxId = m.hexdigest()

    user = UserModel.objects(wxId = wxId).first()
    if user:
      raise FormValidateError(msg='此微信id已经被注册了!')

  def validate_schoolId(self, value):
    super(UserRegisterForm, self).validate_schoolId(value)
    user = UserModel.objects(schoolId = value.data).first()
    if user:
      raise FormValidateError(msg='学号已经被注册了,请联系管理员!')


# 用户修改信息验证
class UserPutForm(UserBaseForm):
  id = StringField(validators=[
    DataRequired(message='id不能为空')
  ])
  def validate_schoolId(self, value):
    super(UserPutForm, self).validate_schoolId(value)
    user = UserModel.objects(schoolId=value.data).first()
    if user and str(user['id']) != self.id.data:
      raise FormValidateError(msg='学号已经被注册,请联系管理员!')

# 用户被删除信息验证
class UserDeleteForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='id不能为空')
  ])

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise FormValidateError(msg='无效的用户id')
    user = UserModel.objects(id = id).first()
    if not user:
      raise FormValidateError(msg='无效的用户id')

# 获取用户列表,get 参数验证
class UserGetListForm(BaseForm):
  page = IntegerField('页数',default=1)
  size = IntegerField(default=10)

  def validate_page(self, value):
    num = str(value.data)
    if num.isdigit() == False or int(num) <= 0:
      raise FormValidateError(msg='page应该是一个正整数')
    self.page.data = int(value.data)


  def validate_size(self, value):
    num = str(value.data)
    if num.isdigit() == False or int(num) <= 0:
      raise FormValidateError(msg='size应该是一个正整数')
    self.size.data = int(value.data)
