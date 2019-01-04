#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-3 下午6:45
"""
from flask import request, json
from werkzeug.exceptions import HTTPException



class APIException(HTTPException):
  code = 500
  success = False
  msg = '服务器内部错误'

  def __init__(self, code = None, msg = None, success = None, headers = None):
    if code:
      self.code = code
    if msg:
      self.msg = msg
    if success:
      self.success = success
    super(APIException, self).__init__(description=msg, response=None)

  def get_body(self, environ=None):
    body = dict(
      success = self.success,
      msg = self.msg,
      request = request.method + ' ' + self.get_url_path()
    )
    return json.dumps(body)

  def get_headers(self, environ=None):
    return [('Content-Type', 'application/json;charset=UTF-8')]

  @staticmethod
  def get_url_path():
    full_path = request.full_path
    return full_path.split('?')[0]


class FormValidateError(APIException):
  code = 400
  msg = '参数有误!'

class AuthFailed(APIException):
  code = 401
  msg = 'token异常,授权失败'

class Forbidden(APIException):
  code = 403
  msg = '权限不够!'
