"""Comment-related database model declarations."""
from uuid import uuid4
from app import db
from datetime import datetime


class Comment(db.Model):
    "Comment database model declaration."

    __tablename__ = "Comment"
    id = db.Column(db.String, primary_key=True, nullable=False)
    content = db.Column(db.Text, unique=False, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.now, nullable=False)
    student_id = db.Column(db.String, db.ForeignKey('Student.id'), nullable=True)
    lecturer_id = db.Column(db.String, db.ForeignKey('Lecturer.id'), nullable=True)

    def __repr__(self):
        """Represent Comment database model."""
        return f'Comment (id: "{ self.id }")'
