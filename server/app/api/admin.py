#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:29
"""
from app.libs.redprint import Redprint

api = Redprint('admin')


# 管理员信息修改
@api.route('',mehtods = ['POST'])
def post_admin():
  pass

