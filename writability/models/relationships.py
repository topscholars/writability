"""
models.relationships
~~~~~~~~~~~~~~~~~~~~

This module contains all relationships for all models / tables.

"""
from .db import db

# essay_associations: many to many relationship between theme_essay and
# application_essay.
essay_associations = db.Table(
    "essay_association",
    db.Column(
        "application_essay_id",
        db.Integer,
        db.ForeignKey("application_essay.id")),
    db.Column(
        "theme_essay_id",
        db.Integer,
        db.ForeignKey("theme_essay.id")))

# theme_application_template_associations: many to many relationship between
# theme and application_essay_template.
theme_application_template_associations = db.Table(
    "theme_application_template_associations",
    db.Column(
        "theme_id",
        db.Integer,
        db.ForeignKey("theme.id")),
    db.Column(
        "application_essay_template_id",
        db.Integer,
        db.ForeignKey("application_essay_template.id")))
