"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
import review, essay
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

    #non_tag master 
    review = db.relationship("Review", backref="draft", uselist=False)
    
    def change_related_objects(self):
        """Change any related objects before commit."""
        super(Draft, self).change_related_objects()

        if self.state == "in_progress" and self.review is None:
            this_essay = essay.Essay.read(self.essay_id)
            ann_list = []
            if len(this_essay.drafts) > 1:
                prev_draft = Draft.read(max([d.id for d in this_essay.drafts if d.id != self.id]))
                prev_review = prev_draft.review
                ann_list = [a.create_copy() for a in prev_review.annotations if a.state != "approved"]

            # first check if there was a previous draft and, if so, copy over 
            # annotations that are not marked "complete" by the teacher

            # if there were no previous drafts, create a new empty review

            new_review_params = {
                "teacher": self.essay.student.teacher,
                "draft": self,
                "review_type": "TEXT_REVIEW",
                "annotations": ann_list
            }

            self.review = review.Review(**new_review_params)  ####********* This is likely obsolete.  ****#######

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
