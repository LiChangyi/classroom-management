#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-3 下午7:17
"""

from flask import request, json
from werkzeug.exceptions import HTTPException

class Success(HTTPException):
  code = 200
  success = True
  msg = '操作成功!'
  data = []

  def __init__(self, code=None, msg=None, success=None, data = None):
    if code is not None:
      self.code = code
    if msg is not None:
      self.msg = msg
    if success is not None:
      self.success = success
    if data is not None:
      self.data = data
    super(Success, self).__init__(description=msg, response=None)

  def get_body(self, environ=None):
    body = dict(
      success=self.success,
      msg=self.msg,
    )
    if len(self.data) != 0:
      body['data'] = self.data
    return json.dumps(body)

  def get_headers(self, environ=None):
    return [('Content-Type', 'application/json')]



