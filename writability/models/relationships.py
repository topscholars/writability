"""
models.relationships
~~~~~~~~~~~~~~~~~~~~

This module contains all relationships for all models / tables.

"""
from .db import db

# essay_associations: many to many relationship between application_essay and
# theme_essay.
essay_associations = db.Table(
    "essay_association",
    db.Column(
        "application_essay_id",
        db.Integer,
        db.ForeignKey("application_essay.id")),
    db.Column(
        "theme_essay_id",
        db.Integer,
        db.ForeignKey("theme_essay.id"))
)
