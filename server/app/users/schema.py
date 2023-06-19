"""User-related database schemas."""
from app import marshmallow
from app.assessment.schema import AssessmentSubmissionSchema, AssessmentSchema
from .models import Student, Lecturer
from marshmallow import fields


class StudentSchema(marshmallow.Schema):
    """Student model schema."""

    submissions = fields.Nested(AssessmentSubmissionSchema, many=True)

    class Meta:
        """Student model schema class Meta."""
        model = Student
        fields = ('__tablename__', 'username', 'submissions')


class LecturerSchema(marshmallow.Schema):
    """Lecutrer model schema."""

    assessments = fields.Nested(AssessmentSchema, many=True)

    class Meta:
        """Lecutrer model schema class Meta."""
        model = Lecturer
        fields = ('__tablename__', 'username', 'assessments')
