"""Assessments-related views."""
import json
import time
from typing import Type, Union
from uuid import uuid4
from app.users.models import Student, Lecturer
from app.question.models import MultiChoiceQuestion, TrueFalseQuestion, Option
from flask import Response, request
from flask_restful import Resource

from .schema import AssessmentSubmissionSchema, AssessmentSchema
from .models import Assessment, AssessmentSubmission, QuestionSubmission
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import NoResultFound

from app import db


class AssessmentView(Resource):
    """Assessment api view."""

    @jwt_required()
    def get(self, id: int) -> Response:
        """Assessment api view."""
        try:
            instance = Assessment.query.get(id)
            schema = AssessmentSchema(many=False)
            return schema.dump(instance)
        except NoResultFound as exception:
            return Response(str(exception), status=404)


class AssessmentListView(Resource):
    """Assessment list api view."""

    @jwt_required()
    def get(self) -> Response:
        """Handle assessment list GET requests."""
        try:
            user = self.get_user(get_jwt_identity())
            instance = self.get_objects(user)
            schema = AssessmentSchema(many=True)
            return schema.dump(instance)
        except PermissionError as exception:
            return Response(str(exception), status=403)

    @jwt_required()
    def post(self) -> Response:
        """Handle assessment list api POST requests."""
        try:
            user = self.get_user(get_jwt_identity())
            instance = self.create_object(user)
            self.create_questions(instance)
            return Response(status=200)
        except ValueError as exception:
            db.session.rollback()
            return Response(str(exception), status=400)

    def create_object(self, user: Lecturer) -> Assessment:
        """
        Create an new Assessment object.

        raises:
            ValueError: if the values are failing constraints.
        """
        instance = Assessment(id=str(uuid4()), title=request.form.get("title"), author=user)
        db.session.add(instance)
        db.session.commit()
        return instance

    def get_objects(self, user: Union[Student, Lecturer]) -> Assessment:
        """Return all assessment objects based on the user"""
        if user.__tablename__ == "Student":
            return Assessment.query.all()
        return user.assessments

    def get_user(self, username: str) -> Union[Student, Lecturer]:
        """
        Get the current user.

        raises:
            PermissionError: if no user can be found.
        """
        user = Student.query.filter_by(username=username).first()
        if user == None:
            user = Lecturer.query.filter_by(username=username).first()
        if user == None:
            raise PermissionError(
                f"No user could be find for username '{username}'")
        return user

    def create_questions(self, assessment: Type[Assessment]) -> None:
        """
        Create all the multi-choice and true / false questions questions.

        raises:
            ValueError: passed from self.__create_question_multi_choice
            ValueError: passed from self.__create_question_true_false
        """
        for true_false in json.loads(request.form.get("true_false")):
            self.__create_question_true_false(true_false, assessment)
        for multi_choice in json.loads(request.form.get("multi_choice")):
            self.__create_question_multi_choice(multi_choice, assessment)

    def __create_question_multi_choice(self, data: dict, assessment: Type[Assessment]) -> None:
        """
        Create a multi-choice question object.

        raises:
            ValueError: if the values are failing constraints.
        """
        instance = MultiChoiceQuestion(
            id=str(uuid4()),
            label=data["label"],
            title=data["title"],
            difficulty=data["difficulty"],
            feedback=data["feedback"],
            feedforward=data["feedforward"],
            assessment=assessment
        )
        self.__create_options(data["options"], instance)
        self.__update_answer(instance, data["answer"])
        db.session.add(instance)
        db.session.commit()

    def __create_question_true_false(self, data: dict, assessment: Type[Assessment]) -> None:
        """
        Create a true / false question object.

        raises:
            ValueError: if the values are failing constraints.
        """
        instance = TrueFalseQuestion(
            id=str(uuid4()),
            title=data["title"],
            label=data["label"],
            answer=data["answer"],
            difficulty=data["difficulty"],
            feedback=data["feedback"],
            feedforward=data["feedforward"],
            assessment=assessment
        )
        db.session.add(instance)
        db.session.commit()


    def __create_options(self, data_set: list, question: Type[MultiChoiceQuestion]) -> None:
        """
        Create a multi-choice option object.

        raises:
            ValueError: if the values are failing constraints.
        """
        data_set = list(filter(lambda x: x != "", data_set))
        for data in data_set:
            instance = Option(id=str(uuid4()), label=data, question=question)
            db.session.add(instance)
        db.session.commit()

    def __find_answer(self, question: Type[MultiChoiceQuestion], answer: str) -> Option:
        """
        Finds a related answer object.

        raises:
            ValueError: if the values are failing constraints.
        """
        instance = Option.query.filter_by(
            question=question, label=answer).first()
        if instance == None:
            raise ValueError("The answer does not match the options")
        return instance

    def __update_answer(self, question: Type[MultiChoiceQuestion], answer: str) -> None:
        """
        Updates an answer on a MultiChoice question.

        raises:
            ValueError: if the values are failing constraints.
        """
        _answer = self.__find_answer(question, answer)
        question.answer = _answer
        db.session.commit()


class AssessmentSubmissionView(Resource):
    """Assessment response api view."""

    @jwt_required()
    def get(self, id: int) -> Response:
        """Handle assessment GET requests."""
        try:
            instance = AssessmentSubmission.query.get(id)
            schema = AssessmentSubmissionSchema(many=False)
            return schema.dump(instance)
        except NoResultFound as exception:
            return Response(str(exception), status=404)


class AssessmentSubmissionListView(Resource):
    """Assessment repsonse list api view."""

    @jwt_required()
    def post(self, assessment_id: int) -> Response:
        """Handle assessment list POST requests."""
        try:
            user = self.get_user(get_jwt_identity())
            instance = self.create_object(
                assessment_id=assessment_id, user=user)
            self.__create_objects(instance)
            self.__update_correct(instance)
            schema = AssessmentSubmissionSchema(many=False)
            return schema.dump(instance)
            # return Response(status=201)
        except ValueError as exception:
            db.session.rollback()
            return Response(str(exception), status=400)
        except PermissionError as exception:
            db.session.rollback()
            return Response(str(exception), status=403)
        except NoResultFound as exception:
            db.session.rollback()
            return Response(str(exception), status=404)

    def create_object(self, assessment_id: int, user: Type[Student]) -> AssessmentSubmission:
        """
        Create and return a new AssessmentSubmission object.

        raises:
            ValueError: if the values are failing constraints.
        """
        instance = AssessmentSubmission(
            id=str(uuid4()),
            assessment_id=assessment_id,
            student=user, 
            lecturer_id=author_id
        )
        db.session.add(instance)
        db.session.commit()
        return instance

    def get_user(self, username: str) -> Student:
        """
        Return the requesting user.

        raises:
            PermissionError: if no user can be found in the Student table.
        """
        user = Student.query.filter_by(username=username).first()
        if user == None:
            user = Lecturer.query.filter_by(username=username).first()
        if user == None:
            raise PermissionError(
                f"No user could be find for username '{username}'")
        return user

    def __create_objects(self, instance: AssessmentSubmission) -> None:
        """
        Create related objects.

        raises:
            ValueError: if the provided values are incorrect.
            NoResultFound: if no question is found with the given id.
        """
        for item in request.form.getlist("answers"):
            data = json.loads(item)
            question = self.__get_question(data["id"])
            if question.__tablename__ == "MultiChoiceQuestion":
                self.__create_multi_choice(data, instance, question)
            elif question.__tablename__ == "TrueFalseQuestion":
                self.__create_true_false(data, instance, question)

    def __get_question(self, pk: int) -> Union[MultiChoiceQuestion, TrueFalseQuestion]:
        """
        Get a question by id.

        raises:
            NoResultFound: if a question with that id does not exist.
        """
        question = MultiChoiceQuestion.query.filter_by(id=pk).first()
        if question == None:
            question = TrueFalseQuestion.query.filter_by(id=pk).first()
        if question == None:
            raise NoResultFound(f"A question with id '{pk}' does not exist")
        return question

    def __update_correct(self, instance: AssessmentSubmission) -> AssessmentSubmission:
        """Updates the 'correct' amount on the instance."""
        amount_correct = QuestionSubmission.query.filter_by(
            submission=instance, result=True).count()
        instance.correct = amount_correct
        db.session.commit()
        return instance

    def __create_true_false(self, data: dict, instance: AssessmentSubmission, question: TrueFalseQuestion) -> QuestionSubmission:
        """
        Create a True / False question.

        raises:
            ValueError: if a constraint fails.
        """
        submission = QuestionSubmission(
            id=str(uuid4()),
            submission=instance,
            true_false_question=question,
            result=data["answer"] == question.answer,
            answer=str(data["answer"])
        )
        db.session.add(submission)
        db.session.commit()

    def __create_multi_choice(self, data: dict, instance: AssessmentSubmission, question: MultiChoiceQuestion) -> QuestionSubmission:
        """
        Create a MultiChoice question.

        raises:
            ValueError: if a constraint fails.
        """
        submission = QuestionSubmission(
            id=str(uuid4()),
            submission=instance,
            multi_choice_question=question,
            result=data["answer"] == question.answer_id,
            answer=str(question.answer.label)
        )
        db.session.add(submission)
        db.session.commit()
