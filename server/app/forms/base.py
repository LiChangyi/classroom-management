#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:33
"""
from flask import request
from wtforms import Form

from app.libs.error import FormValidateError


class BaseForm(Form):
  def __init__(self, data=None):
    if data is None:
      data = request.json
    args = request.args.to_dict()
    super(BaseForm, self).__init__(data=data, **args)

  def validate_for_api(self):
    valid = super(BaseForm, self).validate()
    if not valid:
      msg = ''
      for err in self.errors.values():
        msg += err[0] + ','
      raise FormValidateError(msg=msg)
    return self
