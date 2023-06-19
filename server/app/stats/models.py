# Students must be able to review relevant attempt, attainment and engagement statistics.
# This may be achieved by utilising the following database models:
from app import db
class QuestionSubmission(db.Model):
    """QuestionSubmission database model declaration."""

    __tablename__ = "QuestionSubmission"
    id = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.String(128))
    feedback = db.Column(db.String(128))

    assessment_id = db.Column(db.Integer, db.ForeignKey('Assessment.id'), nullable=False)
    assessment = db.relationship('Assessment', foreign_keys="QuestionSubmission.assessment_id", backref='questions', lazy=True)

    true_false_question_id = db.Column(db.Integer, db.ForeignKey('TrueFalseQuestion.id'), nullable=False)
    multi_choice_question_id = db.Column(db.Integer, db.ForeignKey('MultiChoiceQuestion.id'), nullable=False)

    def __repr__(self):
        """Represent QuestionSubmission database model."""
        return f'QuestionSubmission (id: "{ self.id }")'

class Assessment(db.Model):
    """Assessment database model declaration."""

    __tablename__ = "Assessment"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), unique=False, nullable=False)
    description = db.Column(db.String(128), unique=False, nullable=True)
    module_id = db.Column(db.Integer, db.ForeignKey('Module.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('Student.id'), nullable=False)
    date_submitted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    feedback = db.Column(db.String(128))

    def __repr__(self):
        """Represent Assessment database model."""
        return f'Assessment (id: "{ self.id }")'

class Module(db.Model):
    """Module database model declaration."""

    __tablename__ = "Module"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=False, nullable=False)
    code = db.Column(db.String(128), unique=True, nullable=False)
    description = db.Column(db.String(128), unique=False, nullable=False)
    lecturer_id = db.Column(db.Integer, db.ForeignKey('TeachingStaff.id'), nullable=False)
    students = db.relationship('Student', backref='module', lazy=True)
    assessments = db.relationship('Assessment', backref='module', lazy=True)

    def __repr__(self):
        """Represent Module database model."""
        return f'Module (id: "{ self.id }")'