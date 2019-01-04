#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-6 下午9:02
"""
from flask import request, g

from app.forms.comment import PostCommentForm, PutCommentForm, SuperPutCommentForm, SuperDeleteCommentForm, \
  DeleteCommentForm, GetCommentListForm
from app.libs.redprint import Redprint
from app.libs.returnJson import Success
from app.libs.token_auth import auth
from app.models.comment import CommentModel

api = Redprint('comment')


# 创建评论
@api.route('', methods = ['POST'])
@auth.login_required
def post_comment():
  data = request.json or {}
  data['userId'] = g.user.id
  PostCommentForm(data= data).validate_for_api()
  CommentModel.add_comment(data= data)
  return Success(msg= '添加评论成功!')


# 用户修改自己的评论
@api.route('/<string:id>', methods = ['PUT'])
@auth.login_required
def put_comment(id):
  data = request.json or {}
  data['id'] = id
  data['userId'] = g.user.id
  PutCommentForm(data= data).validate_for_api()
  CommentModel.put_comment(data= data)
  return Success(msg= '修改评论成功!')


# 用户删除自己的评论
@api.route('/<string:id>', methods = ['DELETE'])
@auth.login_required
def delete_comment(id):
  data = {
    "id": id,
    "userId": g.user.id
  }
  DeleteCommentForm(data= data).validate_for_api()
  CommentModel.delete_comment(id)
  return Success(msg= '删除评论成功!')


# 管理员删除评论
@api.route('/super/<string:id>', methods = ['DELETE'])
@auth.login_required
def super_delete_comment(id):
  data = {
    "id": id
  }
  SuperDeleteCommentForm(data= data).validate_for_api()
  CommentModel.delete_comment(id)
  return Success(msg= '删除评论成功!')


# 管理员修改评论
@api.route('/super/<string:id>', methods = ['PUT'])
@auth.login_required
def super_put_comment(id):
  data = request.json or {}
  data['id'] = id
  data['userId'] = g.user.id
  SuperPutCommentForm(data= data).validate_for_api()
  CommentModel.put_comment(data=data)
  return Success(msg='修改评论成功!')

# 通过 topic 获取评论列表
@api.route('/list')
def get_comment_list():
  data = request.args
  form = GetCommentListForm(data= data)
  form.validate_for_api()
  data = {
    "topicId": form.topicId.data,
    'page': form.page.data,
    'size': form .size.data
  }
  data = CommentModel.get_comment_list(data)
  return Success(msg='获取成功!', data= data)





