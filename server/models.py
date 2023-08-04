from sqlalchemy import func
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db

class Session(db.model):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    user_global_name = db.Column(db.String)
    user_id = db.Column(db.String)
    user_avatar = db.Column(db.String)
    # ! this should be encrypted (eventually) ((no rush))
    authorization_token = db.Column(db.String)
    refresh_token= db.Column(db.String)
    created_at = db.Column(db.DateTime, default = datetime.utcnow)

class SessionServer(db.model):
    __tablename__= 'sessionservers'
    id = db.Column(db.Integer, primary_key = True)
    server_name = db.Column(db.String)
    server_id = db.Column(db.String)
    server_icon = db.Column(db.String)

class BotServer(db.model):
    __tablename__= 'botservers'
    id = db.Column(db.Integer, primary_key=True)
    server_name = db.Column(db.String)
    server_id = db.Column(db.String)
    server_icon = db.Column(db.String)

class BotCommand(db.model):
    __tablename__= 'botcommands'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    functionality = db.Column(db.String)

class ServerCommand(db.model):
    __tablename__='servercommands'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    functionality = db.Column(db.String)   
    server_name = db.Column(db.String)
    server_id = db.Column(db.String)
    created_at = db.Column(db.DateTime, default = datetime.utcnow)
    updated_at = db.Column(db.DateTime, default = datetime.utcnow, onupdate = datetime.utcnow)