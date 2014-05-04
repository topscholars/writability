"""
models.theme
~~~~~~~~~~~~

This module contains a Theme. These themese determine the essay prompts.

"""
from sqlalchemy.schema import UniqueConstraint

from .db import db
from .base import BaseModel


class Theme(BaseModel):

    __table_args__ = (
        UniqueConstraint('name', 'category', name='themecategory'),
        {}
    )

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    # optional fields
    # inheritance
    # relationships
