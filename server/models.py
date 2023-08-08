# from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
# import bcrypt

class SessionUser(db.Model, SerializerMixin):
    __tablename__ = 'sessionusers'
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String)
    user_global_name = db.Column(db.String)
    user_id = db.Column(db.String)
    user_avatar = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 
    # ! eventually encrypt these
    authorization_token = db.Column(db.String)
    refresh_token = db.Column(db.String)

    servers = db.relationship("SessionServer", backref="user", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user_name,
            'user_global_name': self.user_global_name,
            'user_avatar': self.user_avatar,
            'authorization_token': self.authorization_token,
            'refresh_token': self.refresh_token
        }

class SessionServer(db.Model, SerializerMixin):
    __tablename__ = 'sessionservers'
    id = db.Column(db.Integer, primary_key=True)
    discord_name = db.Column(db.String)
    discord_id = db.Column(db.String)
    discord_icon = db.Column(db.String)
    session_user_id = db.Column(db.Integer, db.ForeignKey('sessionusers.user_id'))

    # user = db.relationship("SessionUser", backref=("server"), cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
            'discord_icon': self.discord_icon,
            # 'session_id': self.session_id,
            'session_user_id': self.session_user_id,
            # 'session_username': self.session_username,
        }

class BotServer(db.Model, SerializerMixin):
    __tablename__= 'botservers'
    id = db.Column(db.Integer, primary_key=True)
    discord_name = db.Column(db.String)
    discord_id = db.Column(db.String)
    discord_icon = db.Column(db.String)
    
    def to_dict(self):
        return {
            'id': self.id,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
            'discord_icon': self.discord_icon,
        }


class ServerCommand(db.Model, SerializerMixin):
    __tablename__ = 'servercommands'
    id = db.Column(db.Integer, primary_key=True)
    command_id = db.Column(db.Integer, db.ForeignKey('botcommands.id'))
    command_name = db.Column(db.String, db.ForeignKey('botcommands.name'))
    command_description = db.Column(db.String, db.ForeignKey('botcommands.description'))
    # server_id = db.Column(db.Integer, db.ForeignKey('botservers.id'))
    discord_name = db.Column(db.String, db.ForeignKey('botservers.discord_name'))
    discord_id = db.Column(db.String, db.ForeignKey('botservers.discord_id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'command_id': self.command_id,
            'command_name' : self.command_name,
            'command_description' : self.command_description,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
        }


class BotCommand(db.Model, SerializerMixin):
    __tablename__= 'botcommands'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
        }