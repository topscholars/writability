"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
import review, essay
from .db import db
from .base import StatefulModel
from .essay import EssayStateAssociations


class Draft(StatefulModel):

    _STATES = ["new", "in_progress", "submitted", "reviewed"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)

    # optional fields
    plain_text = db.Column(db.String)
    formatted_text = db.Column(db.String)
    word_count = db.Column(db.Integer)
    due_date = db.Column(db.Date)

    # relationships
    essay_id = db.Column(db.Integer, db.ForeignKey("essay.id"))

    #non_tag master 
    review = db.relationship("Review", backref="draft", uselist=False)

    @property
    def is_final_draft(self):
        this_essay = essay.Essay.read(self.essay_id)
        return len(this_essay.drafts) >= this_essay.num_of_drafts
    
    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(Draft, self).process_before_create()
        if not self.due_date:
            self.due_date = essay.Essay.read(self.essay_id).due_date

    def change_related_objects(self):
        """Change any related objects before commit."""
        super(Draft, self).change_related_objects()

        if self.state == "in_progress" and self.review is None:
            this_essay = essay.Essay.read(self.essay_id)
            ann_list = []
            prev_review = None
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
                "text": prev_review.text if prev_review else '',
                "review_type": "TEXT_REVIEW",
                "annotations": ann_list
            }

            self.review = review.Review(**new_review_params)  # FIXME: This is likely obsolete
        elif self.state == "reviewed" and self.is_final_draft:
            """
            When a final draft is accepted on a Theme Essay, all of the Application Essays marked "selected" for that
            Theme Essay or any of its merged_theme_essays should show up in the Essays list (have is_displayed set to
            True), and the Theme Essay should be hidden (is_displayed set to False). The most recent Draft and Review
            objects should be copied into these Application Essays the same way they are for each new Draft currently
            (including Annotations, etc). However, the old Theme Essay should NOT get these copied objects.
            """
            for esa in EssayStateAssociations.read_by_filter({'application_essay_id': self.essay_id}):
                esa.state = "selected"
                esa.application_essay.is_displayed = True
                esa.theme_essay.is_displayed = False

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
