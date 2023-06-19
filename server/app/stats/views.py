"Question-related views."
import json

from flask import request, Response
from flask_restful import Resource 
from app import db
from app.users.models import Student,Lecturer
from app.assessment.schema import AssessmentSubmission, Assessment
from app.question.models import TrueFalseQuestion, MultiChoiceQuestion, Option
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from typing import Type, Union

class StatView (Resource):
    """StatView api view."""

    def get(self, id: int):
        """Handle StatView GET requests."""
        pass

    def put(self, id: int):
        """Handle StatView POST requests."""
        pass


class StatListView (Resource):
    """StatListView api view."""

    @jwt_required()
    def get(self):
        """Get method for StatListView api view."""
        user = self.get_user(username=get_jwt_identity())
        submissions = AssessmentSubmission.query.filter_by(student_id=user.id ).all()
        submissions2 = AssessmentSubmission.query.filter_by(lecturer_id=user.id).all()
        if submissions is None:
            return {'message': 'Submissions not found'}, 404
        result = []
        for submission in submissions:
            assessment = Assessment.query.filter_by(id=submission.assessment_id).first()
            if assessment is None:
                return {'message': 'Assessment not found'}, 404
            trueFalseQuestion = TrueFalseQuestion.query.filter_by(assessment_id=submission.assessment_id).first()
            if trueFalseQuestion is None:
                return {'message': 'trueFalseQuestion not found'}, 404
            result.append({
                'assessment_id': submission.assessment_id,
                'assessment_name': assessment.title,
                'correct': submission.correct,
                'question':trueFalseQuestion.title,
                'answer':trueFalseQuestion.answer,
                'student_id': submission.student_id
            })
        for submission in submissions2:
            assessment = Assessment.query.filter_by(id=submission.assessment_id).first()
            if assessment is None:
                return {'message': 'Assessment not found'}, 404
            trueFalseQuestion = TrueFalseQuestion.query.filter_by(assessment_id=submission.assessment_id).first()
            if trueFalseQuestion is None:
                return {'message': 'trueFalseQuestion not found'}, 404
            result.append({
                'assessment_id': submission.assessment_id,
                'assessment_name': assessment.title,
                'correct': submission.correct, 
                'question':trueFalseQuestion.title,
                'answer':trueFalseQuestion.answer,
                'student_id': submission.student_id
            })
        return result, 200

    def post(self) -> Response:
        """Handle StatListView POST requests."""
        pass

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
