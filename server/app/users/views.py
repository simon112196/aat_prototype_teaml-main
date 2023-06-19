"Users-related views."
from typing import Type, Union
from uuid import uuid4
from flask import jsonify, request, Response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required

from app import db, bcrypt
from app.users.models import Student, Lecturer
from app.users.schema import StudentSchema, LecturerSchema


class UserView(Resource):
    """User api view."""

    @jwt_required()
    def get(self) -> Response:
        """Handle user endpoint GET requests."""
        try:
            username = get_jwt_identity()
            instance = self.get_user(username=username)
            schema = self.get_schema(instance, many=False)
            return schema.dump(instance)
        except PermissionError as exception:
            return Response(str(exception), status=401)

    def get_user(self, username: str) -> Union[Student, Lecturer]:
        """
        Get the current user.
        
        raises:
            PermissionError: if no user is found.
        """
        try:
            user = Student.query.filter_by(username=username).first()
            if user is None:
                user = Lecturer.query.filter_by(username=username).first()
            if user == None:
                raise PermissionError("No user has been found with that username")
            return user
        except PermissionError as exception:
            raise exception

    def get_schema(self, user: Union[Type[Student], Type[Lecturer]], *args, **kwargs) -> Union[StudentSchema, LecturerSchema]:
        """Return a schema based on the user type."""
        if user.__tablename__ == "Student":
            return StudentSchema(*args, **kwargs)
        return LecturerSchema(*args, **kwargs)
    

class RegisterView(Resource):
    """User register view."""

    def post(self) -> Response:
        """Register a user."""
        try:
            instance = self.create_object()
            db.session.add(instance)
            db.session.commit()
            return Response(status=201)
        except (ValueError, IntegrityError) as exception:
            return Response(str(exception), status=400)
    
    def create_object(self) -> Union[Student, Lecturer]:
        """
        Create and return user object.
        
        raises:
            ValueError: if the values are failing constraints.
        """
        try:
            username = request.form.get("username")
            password = request.form.get("password")
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            if request.form.get("lecturer") == "true":
                return Lecturer(id=str(uuid4()), username=username, password=hashed_password)
            return Student(id=str(uuid4()), username=username, password=hashed_password)
        except ValueError as exception:
            raise exception


class LoginView(Resource):
    """User login view."""

    def post(self) -> Response:
        """Log in a user."""
        try:
            username = request.form.get("username")
            password = request.form.get("password")
            
            user = self.get_user(username=username)
            self.validate(user=user, password=password)

            access = create_access_token(identity=username)
            refresh = create_refresh_token(identity=username)
            return jsonify(access_token=access, refresh_token=refresh)
        except PermissionError as exception:
            return Response(str(exception), status=401)
        except ValueError as exception:
            return Response(str(exception), status=404)

    
    def validate(self, user: Union[Type[Student], Type[Lecturer]], password: str) -> None:
        """"""
        if not user or not bcrypt.check_password_hash(user.password, password):
            raise PermissionError("The password is incorrect")

    def get_user(self, username: str) -> Union[Student, Lecturer]:
        """
        Return the requesting user.

        raises:
            PermissionError: if no user can be found in the Student table.
        """
        try:
            user = Lecturer.query.filter_by(username=username).first()
            if user == None:
                user = Student.query.filter_by(username=username).first()
            if user == None:
                raise ValueError("No user corresponds to that username")
            return user
        except ValueError as exception:
            raise exception


class RefreshTokenView(Resource):
    """Refresh token view."""

    @jwt_required(refresh=True)
    def post(self):
        """Refresh a JWT token."""
        username = get_jwt_identity()
        access = create_access_token(identity=username)
        refresh = create_refresh_token(identity=username)
        return jsonify(access_token=access, refresh_token=refresh)
