"""Assessment-related database model declarations."""
# from uuid import uuid4
from app import db


class AssessmentSubmission(db.Model):
    """Assessment submission database model declaration."""

    __tablename__ = "AssessmentSubmission"
    id = db.Column(db.String, primary_key=True, nullable=False)
    assessment_id = db.Column(db.String, db.ForeignKey('Assessment.id'), nullable=False)
    student_id = db.Column(db.String, db.ForeignKey('Student.id'), nullable=False)
    lecturer_id = db.Column(db.String, db.ForeignKey('Lecturer.id'), nullable=False)
    questions = db.relationship('QuestionSubmission', backref='submission', lazy=True)
    correct = db.Column(db.Integer)

    def __repr__(self):
        """Represent assessment submission database model."""
        return f'AssessmentSubmission (id: "{ self.id }")'


class QuestionSubmission(db.Model):
    """Question submission database model declaration."""

    __tablename__ = "QuestionSubmission"
    id = db.Column(db.String, primary_key=True, nullable=False)
    submission_id = db.Column(db.String, db.ForeignKey('AssessmentSubmission.id'), nullable=False)
    multiple_choice_question_id = db.Column(db.String, db.ForeignKey('MultiChoiceQuestion.id'), nullable=True)
    true_false_question_id = db.Column(db.String, db.ForeignKey('TrueFalseQuestion.id'), nullable=True)
    answer = db.Column(db.String(20))
    result = db.Column(db.Boolean)


class Assessment(db.Model):
    """Assessment database model declaration."""
    
    __tablename__ = "Assessment"
    id = db.Column(db.String, primary_key=True, nullable=False)
    title = db.Column(db.String(30), nullable=False)
    submissions = db.relationship('AssessmentSubmission', backref="assessment", lazy=True)
    author_id = db.Column(db.String, db.ForeignKey('Lecturer.id'), nullable=False)
    multiple_choice_questions = db.relationship('MultiChoiceQuestion', backref="assessment", lazy=True)
    true_false_questions = db.relationship('TrueFalseQuestion', backref="assessment", lazy=True)
    
    def __repr__(self):
        """Represent assessment database model."""
        return f'Assessment (id: "{ self.id }")'
