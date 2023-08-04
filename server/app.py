import os
from ipdb import set_trace
from config import app, db, migrate, api
# from models import User
from flask import request, make_response, session, jsonify, redirect, url_for
from flask_restful import Resource, reqparse
from dotenv import load_dotenv
import requests

dotenv_path = "../.env" 
load_dotenv(dotenv_path)
DISCORD_CLIENT_ID = os.environ.get("CLIENT_ID")
DISCORD_CLIENT_SECRET = os.environ.get("SECRET")
DISCORD_REDIRECT_URI = os.environ.get("REDIRECT_URI")
DISCORD_BOT_TOKEN = os.environ.get("BOT_TOKEN")

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

# class BotCheck(Resource):
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
