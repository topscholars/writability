"""
models.essay
~~~~~~~~~~~~

This module contains an abstract Essay and its subclasses, ThemeEssay and
ApplicationEssay. A ThemeEssay is the essay the students first write. An
ApplicationEssay is the essay the students write for a specific Application.

"""
from .db import db
from .base import BaseModel, SerializableStringList


class Essay(BaseModel):

    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.String, nullable=False)

    audience = db.Column(db.String)
    context = db.Column(db.String)
    topic = db.Column(db.String)
    word_count = db.Column(db.Integer)
    num_of_drafts = db.Column(db.Integer)
    due_date = db.Column(db.Date)

    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}


class ThemeEssay(Essay):

    __mapper_args__ = {'polymorphic_identity': 'theme_essay'}

    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    proposed_topics = db.Column(SerializableStringList)


class ApplicationEssay(Essay):

    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)
