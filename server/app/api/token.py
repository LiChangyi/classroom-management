#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:30
"""
from flask import request, current_app
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from app.forms.token import ClientForm, GetTokenByAccount, GetTokenByMine
from app.libs.enums import ClientTypeEnum
from app.libs.redprint import Redprint
from app.libs.returnJson import Success

api = Redprint('token')


# 获取授权token
@api.route('', methods = ['POST'])
def get_token():
  data = request.json
  form = ClientForm(data= data)
  form.validate_for_api()
  # 账号和密码获取token 和 wxId 获取token
  promise = {
    ClientTypeEnum.USER_ACCOUNT: GetTokenByAccount,
    ClientTypeEnum.USER_MINA: GetTokenByMine
  }
  form = promise[form.type.data]()
  form.validate_for_api()
  token = create_token(form.userInfo).decode('ascii')
  data = {
    'id': form.userInfo['id'],
    'name': form.userInfo['name'],
    'token': token
  }
  return Success(msg='获取token成功', data=data)


# 生成 token
def create_token(userInfo, expiration = 60*60*24):
  s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
  return s.dumps({
    'id': userInfo['id'],
    'is_admin': userInfo['is_admin']
  })


