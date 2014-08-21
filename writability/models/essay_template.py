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
from sqlalchemy.orm import validates

class ChoiceGroup(BaseModel):
    __mapper_args__ = {'polymorphic_identity': 'choice_group'}
    __tablename__ = 'choice_group'

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    cg_id = db.Column(db.Integer)
    num_required_essays = db.Column(db.Integer, nullable=False)

    # relationships
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'))
    university = db.relationship(
        "University",
        backref=db.backref("choice_group",uselist=True))

    application_essay_templates = db.relationship(
        "ApplicationEssayTemplate",
        backref=db.backref("choice_group"))

class EssayTemplate(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    essay_prompt = db.Column(db.String, nullable=False)

    # optional fields

    # inheritance
    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}

    # relationships
    # FIXME: this request could will get super expensive
    essays = db.relationship("Essay", backref="essay_template")


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
    max_words = db.Column(db.Integer)

    # optional fields
    due_date = db.Column(db.Date)
    requirement_type = db.Column(db.String(20), nullable=False, server_default='Required', default='Required')

    # relationships
    university_id = db.Column(db.Integer, db.ForeignKey("university.id"))
    special_program_id = db.Column(db.Integer, db.ForeignKey("special_program.id"), nullable=True, default=None)
    choice_group_id = db.Column(db.Integer, db.ForeignKey("choice_group.id"), nullable=True, default=None)
    themes = db.relationship(
        "Theme",
        secondary=theme_application_template_associations,
        backref=db.backref("application_essay_templates", lazy="dynamic"))

    @validates('requirement_type')
    def validate_requirement_type(self, key, requirement_type):
        assert requirement_type in ['Choice','Required','Optional']
        return requirement_type
