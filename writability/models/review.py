"""
models.review
~~~~~~~~~~~~

This module contains a Review of a Draft. Drafts are Reviewed by a Teacher.

"""
from .db import db
from .base import StatefulModel
from sqlalchemy.orm import validates

class Review(StatefulModel):
    """
       due_date: date the review is due from the teacher.
    """

    _STATES = ["new", "in_progress", "completed"]
    _TYPE_CHOICES = ["BOOLEAN_REVIEW", "TEXT_REVIEW"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    draft_id = db.Column(db.Integer, db.ForeignKey("draft.id"))

    # optional fields
    text = db.Column(db.String)
    is_draft_approved = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.Date)
    review_type = db.Column(db.String)

    # relationships
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    annotations = db.relationship("Annotation", backref="review")

    @validates('review_type')
    def validate_review_type(self, key, review_type):
        """Assert that review_type is valid."""
        assert review_type in self._TYPE_CHOICES
        return review_type

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["in_progress"],
            "in_progress": ["completed"],
            "completed": []
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["new"]
