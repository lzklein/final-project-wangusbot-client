import os
from ipdb import set_trace
from config import app, db, migrate, api
from models import SessionUser, SessionServer, BotServer, BotCommand, ServerCommand
from flask import request, make_response, session, sessions, jsonify, redirect, url_for
from flask_restful import Resource
from dotenv import load_dotenv
import requests

#env
dotenv_path = "../.env"
load_dotenv(dotenv_path)
DISCORD_CLIENT_ID = os.environ.get("CLIENT_ID")
DISCORD_CLIENT_SECRET = os.environ.get("DISCORD_SECRET")
DISCORD_REDIRECT_URI = os.environ.get("REDIRECT_URI")
DISCORD_BOT_TOKEN = os.environ.get("BOT_TOKEN")

#session secret key
SECRET_KEY = os.environ.get("SECRET")
app.secret_key = SECRET_KEY

class DiscordCallback(Resource):
    def post(self):
        code = request.args.get('code')
        discord_token_endpoint = 'https://discord.com/api/oauth2/token'
        params = {
            'client_id': DISCORD_CLIENT_ID,
            'client_secret': DISCORD_CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': DISCORD_REDIRECT_URI
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(discord_token_endpoint, data=params, headers=headers)

        if response.status_code == 200:
            # access_token = response.json().get('access_token')
            return response.json() 
        else:
            return jsonify({'message': 'Authentication failed'}), response.status_code
api.add_resource(DiscordCallback, '/auth/callback')

class DiscordUser(Resource):
    def get(self):
        access_token = request.headers.get('Authorization')
        print(access_token)
        if not access_token:
            return {"error": "Access token not provided"}, 401

        # Fetch user data from Discord API
        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        discord_api_url = 'https://discord.com/api/users/@me'
        response = requests.get(discord_api_url, headers=headers)

        if response.status_code == 200:
            user_data = response.json()
            return make_response(user_data)
        else:
            return {"error": "Failed to fetch user data from Discord"}, response.status_code
api.add_resource(DiscordUser, '/userauth')

class RegisterUser(Resource):
    def post(self):
        print('inside RegisterUser')
        user_name = request.json.get('user_name')
        user_global_name = request.json.get('user_global_name')
        user_id = request.json.get('user_id')
        user_avatar = request.json.get('user_avatar')
        authorization_token = request.json.get('authorization_token')
        refresh_token = request.json.get('refresh_token')
        
        if not user_name:
            return {'message': 'Authentication failed'}, 400

        # Check if session exists
        existing_session = SessionUser.query.filter(SessionUser.user_id == user_id).first()
        if existing_session:
            return {'message': 'Session already exists. This is a bug'}, 200

        try:
            new_session = SessionUser(user_name=user_name, user_global_name=user_global_name, user_id=user_id, user_avatar=user_avatar, authorization_token=authorization_token, refresh_token=refresh_token)
            db.session.add(new_session)
            db.session.commit()
            session['id'] = new_session.id
            print('inside set session id')
            print(session)
            print(session.sid)
            # set_trace()
            response = make_response(new_session.to_dict(), 201)
            return response  
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 422
api.add_resource(RegisterUser, '/registeruser')

@app.route('/getsession')
def get():
    print(session)
    print(session.sid)
    return {'session': session, 'sid': session.sid}, 200

class RegisterServer(Resource):
    def post(self):
        print('inside set RegisterServer')
        print(session.sid)
        # ! each discord server has to be separately added 
        discord_id = request.json.get('discord_id')
        discord_name = request.json.get('discord_name')
        discord_icon = request.json.get('discord_icon')
        session_id = request.json.get('session_id')
        session_user_id = request.json.get('session_user_id')
        session_username = request.json.get('session_username')

        if not discord_name:
            return {'message': 'Authentication failed'}, 400

        # Check if session exists
        existing_server = SessionServer.query.filter(SessionServer.discord_id == discord_id).first()
        if existing_server:
            return {'message': 'Server is already exists.'}, 409  #duplicate resource
        try:
            new_server = SessionServer(discord_id=discord_id, discord_name=discord_name, discord_icon=discord_icon, session_user_id=session_user_id)
            # new_server = SessionServer
            db.session.add(new_server)
            db.session.commit()
            response = make_response(new_server.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 422

        # success 
        return response  
api.add_resource(RegisterServer, '/registerserver')


class CheckSession(Resource):
    def get(self):
        print('inside set CheckSession')
        print(session)
        print(session.sid)
        try:
            # set_trace()
            user = SessionUser.query.filter_by(id = session['id']).first()
            if user:
                return user.to_dict()
            # else:
            #     return {'message': '401: Not Authorized'}, 401
        except:
            return {'message': '401: Not Authorized'}, 401
api.add_resource(CheckSession, '/checksession')


class Logout(Resource):
    def delete(self,id):
        print('inside logout')
        print(session)
        print(session.sid)
        print(id)
        try:
            # session_id = session['id']
            session_user = SessionUser.query.filter(SessionUser.user_id == id).first()
            print(session_user)
            # session_servers = SessionServer.query.filter(SessionServer.session_user_id == session_user.user_id).all()
            # print(session_servers)
            db.session.delete(session_user)
            # db.session.delete(session_servers)
            db.session.commit()
            session.clear()
            return {}, 204
        except Exception as e:
            print('Error:', str(e))
            db.session.rollback()
            return {'message': 'Logout failed', 'error': str(e)}, 500
api.add_resource(Logout, '/logout/<int:id>')

class AllCommands(Resource):
    def get(self):
        try:
            commands = BotCommand.query.all()
            commands_list = [command.to_dict() for command in commands]
            return jsonify(commands_list)
        except Exception as e:
            return {'error': str(e)}, 500
api.add_resource(AllCommands, '/allcommands')

class BotCheck(Resource):
    def post(self):
        server_name = request.json.get('server_name')
        print("getting server name")
        print(server_name) 
        # check if selected server in bot_servers
        # found_server_dict = BotServer.query.filter(BotServer.discord_name == server_name).first().to_dict()
        found_server = BotServer.query.filter(BotServer.discord_name == server_name).first()
        # if server already in bot_servers, just say it's in there
        if found_server:
            return {'message': 'server exists'}, 200
        # if not add server to bot_servers
        else:
            try:
                server = SessionServer.query.filter(SessionServer.discord_name == server_name).first()
                # server_dict = SessionServer.query.filter(SessionServer.discord_name == server_name).first().to_dict()
                print("In trying to get SessionServer")
                # print(server.to_dict())
                new_server = BotServer(discord_id=server.discord_id, discord_name=server.discord_name, discord_icon=server.discord_icon)
                print("checking new server in BotServer")
                print(new_server.to_dict())
                db.session.add(new_server)
                db.session.commit()
                response = make_response(new_server.to_dict(), 201) 
                return response  
            except Exception as e:
                # Handle any database-related errors here
                db.session.rollback()
                return {'message': str(e)}, 422                     
api.add_resource(BotCheck, '/botcheck')
# class BotCheck(Resource):
# todo discord method
#     def post(self):
#         data = request.get_json()
#         guild_id = data.get('guild_id')
#         bot_token = DISCORD_BOT_TOKEN
#         user_id = data.get('user_id')
#         user_token = data.get('user_token')
#         try:
#             response = self.fetch_discord_membership(guild_id, bot_token, user_id)
#             return response.json(), response.status_code
#         except Exception as error:
#             return {'error': 'Error fetching bot membership', 'details': str(error)}, 500

#     def fetch_discord_membership(self, guild_id, bot_token, user_id):
#         headers = {
#             'Authorization': f'Bot {bot_token}'
#         }
#         url = f'https://discord.com/api/v10/guilds/{guild_id}/members/{user_id}'
#         response = requests.get(url, headers=headers)
#         return response
# api.add_resource(BotCheck, '/fetch-bot')

class ResetDatabaseResource(Resource):
    def post(self):
        try:
            db.drop_all()
            db.create_all()
            return {'message': 'Database reset successfully'}, 200
        except Exception as e:
            return {'error': str(e)}, 500
api.add_resource(ResetDatabaseResource, '/reset-database')

class CommandPost(Resource):
    def post(self):
        try:
            data = request.get_json()
            command_name = data.get('name')
            command_description = data.get('description')
            new_bot_command = BotCommand(name=command_name, description=command_description)
            db.session.add(new_bot_command)
            db.session.commit()

            return {'message': 'Command posted successfully'}, 201

        except Exception as e:
            return {'message': str(e)}, 500
api.add_resource(CommandPost, '/commandpost')

class CommandList(Resource):
    # get request on BotCommand
    def get(self):
        bot_commands = BotCommand.query.all()
        bot_commands_dict_list = [command.to_dict() for command in bot_commands]
        return jsonify(bot_commands_dict_list)
api.add_resource(CommandList, '/commandlist')

class CommandCheck(Resource):
    # get request on ServerCommand
    def get(self):
        server_commands = ServerCommand.query.all()
        server_commands_dict_list = [command.to_dict() for command in server_commands]
        return jsonify(server_commands_dict_list)
api.add_resource(CommandCheck, '/commandcheck')

class BotServers(Resource):
    # get request on BotServer
    def get(self):
        bot_servers = BotServer.query.all()
        bot_servers_dict_list = [server.to_dict() for server in bot_servers]
        print(bot_servers_dict_list)
        return jsonify(bot_servers_dict_list)
api.add_resource(BotServers, '/botservers')

class AddServerCommand(Resource):
    def post(self):
        try:
            data = request.get_json()
            command_id = data.get('command_id')
            command_name = data.get('name')
            command_description = data.get('description')
            discord_name = data.get('discord_name')
            discord_id = data.get('discord_id')
            new_server_command = ServerCommand(command_id=command_id ,command_name=command_name, command_description=command_description, discord_name=discord_name, discord_id=discord_id)
            db.session.add(new_server_command)
            db.session.commit()
            return {'message': 'Command posted successfully'}, 201

        except Exception as e:
            db.session.rollback()  
            return {'message': str(e)}, 500

api.add_resource(AddServerCommand, '/addservercommand')

class DeleteServerCommand(Resource):
    def delete(self, id):
        try:
            command = ServerCommand.query.filter_by(id=id).first()
            if command:
                db.session.delete(command)
                db.session.commit()
                return {}, 204
            else:
                return {'message': 'Command not found'}, 404

        except Exception as e:
            db.session.rollback() 
            return {'message': str(e)}, 500
api.add_resource(DeleteServerCommand, '/deleteservercommand/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)