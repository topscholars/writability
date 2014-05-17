"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
from .db import db
from .base import StatefulModel


class Draft(StatefulModel):

    _STATES = ["new", "in_progress", "submitted", "reviewed"]

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
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["in_progress"],
            "in_progress": ["submitted"],
            "submitted": ["reviewed"],
            "reviewed": []
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["new"]
