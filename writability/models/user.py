"""
models.user
~~~~~~~~~~~

This module contains an abstract User and its subclasses, Student and Teacher.
For now, each User can't be both.

"""
from sqlalchemy.schema import UniqueConstraint
from flask.ext.security import UserMixin

from .db import db
from .base import StatefulModel
from .relationships import role_user_associations
from .relationships import student_university_associations


class User(StatefulModel, UserMixin):

    __table_args__ = (
        # Because the email property is an index, unique must be defined
        # separately.
        UniqueConstraint("email"),
        {}
    )

    _STATES = ["invited", "unconfirmed", "confirmed", "active", "inactive"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, index=True)

    # optional fields
    password = db.Column(db.String)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    active = db.Column(db.Boolean)
    confirmed_at = db.Column(db.DateTime())

    # relationships
    roles = db.relationship(
        "Role",
        secondary=role_user_associations,
        backref=db.backref("users", lazy="dynamic"))
    # teacher relationships
    students = db.relationship(
        "User",
        backref="teacher",
        remote_side="User.id")
    # student relationships
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    essays = db.relationship("Essay", backref="student")
    universities = db.relationship(
        "University",
        secondary=student_university_associations,
        backref=db.backref("students", lazy="dynamic"))

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "invited": ["unconfirmed, confirmed"],
            "unconfirmed": ["confirmed"],
            "confirmed": ["active, inactive"],
            "active": ["inactive"],
            "inactive": ["active"]
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "unconfirmed"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["invited", "unconfirmed"]
