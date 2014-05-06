"""
models.role
~~~~~~~~~~~

This module contains all the user's Roles, including Student and Teacher.

"""
from flask.ext.security import RoleMixin

from .db import db
from .base import BaseModel


class Role(BaseModel, RoleMixin):

    # required fields
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String())

    # optional fields

    # inheritance

    # relationships
    # users: don't explicitly declare but it's here.
