from typing import Union
from uuid import uuid4
from flask import request, Response,jsonify
from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required
from app import db
from app.users.models import Student, Lecturer
from app.comment.schema import CommentSchema
from app.comment.models import Comment
from sqlalchemy.exc import NoResultFound


class CommentListView(Resource):

    @jwt_required()
    def get(self):
        """Handle CommentListView GET requests."""
        ascending = request.values.get("ascending")
        page = request.values.get("page")
        if not page:
            page = 1
        page = int(page)
        comments = self.get_objects(ascending=ascending,page=page)
        schema = CommentSchema(many=True)
        responseData = {
            "total" : db.session.query(Comment).count(),
            "data" : schema.dump(comments)
        }
        return jsonify(responseData)

    @jwt_required()
    def post(self):
        """Handle CommentListView POST requests."""
        try:
            user = self.get_user(username=get_jwt_identity())
            if user.__tablename__ == "Student":
                comment = Comment(id=str(uuid4()), content=request.form["content"], student=user)
            else:
                comment = Comment(id=str(uuid4()), content=request.form["content"], lecturer=user)
            db.session.add(comment)
            db.session.commit()
            return Response(status=201)
        except ValueError as exception:
           return Response(str(exception), status=400)
        except NoResultFound as exception:
           return Response(str(exception), status=404)

    def get_objects(self, ascending: bool , page:int) -> Comment:
        """Return all the Comment object."""
        if ascending == "true":
            return Comment.query.order_by(Comment.create_time.asc()).offset(10*(page - 1)).limit(10).all()
        return Comment.query.order_by(Comment.create_time.desc()).offset(10*(page - 1)).limit(10).all()

    def get_user(self, username: str) -> Union[Lecturer, Student]:
        """
        Returns a user.

        raises:
            Exception: If the user does not exist.
        """
        user = Student.query.filter_by(username=username).first()
        if user == None:
            user =  Lecturer.query.filter_by(username=username).first()
        if user == None:
            raise NoResultFound(f"The user '{ username }' does not exist.")
        return user


class CommentView(Resource):
    """CommentView api view."""

    @jwt_required()
    def get(self, id: int) -> Response:
        """Assessment api view."""
        try:
            username = get_jwt_identity()
            user = self.get_user(username=username)
            if user.__tablename__ == "Student":
                instance = Comment.query.filter_by(student_id=user.id, id=id).first()
            else:
                instance = Comment.query.filter_by(lecturer_id=user.id, id=id).first()
            schema = CommentSchema(many=False)
            return schema.dump(instance)
        except ValueError as exception:
            return Response(str(exception), status=400)
        except NoResultFound as exception:
            return Response(str(exception), status=404)

    @jwt_required()
    def put(self, id: int):
        """Handle CommentView POST requests."""
        try:
            comment = Comment.query.get(id)
            comment.content = request.form["content"]
            db.session.add(comment)
            db.session.commit()
            return Response(status=200)
        except ValueError as exception:
            return Response(str(exception), status=400)

    @jwt_required()
    def delete(self, id):
        """Handle CommentView DELETE requests."""
        try:
            username = get_jwt_identity()
            user = self.get_user(username=username)
            if user.__tablename__ == "Student":
                Comment.query.filter_by(id=id, student=user).delete()
            else:
                Comment.query.filter_by(id=id).delete()
            db.session.commit()
            return Response(status=200)
        except ValueError as exception:
           return Response(str(exception), status=400)
        except NoResultFound as exception:
           return Response(str(exception), status=404)

    def get_user(self, username: str) -> Union[Lecturer, Student]:
        """
        Returns a user.

        raises:
            Exception: If the user does not exist.
        """
        user = Student.query.filter_by(username=username).first()
        if user == None:
            user =  Lecturer.query.filter_by(username=username).first()
        if user == None:
            raise Exception(f"The user '{ username }' does not exist.")
        return user
