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

        this_draft = self.draft

        if self.state == "completed" and not this_draft.is_final_draft:
            this_essay = essay.Essay.read(self.draft.essay_id)
            this_draft = draft.Draft.read(self.draft_id)
            # add a new draft to this essay
            new_draft_params = {
                "essay": this_essay,
                "plain_text" : this_draft.plain_text,
                "formatted_text" : this_draft.formatted_text,
                "word_count" : this_draft.word_count
            }
            new_draft = draft.Draft(**new_draft_params)

        elif self.state == "completed" and this_draft.is_final_draft and this_draft.essay.isTheme():

            """
            When a final draft is accepted on a Theme Essay, all of the Application Essays marked "selected" for that
            Theme Essay or any of its merged_theme_essays should show up in the Essays list (have is_displayed set to
            True), and the Theme Essay should be hidden (is_displayed set to False). The most recent Draft and Review
            objects should be copied into these Application Essays the same way they are for each new Draft currently
            (including Annotations, etc). However, the old Theme Essay should NOT get these copied objects.
            """
            this_essay = this_draft.essay
            te_list = [this_essay]
            te_list.extend(this_essay.merged_theme_essays)
            for te in te_list:
                for esa in [e for e in te.essay_associations if e.state=="selected"]:
                    new_draft_params = {
                        "essay": esa.application_essay,
                        "plain_text" : this_draft.plain_text,
                        "formatted_text" : this_draft.formatted_text,
                        "word_count" : this_draft.word_count,
                    }
                    new_draft = draft.Draft(**new_draft_params)
                    db.session.commit()

                    ann_list = [a.create_copy() for a in self.annotations if a.state != "approved"]
                    new_review_params = {
                        "teacher": this_essay.student.teacher,
                        "draft": new_draft,
                        "text": self.text,
                        "review_type": "TEXT_REVIEW",
                        "annotations": ann_list
                    }

                    new_draft.review = Review(**new_review_params)
                    db.session.add(new_draft.review)
                    # Commit here so that the review gets an ID
                    db.session.commit()

                    new_rubric_params = {
                        "name": None,
                        "review_id": new_draft.review.id
                    }

                    new_rubric = self.rubric.create_copy(new_review_id=new_draft.review.id)
                    new_draft.review.rubric = new_rubric
                    db.session.add(new_rubric)

                    esa.application_essay.is_displayed = True
                    esa.theme_essay.is_displayed = False
    
            db.session.commit()

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
