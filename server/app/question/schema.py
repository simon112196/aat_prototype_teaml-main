"""Question-related database schemas."""
from app import marshmallow
from .models import MultiChoiceQuestion, Option, TrueFalseQuestion
from marshmallow import fields


class OptionSchema(marshmallow.Schema):
    """Option model schema."""

    class Meta:
        """Option model schema class Meta."""
        model = Option
        fields = ('id', 'label', 'question_id')


class TrueFalseSchema(marshmallow.Schema):
    """TrueFalse model schema."""

    class Meta:
        """TrueFalse model schema class Meta."""
        model = TrueFalseQuestion
        fields = ('id', '__tablename__', 'assessment_id', 'title', 'label', 'answer')


class MultiChoiceSchema(marshmallow.Schema):
    """MultiChoice model schema."""

    options = fields.Nested(OptionSchema, many=True)
    answer = fields.Nested(OptionSchema, many=False)

    class Meta:
        """MultiChoice model schema class Meta."""
        model = MultiChoiceQuestion
        fields = ('id', '__tablename__', 'assessment_id', 'title', 'label', 'options', 'answer')
