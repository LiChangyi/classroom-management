#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-4 下午7:58
"""
from enum import Enum


class ClientTypeEnum(Enum):
  """客户端类型枚举类"""
  USER_ACCOUNT = 100
  USER_MINA = 200  # 微信小程序
