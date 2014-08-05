"""
models.review
~~~~~~~~~~~~

This module contains a Review of a Draft. Drafts are Reviewed by a Teacher.

"""
import datetime
from .db import db
from .base import StatefulModel
from sqlalchemy.orm import validates
import draft, essay

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
    rubric = db.relationship("Rubric", backref="review",uselist=False)

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(Review, self).process_before_create()
        if not self.due_date:
            self.due_date = draft.Draft.read(self.draft_id).due_date + datetime.timedelta(days=3)

    @validates('review_type')
    def validate_review_type(self, key, review_type):
        """Assert that review_type is valid."""
        assert review_type in self._TYPE_CHOICES
        return review_type

    def change_related_objects(self):
        # Create new rubric object and associate it with this review
        # This creates a draft, then draft creats a new review and its associated rubric
        super(Review, self).change_related_objects()

        if self.state == "completed":
            this_essay = essay.Essay.read(self.draft.essay_id)
            this_draft = draft.Draft.read(self.draft_id)
            # add a new draft to this essay
            new_draft_params = {
                "essay": this_essay,
                "plain_text" : this_draft.plain_text,
                "formatted_text" : this_draft.formatted_text,
                "word_count" : this_draft.word_count,
                "is_final_draft": True if this_essay.existing_drafts == this_essay.num_of_drafts - 1 else False
            }
            new_draft = draft.Draft(**new_draft_params)

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["completed"],
            "completed": []
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["new"]
