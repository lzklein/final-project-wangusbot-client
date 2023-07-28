import os
from ipdb import set_trace
from config import app, api
from models import User, Review, Wishlist, Cart, Order
from flask import Flask, request, make_response, session, jsonify
from flask_migrate import Migrate
from flask_restful import Resource, reqparse
# from sqlalchemy import func
# from requests import post
from dotenv import load_dotenv



if __name__ == '__main__':
    app.run(port=5555, debug=True)
