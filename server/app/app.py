#!/usr/bin/env python
# encoding: utf-8
"""
@author: Pawn
@blog: https:blog.lcylove.cn
@time: 18-12-3 上午10:23
"""
import os

from flask import Flask, Blueprint
from app.api import user, token, classroom, share, comment, topic, sign
from app.models import db
import app.config as config

basedir = os.path.abspath(os.path.dirname(__name__)) + '/static'

def register_database(app):
  db.init_app(app)

def create_app():
  app = Flask(__name__, static_folder=basedir, static_url_path='')
  app.config.from_object(config)
  register_database(app)
  bp = Blueprint('bp', __name__)

  user.api.register(bp)
  token.api.register(bp)
  classroom.api.register(bp)
  share.api.register(bp)
  comment.api.register(bp)
  topic.api.register(bp)
  sign.api.register(bp)

  app.register_blueprint(bp, url_prefix='/api')



  return app
