"""Question-related database model delcarations."""
from uuid import uuid4
from app import db


class Question(db.Model):
    """Question database model declaration."""

    __abstract__ = True
    __tablename__ = "Question"
    id = db.Column(db.String, primary_key=True, nullable=False)
    title = db.Column(db.String(128), unique=False, nullable=False)
    label = db.Column(db.String(128), unique=False, nullable=False)
    difficulty = db.Column(db.Integer)
    feedback = db.Column(db.String(128))
    feedforward = db.Column(db.String(128))

    def __repr__(self):
        """Represent question database model."""
        return f'Question (id: "{self.id}", title: "{self.title}", content: "{self.content}", answer: "{self.answer}")'


class TrueFalseQuestion(Question):
    """TrueFalseQuestion database model declaration."""

    __tablename__ = "TrueFalseQuestion"
    answer = db.Column(db.Boolean, unique=False, nullable=False)
    assessment_id = db.Column(db.String, db.ForeignKey(
        'Assessment.id'), nullable=False)
    questions = db.relationship(
        'QuestionSubmission', backref='true_false_question', lazy=True)

    def __repr__(self):
        """Represent TrueFalseQuestion database model."""
        return f'TrueFalseQuestion (id: "{ self.id }")'


class MultiChoiceQuestion(Question):
    """MultiChoiceQuestion database model declaration."""

    __tablename__ = "MultiChoiceQuestion"
    answer_id = db.Column(db.String, db.ForeignKey(
        'Option.id'), nullable=True)
    assessment_id = db.Column(db.String, db.ForeignKey(
        'Assessment.id'), nullable=False)
    options = db.relationship(
        'Option', foreign_keys="Option.question_id", backref='question', lazy=True)
    questions = db.relationship(
        'QuestionSubmission', backref='multi_choice_question', lazy=True)

    def __repr__(self):
        """Represent MultiChoice database model."""
        return f'MultiChoice (id: "{ self.id }")'


class Option(db.Model):
    "Options database model declaration."

    __tablename__ = "Option"
    id = db.Column(db.String, primary_key=True, nullable=False)
    label = db.Column(db.String(128))

    question_id = db.Column(db.String, db.ForeignKey(
        'MultiChoiceQuestion.id'), nullable=False)
    answer_to = db.relationship(
        'MultiChoiceQuestion', foreign_keys="MultiChoiceQuestion.answer_id", backref='answer', lazy=True)

    def __repr__(self):
        """Represent option database model."""
        return f'Option (id: "{ self.id }")'
