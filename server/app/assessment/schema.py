"""Assessment-related database schemas."""
from app import marshmallow
from app.question.schema import MultiChoiceSchema, TrueFalseSchema 
from .models import Assessment, AssessmentSubmission, QuestionSubmission
from marshmallow import fields


class AssessmentSchema(marshmallow.Schema):
    """Assessment model schema."""

    multiple_choice_questions = fields.Nested(MultiChoiceSchema, many=True)
    true_false_questions = fields.Nested(TrueFalseSchema, many=True)

    class Meta:
        model = Assessment
        fields = ('id', 'title', 'questions', 'multiple_choice_questions', 'true_false_questions', 'student_id', 'correct', 'author_id', 'lecturer_id')


class QuestionSubmissionSchema(marshmallow.Schema):
    "Assessment response model schema."

    multi_choice_question = fields.Nested(MultiChoiceSchema, many=False)
    true_false_question = fields.Nested(TrueFalseSchema, many=False)

    class Meta:
        "Asessment response model Meta."

        model = AssessmentSubmission
        fields = ('id', 'assessment', "multi_choice_question", "true_false_question", "answer", "result")


class AssessmentSubmissionSchema(marshmallow.Schema):
    "Assessment response model schema."

    assessment = fields.Nested(AssessmentSchema, many=False)
    questions = fields.Nested(QuestionSubmissionSchema, many=True)

    class Meta:
        "Asessment response model Meta."

        model = AssessmentSubmission
        fields = ('id', 'assessment', "questions", "correct", "student_id", 'author_id', 'lecturer_id')
