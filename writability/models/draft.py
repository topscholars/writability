"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
from .db import db
from .base import BaseModel


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
