#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-5 上午11:09
"""

class AdminScope:
  allow_api = ['super_put_user', 'super_delete_user', 'get_user_list', 'post_classroom', 'put_classroom',
               'delete_classroom', 'post_share', 'put_share', 'delete_share', 'post_topic', 'put_topic', 'delete_topic',
                'super_put_comment', 'super_delete_comment', 'post_sign', 'super_post_sign', 'super_delete_sign',
               'get_sign_list', 'delete_sign']
  allow_module = ['']

def is_admin_scope(endpoint):
  splits = endpoint.split('+')
  print_name = splits[0]
  view_func_name = splits[1]
  if view_func_name in AdminScope.allow_api:
    return True
  if print_name in AdminScope.allow_module:
    return True
  else:
    return False
