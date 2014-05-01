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
import draft


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

    @classmethod
    def _replace_resource_ids_with_models(class_, object_dict):
        """ Return an object dict with relationship ids replaced by models."""
        object_dict = super(
            Essay,
            class_)._replace_resource_ids_with_models(object_dict)

        # drafts
        draft_ids = object_dict.get("drafts", [])
        drafts = []
        for id in draft_ids:
            drafts.append(draft.Draft.query.get(id))

        object_dict["drafts"] = drafts

        return object_dict


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

    @classmethod
    def _replace_resource_ids_with_models(class_, object_dict):
        """ Return an object dict with relationship ids replaced by models."""
        object_dict = super(
            ThemeEssay,
            class_)._replace_resource_ids_with_models(object_dict)

        # application_essays
        application_essay_ids = object_dict.get("application_essays", [])
        essays = []
        for id in application_essay_ids:
            essays.append(ApplicationEssay.query.get(id))

        object_dict["application_essays"] = essays

        return object_dict


class ApplicationEssay(Essay):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields
    # relationships
