"""Comment-related database schemas."""
from app import marshmallow
from app.users.schema import LecturerSchema, StudentSchema
from marshmallow import fields
from .models import Comment


class CommentSchema(marshmallow.Schema):
    "CommentSchema model schema."

    lecturer = fields.Nested(LecturerSchema, many=False)
    student = fields.Nested(StudentSchema, many=False)

    class Meta:
        "CommentSchema model Meta."

        ordered = True
        model = Comment
        fields = ('id', 'content', 'lecturer', 'student', 'create_time')
