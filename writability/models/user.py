"""
models.user
~~~~~~~~~~~

This module contains an abstract User and its subclasses, Student and Teacher.
For now, each User can't be both.

"""
from .db import db
from .base import StatefulModel
from .relationships import student_university_associations


class User(StatefulModel):

    _STATES = ["new", "verified", "active", "inactive"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, index=True)
    password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)

    # optional fields

    # inheritance
    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}

    # relationships

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["verified"],
            "verified": ["active, inactive"],
            "active": ["inactive"],
            "inactive": ["active"]
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"


class Teacher(User):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'teacher'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    # optional fields

    # relationships
    # foreign_keys arg required because foreign key already set for table
    students = db.relationship("Student", backref="teacher", foreign_keys=id)


class Student(User):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'student'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)

    # optional fields

    # relationships
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher.id"))
    essays = db.relationship("Essay", backref="student")
    universities = db.relationship(
        "University",
        secondary=student_university_associations,
        backref=db.backref("students", lazy="dynamic"))
