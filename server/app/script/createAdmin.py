#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 下午2:06
"""

from app.models.admin import AdminModel
from mongoengine import connect

connect('python_class_stu')

# 脚本 => 生成 admin  管理员账号

if __name__ == '__main__':
  data = {
    'account': 'pawn',
    'name': 'Pawn',
    'password': '1223456',
    'avatar': '1.jpg'
  }
  admin = AdminModel.add_admin(data= data)
  print(admin)

