#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-10 下午5:16
"""
import datetime

from bson import ObjectId
from mongoengine import *


connect('python_class_stu')

class User(Document):
  name = StringField()
  wxId = StringField(required=True)
  avatar = StringField(required=True)
  schoolId = StringField(required=True)
  classId = StringField(required=True)
  meta = {
    'collection': 'user'
  }

class UserModel(Document):
  # id = StringField()
  wxId = StringField( required=True )
  name = StringField()
  avatar = StringField( required=True )
  schoolId = StringField( required=True )
  classId = StringField(required=True)

  meta = {
    'collection': 'user'
  }

class SignModel(Document):
  name = StringField(required=True)
  signUsers = ListField(ReferenceField('UserModel'))
  adminId = StringField()
  content = StringField()
  classroomIds = ListField()
  token = StringField(required=True)
  created_at = DateTimeField(default=datetime.datetime.now, required=True)

  meta = {
    'collection': 'sign'
  }


signs = SignModel.objects(id = ObjectId('5c0a5d6b439ac6459dfea8cd'))
print(signs[0]['signUsers'][0]['name'])
print(signs[0]['id'])
print(len(signs))



#
#
# class Page(Document):
#   content = StringField()
#   authors = ListField(ReferenceField(User))


# bob = User(name="Bob Jones").save()
# john = User(name="John Smith").save()
# list = ['5c0e2fa4439ac64e0ef687ab', '5c0e2fa4439ac64e0ef687ac', '5c0e2fa4439ac64e0ef687a0']
# author = []
# for id in list:
#   author.append(ObjectId(id))
# Page(content="Test Page", authors=author).save()
# Page(content="Another Page", authors=[john]).save()

# 查找所有由bob编写的网页，此处用到了高级查询，后面会介绍
# Page.objects(authors__in=[bob])

# 查找所有由bob和john编写的网页
# print(Page.objects(authors__all=[bob, john]))

# for page in Page.objects:
#   print(page['authors'][0].name)
# pages = Page.objects()
# print(pages[0]['authors'][2].id)
# print(pages[0]['authors'][1].name)
# 删除由bob编写的某篇文章（根据0某个id查找到的）.
# Page.objects(id='...').update_one(pull__authors=bob)
#
# # 把john添加到某篇文章（根据某个id查找到的）.
# Page.objects(id='...').update_one(push__authors=john)