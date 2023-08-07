from sqlalchemy import func, ForeignKey
from sqlalchemy.orm import validates, relationship
# from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
from config import db
# import bcrypt

class SessionUser(db.Model):
    __tablename__ = 'sessionusers'
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String)
    user_global_name = db.Column(db.String)
    user_id = db.Column(db.String)
    user_avatar = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 
    servers = relationship("SessionServer", back_populates="user")
    # ! eventually encrypt these
    authorization_token = db.Column(db.String)
    refresh_token = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user_name,
            'user_global_name': self.user_global_name,
            'user_avatar': self.user_avatar,
            'authorization_token': self.authorization_token,
            'refresh_token': self.refresh_token
        }

class SessionServer(db.Model):
    __tablename__ = 'sessionservers'
    id = db.Column(db.Integer, primary_key=True)
    discord_name = db.Column(db.String)
    discord_id = db.Column(db.String)
    discord_icon = db.Column(db.String)
    session_id = db.Column(db.Integer, db.ForeignKey('sessionusers.id'))
    session_user_id = db.Column(db.String)  # Using the user_id field for foreign key
    session_username = db.Column(db.String)  # Using the user_global_name field for foreign key
    user = relationship("SessionUser", back_populates="servers")

    def to_dict(self):
        return {
            'id': self.id,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
            'discord_icon': self.discord_icon,
            'session_id': self.session_id,
            'session_user_id': self.session_user_id,
            'session_username': self.session_username,
            # Include other attributes if needed
        }

class BotServer(db.Model):
    __tablename__= 'botservers'
    id = db.Column(db.Integer, primary_key=True)
    discord_name = db.Column(db.String)
    discord_id = db.Column(db.String)
    discord_icon = db.Column(db.String)
    server_commands = relationship("ServerCommand", back_populates="bot_server")

    def to_dict(self):
        return {
            'id': self.id,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
            'discord_icon': self.discord_icon,
            # Include other attributes if needed
        }

class ServerCommand(db.Model):
    __tablename__ = 'servercommands'
    id = db.Column(db.Integer, primary_key=True)
    command_id = db.Column(db.Integer, db.ForeignKey('botcommands.id'))
    server_id = db.Column(db.Integer, db.ForeignKey('botservers.id'))
    discord_name = db.Column(db.String)
    discord_id = db.Column(db.String)

    bot_server = relationship("BotServer", back_populates="server_commands", foreign_keys=[server_id, discord_name, discord_id])
    bot_command = relationship("BotCommand", back_populates="server_commands", foreign_keys=[command_id])
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'command_id': self.command_id,
            'server_id': self.server_id,
            'discord_name': self.discord_name,
            'discord_id': self.discord_id,
            # Include other attributes if needed
        }


class BotCommand(db.Model):
    __tablename__= 'botcommands'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    
    server_commands = relationship("ServerCommand", back_populates="bot_command", foreign_keys="[ServerCommand.command_id]")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            # Include other attributes if needed
        }