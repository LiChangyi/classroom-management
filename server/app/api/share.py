#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午7:19
"""
from flask import g, request

from app.forms.share import PostShareForm, ShareIdForm, PutShareForm
from app.forms.user import UserGetListForm
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.share import ShareModel

api = Redprint('share')

# 获取列表
@api.route('/list')
def get_share_list():
  form = UserGetListForm(data=request.args)
  form.validate_for_api()
  page = form.page.data
  size = form.size.data
  keyword = str(request.args['keyword']) or '';
  count = ShareModel.objects(title__contains = keyword).count()
  shares = ShareModel.objects(title__contains = keyword).order_by('-created_at').skip((int(page) - 1) * int(size)).limit(int(size))
  list = []
  for share in shares:
    list.append({
      'id': str(share['id']),
      'title': share['title'],
      'created_at': share['created_at'],
      'adminName': share['adminId']['name']
    })
  data = {
    'pagination': {
      'count': count,
      'size': int(size),
      'page': int(page)
    },
    'list': list
  }
  return Success(msg='获取成功!', data=data)


# 获取详情
@api.route('/<string:id>')
def get_share(id):
  data = {
    'id': id
  }
  form = ShareIdForm(data= data)
  form.validate_for_api()
  return Success(msg='获取成功!', data=form.share)


# 添加资源分享
@api.route('', methods = ['POST'])
@auth.login_required
def post_share():
  data = request.json or {}
  data['adminId'] = g.user.id
  PostShareForm().validate_for_api()
  ShareModel.add_share(data= data)
  return Success(msg='添加资源分享成功!')


# 修改资源分享
@api.route('/<string:id>', methods = ['PUT'])
@auth.login_required
def put_share(id):
  data = request.json or {}
  data['id'] = id
  data['adminId'] = g.user.id
  PutShareForm(data = data).validate_for_api()
  ShareModel.put_share(id, data = data)
  return Success(msg='修改资源分享成功!')

# 删除资源分享
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def delete_share(id):
  data = {
    'id': id
  }
  form = ShareIdForm(data=data)
  form.validate_for_api()
  ShareModel.delete_share(id)
  return Success(msg='删除资源分享成功!')

