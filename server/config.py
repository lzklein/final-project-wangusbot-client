from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Create the Flask app
app = Flask(__name__)

# Configure the database URI and disable modification tracking
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Disable JSON compacting for Flask-RESTful
app.json.compact = False

# Specify custom naming conventions for ForeignKey constraints
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Create the SQLAlchemy database object
db = SQLAlchemy(app, metadata=metadata)

# Create the Migrate object
migrate = Migrate(app, db)

# Create the Flask-RESTful API object
api = Api(app)

# Enable CORS
CORS(app)
