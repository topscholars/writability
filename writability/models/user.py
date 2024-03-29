"""
models.user
~~~~~~~~~~~

This module contains an abstract User and its subclasses, Student and Teacher.
For now, each User can't be both.

"""
from sqlalchemy.schema import UniqueConstraint
from flask.ext.security import UserMixin

from .db import db
from .base import BaseModel, StatefulModel
from .relationships import role_user_associations
from .relationships import student_university_associations
from sqlalchemy.orm import backref

class User(StatefulModel, UserMixin):

    __table_args__ = (
        # Because the email property is an index, unique must be defined
        # separately.
        UniqueConstraint("email"),
        {}
    )

    _STATES = ["unconfirmed", "confirmed", "active", "inactive"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, index=True)
    password = db.Column(db.String, nullable=False)

    # optional fields
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
    # students: self-referential is declared below (teacher, teacher_id)
    invitations = db.relationship(
        "Invitation",
        backref="teacher")
    reviews = db.relationship("Review", backref="teacher")
    # student relationships
    teacher = db.relationship(
        "User",
        backref=backref("students", uselist=True),
        uselist=False,
        remote_side="User.id")
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    essays = db.relationship("Essay", backref="student")
    

    universities = db.relationship(
        "University",
        secondary=student_university_associations,
        backref=db.backref("students", lazy="dynamic"))

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "unconfirmed": ["confirmed", "active"],
            "confirmed": ["active", "inactive"],
            "active": ["inactive"],
            "inactive": ["active"]
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "unconfirmed"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["unconfirmed", "confirmed"]

    @property
    def teacher_essays(self):
        """Return list of a teacher's students' essays."""
        # assumes self.students=[] if user is Student
        essays_arr = []
        for s in self.students:
            for essay in s.essays:
                if essay.isTheme():
                    essays_arr.append(essay)
        #import pdb; pdb.set_trace();
        return essays_arr

    @property
    def theme_essays(self):
        """Return list of theme essays."""
        theme_essays = []
        for essay in self.essays:
            if essay.isTheme():
                theme_essays.append(essay)
        return theme_essays

    @property
    def application_essays(self):
        """Return list of application essays."""
        application_essays = []
        for essay in self.essays:
            if essay.isApplication():
                application_essays.append(essay)
        return application_essays



class Invitation(BaseModel):

    __table_args__ = (
        # Because the email property is an index, unique must be defined
        # separately.
        UniqueConstraint("email"),
        {}
    )

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, index=True)
    is_registered = db.Column(db.Boolean, nullable=False, default=False)

    # optional fields

    # relationships
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"))

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(Invitation, self).process_before_create()
        try:
            existing_user = User.read_by_filter({'email':self.email})[0]
        except:
            existing_user = None
        if existing_user and not existing_user.teacher_id:
            existing_user.teacher_id = self.teacher.id
            self.is_registered = True