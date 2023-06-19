"""Application configuration class."""
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

host = os.environ.get("HOST")
port = os.environ.get("PORT")

class Config():
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_SECRET_KET = os.environ.get("SECRET_KEY") # for now
    JWT_BLACKLIST_ENABLED = True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ENV = os.environ.get("FLASK_ENV")
    DEBUG = True if os.environ.get("FLASK_ENV") != "production" else False
    #SERVER_NAME = f'{ host }:{ port }'
    JSON_SORT_KEYS = False
