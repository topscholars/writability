"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
from .db import db
from .base import BaseModel
import essay


class Draft(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)

    # optional fields
    plain_text = db.Column(db.String)
    formatted_text = db.Column(db.String)
    word_count = db.Column(db.Integer)
    due_date = db.Column(db.Date)
    is_final_draft = db.Column(db.Boolean, default=False)

    # relationships
    essay_id = db.Column(db.Integer, db.ForeignKey("essay.id"))

    @classmethod
    def _replace_resource_ids_with_models(class_, object_dict):
        """ Return an object dict with relationship ids replaced by models."""
        object_dict = super(
            Draft,
            class_)._replace_resource_ids_with_models(object_dict)

        # essay
        essay_id = object_dict.get("essay", None)
        essay_obj = None
        if essay_id:
            essay_obj = essay.Essay.query.get(essay_id)

        object_dict["essay"] = essay_obj

        return object_dict
