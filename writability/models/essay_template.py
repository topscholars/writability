"""
models.essay_template
~~~~~~~~~~~~~~~~~~~~~

This module contains an abstract EssayTemplate and its subclases,
ThemeEssayTemplate and ApplicationEssayTemplate. These Templates are static
blueprints for creating new Essays using Writability's Themes and the
universities' applications.

"""
from .db import db
from .base import BaseModel
from .relationships import theme_application_template_associations


class EssayTemplate(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    essay_prompt = db.Column(db.String, nullable=False)

    # optional fields
    due_date = db.Column(db.Date)

    # inheritance
    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}

    # relationships


class ThemeEssayTemplate(EssayTemplate):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'theme_essay_template'}

    # required fields
    id = db.Column(
        db.Integer,
        db.ForeignKey('essay_template.id'),
        primary_key=True)

    # optional fields
    audience = db.Column(db.String)
    context = db.Column(db.String)

    # relationships
    theme_id = db.Column(db.Integer, db.ForeignKey("theme.id"))


class ApplicationEssayTemplate(EssayTemplate):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'application_essay_template'}

    # required fields
    id = db.Column(
        db.Integer,
        db.ForeignKey('essay_template.id'),
        primary_key=True)
    word_count = db.Column(db.Integer)

    # optional fields
    # relationships
    university_id = db.Column(db.Integer, db.ForeignKey("university.id"))
    themes = db.relationship(
        "Theme",
        secondary=theme_application_template_associations,
        backref=db.backref("application_essay_templates", lazy="dynamic"))
