"""
models.essay
~~~~~~~~~~~~

This module contains an abstract Essay and its subclasses, ThemeEssay and
ApplicationEssay. A ThemeEssay is the essay the students first write. An
ApplicationEssay is the essay the students write for a specific Application.

Essays have a series of Drafts that the Student writes.

"""
from .db import db
from .base import BaseModel
from .fields import SerializableStringList
from .relationships import essay_associations


class Essay(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    essay_prompt = db.Column(db.String, nullable=False)

    # optional fields
    audience = db.Column(db.String)
    context = db.Column(db.String)
    topic = db.Column(db.String)
    word_count = db.Column(db.Integer)
    num_of_drafts = db.Column(db.Integer)
    due_date = db.Column(db.Date)

    # inheritance
    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}

    # relationships
    drafts = db.relationship("Draft", backref="essay")


class ThemeEssay(Essay):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'theme_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields
    proposed_topics = db.Column(SerializableStringList)

    # relationships
    application_essays = db.relationship(
        "ApplicationEssay",
        secondary=essay_associations,
        backref=db.backref("theme_essay", lazy="dynamic"))


class ApplicationEssay(Essay):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields
    # relationships
