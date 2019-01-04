#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:03
"""
from werkzeug.security import generate_password_hash

from app.models import db

class AdminModel(db.Document):
  # _id = db.StringField()
  name = db.StringField(required=True)
  account = db.StringField(required=True)
  password = db.StringField(required=True)
  avatar= db.StringField(required=True)

  meta = {
    'collection': 'admin'
  }

  # 创建管理员账户
  @staticmethod
  def add_admin(data):
    admin = AdminModel(
      account = data['account'],
      name = data['name'],
      password = generate_password_hash(data['password']),
      avatar = data['avatar']
    )
    admin.save()
    return admin

  # 验证账号密码
  @staticmethod
  def check_admin():
    pass