#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-7 下午5:49
"""
from bson import ObjectId
from flask import current_app
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

from app.forms.base import BaseForm
from app.forms.user import UserGetListForm
from app.libs.error import FormValidateError
from app.models.admin import AdminModel
from app.models.classes import ClassModel
from app.models.sign import SignModel


from app.models.user import UserModel

# 签到表token 判断是否过期
def verify_token(token):
  s = Serializer(current_app.config['SECRET_KEY'])
  try:
    data = s.loads(token)
  except SignatureExpired:
    return  False
  return True

class SignIdForm(BaseForm):
  id = StringField(validators=[
    DataRequired(message='签到表id不能为空!')
  ])
  sign = {}
  is_effective = False

  def validate_id(self, value):
    try:
      id = ObjectId(value.data)
    except:
      raise ValueError('签到表id有误')
    sign = SignModel.objects(id = id).first()
    if not sign:
      raise ValueError('签到表不存在!')
    is_effective = verify_token(sign['token'])
    self.is_effective = is_effective
    self.sign = sign


# 创建签到表验证
class PostSignForm(BaseForm):
  adminId = StringField(validators=[
    DataRequired(message='检验管理员失败!')
  ])
  name = StringField(validators=[
    DataRequired(message='签到表名字不能为空!')
  ])
  classroomIds = StringField(validators=[
    DataRequired(message='班级不能为空!')
  ])
  expiration = IntegerField(validators=[
    DataRequired(message='时间不能为空!')
  ])

  def validate_adminId(self, value):
    try:
      adminId = ObjectId(value.data)
    except:
      raise ValueError('检验管理员信息失败')

    admin = AdminModel.objects(id=adminId).first()
    if not admin:
      raise ValueError('检验管理员信息失败')

  def validate_name(self, value):
    name = value.data
    sign = SignModel.objects(name = name).first()
    if sign:
      raise ValueError('签到表名字已经存在')

  def validate_classroomIds(self, value):
    classroomIds = value.data.split('|')
    for classroomId in classroomIds:
      try:
        classroomId = ObjectId(classroomId)
      except:
        raise ValueError('无效的班级')
      classroom = ClassModel.objects(id = classroomId).first()
      if not classroom:
        raise ValueError('无效的班级')

  def validate_expiration(self, value):
    expiration = str(value.data)
    if expiration.isdigit() == False or int(expiration) <= 0:
      raise FormValidateError(msg='签到时间应该是一个正整数')


# 学生签到表,验证
class UserPostSignForm(BaseForm):
  token = StringField(validators=[
    DataRequired(message='无效的参数,没有找到签到表!')
  ])
  userId = StringField()
  
  def validate_token(self, value):
    token = value.data
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
      data = s.loads(token)
    except SignatureExpired:
      raise ValueError('已经过了签到的时间!')
    except BadSignature:
      raise ValueError('无效的签到!')

    name = data['name']
    classroomIds = data['classroomIds'].split('|')

    userId = ObjectId(self.userId.data)
    user = UserModel.objects(id = userId).first()
    if not user:
      raise ValueError('无效的用户!')

    userClassId = str(user['classId']['id'])
    if userClassId not in classroomIds:
      raise ValueError('违规操作!')

# 管理员手动签到表单验证
class SuperPostSignForm(BaseForm):
  signId = StringField(validators=[
    DataRequired(message='签到表ID 不能为空!')
  ])
  schoolId = StringField(validators=[
    DataRequired(message='学号 不能为空!')
  ])
  signUsers = []

  def validate_signId(self, value):
    try:
      signId = ObjectId(value.data)
    except:
      raise ValueError('无效的签到表ID')
    sign = SignModel.objects(id = signId)
    if not sign:
      raise ValueError('无效的签到表ID')

  def validate_schoolId(self, value):
    schoolId = value.data
    signId = ObjectId(self.signId.data)
    user = UserModel.objects(schoolId = schoolId).first()
    if not user:
      raise ValueError('无效的用户学号')
    cls = user['classId']
    sign = SignModel.objects(id= signId, classroomIds__in= [cls]).first()
    if not sign:
      raise ValueError('不属于此签到班级')
    sign = SignModel.objects(id= signId,signUsers__in= [user]).first()
    if sign:
      raise ValueError('此用户已经完成签到')
    self.signUsers = user

# 管理员手动删除用户签到表单验证
class SuperDeleteSignForm(BaseForm):
  signId = StringField(validators=[
    DataRequired(message='签到表ID 不能为空!')
  ])
  userIds = StringField(validators=[
    DataRequired(message='用户ID 不能为空!')
  ])
  signUsers = []

  def validate_userIds(self, value):
    signUsers = []
    for userId in value.data.split('|'):
      try:
        userId = ObjectId(userId)
      except:
        raise ValueError('无效的用户ID')
      signUsers.append(userId)
      user = UserModel.objects(id = userId)
      if not user:
        raise ValueError('无效的用户ID')
    self.signUsers = signUsers

  def validate_signId(self, value):
    try:
      signId = ObjectId(value.data)
    except:
      raise ValueError('无效的签到表ID')
    sign = SignModel.objects(id = signId)
    if not sign:
      raise ValueError('无效的签到表ID')


# 获取签到表列表表单验证
class GetSignListForm(UserGetListForm):
  classId = StringField()

  def validate_classId(self, value):
    if value.data is not None:
      try:
        classId = ObjectId(value.data)
      except:
        raise ValueError('班级ID有误')
      cls = ClassModel.objects(id = classId).first()
      if not cls:
        raise ValueError('班级ID有误')


