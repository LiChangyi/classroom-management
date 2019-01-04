#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:32
"""
import hashlib

from flask import current_app
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, length
from werkzeug.security import check_password_hash

from app.forms.base import BaseForm
from app.libs.enums import ClientTypeEnum
from app.libs.error import FormValidateError
from app.models.admin import AdminModel
from app.models.user import UserModel


class ClientForm(BaseForm):
  type = IntegerField(validators=[
    DataRequired(message='type不能为空'),
  ])

  def validate_type(self, value):
    try:
      client = ClientTypeEnum(value.data)
    except ValueError as e:
      raise ValueError('无效的type值!')
    self.type.data = client


# 通过账号密码获取token, 信息验证
class GetTokenByAccount(BaseForm):
  account = StringField(validators=[
    DataRequired(message='账户名不能为空')
  ])
  password = StringField(validators=[
    DataRequired(message='密码不能为空')
  ])

  userInfo = {}

  # 密码检验是否正确
  def validate_password(self, value):
    account = self.account.data
    password = value.data
    admin = AdminModel.objects(account=account).first()
    if not admin:
      raise FormValidateError(msg='用户名不存在')
    if check_password_hash(admin['password'], password) == False:
      raise FormValidateError(msg='密码不正确')
    self.userInfo = {
      "id": str(admin['id']),
      'name': admin['name'],
      "is_admin": True
    }

# 通过微信小程序 wxid 来获取token
class GetTokenByMine(BaseForm):
  wxId = StringField(validators=[
    DataRequired(message='wxId不能为空')
  ])

  userInfo = {}

  # wxId 验证
  def validate_wxId(self, value):
    wxId = value.data + current_app.config['SECRET_KEY']
    m = hashlib.md5()
    m.update(wxId.encode("utf8"))
    wxId = m.hexdigest()

    user = UserModel.objects(wxId = wxId).first()
    if not user:
      raise FormValidateError(msg='还没有注册,先去注册吧!')
    self.userInfo = {
      "id": str(user['id']),
      'name': user['name'],
      'is_admin': False
    }

