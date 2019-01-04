#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-3 上午10:23
"""

from app.app import create_app

app = create_app()

if __name__ == '__main__':
  app.run(
    debug=True,
    port=8888,
    host='0.0.0.0'
  )
