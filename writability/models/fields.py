"""
models.fields
~~~~~~~~~~~~~

This module contains custom db fields.

"""
from sqlalchemy.dialects.postgresql import ARRAY

from db import db


class SerializableDateTime(db.TypeDecorator):

    impl = db.DateTime

    def process_result_value(self, value, dialect):
        # account for nullable deleted_ts by simply returning None
        return value.isoformat() if value is not None else value


class SerializableStringList(db.TypeDecorator):

    impl = ARRAY(db.String)

    def process_bind_param(self, value, dialect):
        # return [s.strip() for s in value.split(',')]
        return value

    def process_result_value(self, value, dialect):
        # return ', '.join(value)
        return value
