"""
models.university
~~~~~~~~~~~~~~~~~

This module contains a University.

"""
from .db import db
from .base import BaseModel


class University(BaseModel):
    # required fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    # optional fields
    logo_url = db.Column(db.String)
    use_common_app = db.Column(db.Boolean, nullable=False, default=False)

    # inheritance

    # relationships
    application_essay_templates = db.relationship(
        "ApplicationEssayTemplate",
        backref="university")
    special_programs = db.relationship(
        "SpecialProgram",
        backref="university")

    # students: don't explicitly declare it but it's here
