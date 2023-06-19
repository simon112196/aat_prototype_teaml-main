"""App module initialization."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.config import Config

db = SQLAlchemy()
marshmallow = Marshmallow()
api = Api()
cors = CORS(resources={r"/api/*": {"origins": "*"}})
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_class=Config) -> Flask:
    """Create and initialize the application, register blueprints."""
    application = Flask(__name__)
    application.config.from_object(Config)

    # Register api endpoints
    from app.comment.views import CommentView, CommentListView
    from app.users.views import UserView, LoginView, RegisterView, RefreshTokenView
    from app.assessment.views import AssessmentView, AssessmentListView, AssessmentSubmissionView, AssessmentSubmissionListView
    from app.stats.views import StatView, StatListView

    api.add_resource(UserView, "/api/user", endpoint="user")
    api.add_resource(CommentListView, "/api/comments", endpoint="comment")
    api.add_resource(CommentView, "/api/comment/<string:id>", endpoint="commentlist")
    api.add_resource(LoginView, "/api/login", endpoint="login")
    api.add_resource(RegisterView, "/api/register", endpoint="register")
    api.add_resource(RefreshTokenView, "/api/token/refresh", endpoint="refreshtoken")
    api.add_resource(AssessmentView, "/api/assessment/<string:id>", endpoint="assessment")
    api.add_resource(AssessmentListView, "/api/assessments", endpoint="assessmentlist")
    api.add_resource(AssessmentSubmissionView, "/api/assessment/submission/<string:id>", endpoint="assessmentsubmission")
    api.add_resource(AssessmentSubmissionListView, "/api/assessment/submissions/<string:assessment_id>", endpoint="assessmentsubmissionlist")
    api.add_resource(StatView, "/api/stat/<string:id>", endpoint="stat")
    api.add_resource(StatListView, "/api/stats", endpoint="stats")

    # Initialize application variables
    db.init_app(application)
    api.init_app(application)
    marshmallow.init_app(application)
    bcrypt.init_app(application)
    cors.init_app(application)
    jwt.init_app(application)

    # Initialize the database
    with application.app_context():
        db.create_all()
    host="0.0.0.0"
    return application
