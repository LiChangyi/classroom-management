#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 上午10:54
"""
from collections import namedtuple

from flask import g, current_app, request
from flask_httpauth import HTTPTokenAuth
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

from app.libs.error import AuthFailed, Forbidden
from app.libs.scope import is_admin_scope

auth = HTTPTokenAuth(scheme='token')

User = namedtuple('User', ['id', 'is_admin'])

@auth.verify_token
def verify_token(token):
  user_info = verify_auth_token(token)
  if not user_info:
    return False
  else:
    g.user = user_info
    return True

def verify_auth_token(token):
  s = Serializer(current_app.config['SECRET_KEY'])
  try:
    data = s.loads(token)
  except SignatureExpired:
    raise AuthFailed(msg='token已过期,请重新登录!')
  except BadSignature:
    raise AuthFailed(msg= '访问的资源需要登录!')
  id = data['id']
  is_admin = data['is_admin']
  allow = is_admin_scope(request.endpoint)
  if allow == True and is_admin == False:
    raise Forbidden()
  return User(id, is_admin)