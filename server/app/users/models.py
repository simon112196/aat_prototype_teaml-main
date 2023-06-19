"""User-related database model delcarations."""
from uuid import uuid4
from app import db


class User(db.Model):
    """User database model declaration."""

    __abstract__ = True
    __tablename__ = "User"
    id = db.Column(db.String, primary_key=True, nullable=False)
    username = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(64), nullable=False)

    def __repr__(self):
        """Represent user database model."""
        return f'User (id: "{ self.id }", name: "{ self.name }")'

class Student(User):
    """Student database model declaration."""

    __tablename__ = "Student"
    submissions = db.relationship('assessment.models.AssessmentSubmission', backref='student', lazy=True)
    comments = db.relationship('comment.models.Comment', backref='student', lazy=True)

class Lecturer(User):
    """Lecturer database model declaration."""

    __tablename__ = "Lecturer"
    assessments = db.relationship('assessment.models.Assessment', backref='author', lazy=True)
    comments = db.relationship('comment.models.Comment', backref='lecturer', lazy=True)
    
