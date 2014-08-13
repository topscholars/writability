"""
models.special_program
~~~~~~~~~~~~~~~~~

This module contains a Special Program.
"""
from sqlalchemy.schema import UniqueConstraint

from .db import db
from .base import BaseModel


class SpecialProgram(BaseModel):
    __mapper_args__ = {'polymorphic_identity': 'special_program'}
    __table_args__ = (
        UniqueConstraint('university_id', 'name', name='name'),
        {}
    )

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # optional fields
    description = db.Column(db.UnicodeText, nullable=False)

    # inheritance

    # relationships
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    # application_essay_templates = db.relationship(
    #     "SpecialProgram",
    #     uselist=False,
    #     backref="special_program")
