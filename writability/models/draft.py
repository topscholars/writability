"""
models.draft
~~~~~~~~~~~~

This module contains a Draft of an Essay. Essays have a series of Drafts that
the Student writes.

"""
import review, essay
from .db import db
from .base import StatefulModel
from rubric import Rubric, RubricCategory, RubricCategoryRubricAssociations
from sqlalchemy.orm import validates

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

    @validates('essay')
    def validate_essay(self, key, essay):
        assert essay
        return essay

    @property
    def is_final_draft(self):
        this_essay = essay.Essay.read(self.essay_id)
        return len(this_essay.drafts) >= this_essay.num_of_drafts
    
    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(Draft, self).process_before_create()
        if not self.due_date:
            self.due_date = essay.Essay.read(self.essay_id).due_date

    @property
    def essay_type(self):
        return "application" if self.essay.isApplication() else "theme" if self.essay.isTheme() else "ERROR"

    def change_related_objects(self):
        """Change any related objects before commit."""
        from .essay import EssayStateAssociations

        super(Draft, self).change_related_objects()

        if self.state == "in_progress" and self.review is None:
            this_essay = essay.Essay.read(self.essay_id)
            ann_list = []
            prev_review = None
            new_rubric = None
            if len(this_essay.drafts) > 1:
                prev_draft = Draft.read(max([d.id for d in this_essay.drafts if d.id != self.id]))
                prev_review = prev_draft.review
                ann_list = [a.create_copy() for a in prev_review.annotations if a.state != "approved"]
                # new_rubric = prev_review.rubric.create_copy()

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

            self.review = review.Review(**new_review_params)

            db.session.commit()

            new_rubric_params = {
                "name": None,
                "review_id": self.review.id
            }

            if len(this_essay.drafts) < 2: # If first draft, create new rubric categories
                new_rubric_params["add_default_rc"] = True
                new_rubric = Rubric(**new_rubric_params)
            else: # If not first draft, copy old rubric_category assocation grades
                # For first-time with previous existing reviews (w/ no rubric), create Rubric & rubric_categories
                if not prev_review.rubric:
                    prev_rubric_params = {
                        "name": None,
                        "review_id": prev_review.id,
                        "add_default_rc": True
                    }
                    prev_review.rubric = Rubric(**prev_rubric_params)

                new_rubric = prev_review.rubric.create_copy(new_review_id=self.review.id)

            db.session.add(new_rubric)
            self.review.rubric = new_rubric

        # elif self.state == "reviewed" and self.is_final_draft and self.isTheme():
        #     """
        #     When a final draft is accepted on a Theme Essay, all of the Application Essays marked "selected" for that
        #     Theme Essay or any of its merged_theme_essays should show up in the Essays list (have is_displayed set to
        #     True), and the Theme Essay should be hidden (is_displayed set to False). The most recent Draft and Review
        #     objects should be copied into these Application Essays the same way they are for each new Draft currently
        #     (including Annotations, etc). However, the old Theme Essay should NOT get these copied objects.
        #     """
        #     this_essay = essay.Essay.read(self.essay_id)
        #     for te in [this_essay].extend(this_essay.merged_theme_essays):
        #         for esa in EssayStateAssociations.read_by_filter({'state':'selected','theme_essay_id':te.id}):
        #             new_draft_params = {
        #                 "essay": esa.application_essay,
        #                 "plain_text" : self.plain_text,
        #                 "formatted_text" : self.formatted_text,
        #                 "word_count" : self.word_count,
        #             }
        #             new_draft = Draft(**new_draft_params)
        #             db.session.commit()

        #             ann_list = [a.create_copy() for a in self.review.annotations if a.state != "approved"]
        #             new_review_params = {
        #                 "teacher": self.essay.student.teacher,
        #                 "draft": new_draft,
        #                 "text": self.review.text,
        #                 "review_type": "TEXT_REVIEW",
        #                 "annotations": ann_list
        #             }

        #             new_draft.review = review.Review(**new_review_params)
        #             db.session.add(new_draft.review)
        #             # Commit here so that the review gets an ID
        #             db.session.commit()

        #             new_rubric_params = {
        #                 "name": None,
        #                 "review_id": new_draft.review.id
        #             }

        #             new_rubric = self.review.rubric.create_copy(new_review_id=new_draft.review.id)
        #             new_draft.review.rubric = new_rubric
        #             db.session.add(new_rubric)

        #             esa.application_essay.is_displayed = True
        #             esa.theme_essay.is_displayed = False
    
        #     db.session.commit()

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
