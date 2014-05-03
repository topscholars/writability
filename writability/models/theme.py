"""
models.theme
~~~~~~~~~~~~

This module contains a Theme. These themese determine the essay prompts.

"""
from .db import db
from .base import BaseModel


class Theme(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    # optional fields
    # inheritance
    # relationships
