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

            self.review = review.Review(**new_review_params)  ####********* This is likely obsolete.  ****#######

            db.session.commit()

            #rubric_category_list = []
            #rubric_category_list.append( RubricCategory.read_by_filter({'name':'Content'}) )
            try:
                rubr_cat_content = RubricCategory.read_by_filter({'name':'Content'})[0]
                rubr_cat_impact = RubricCategory.read_by_filter({'name':'Impact'})[0]
                rubr_cat_quality = RubricCategory.read_by_filter({'name':'Quality'})[0]
            except:
                raise ValueError('RubricCategory items are not defined!')

            new_rubric_params = {
                "name": None,
                "review_id": self.review.id
            }

            rubric = Rubric(**new_rubric_params)
            db.session.add(rubric)
            self.review.rubric = rubric

            if len(this_essay.drafts) < 2: # If first draft, create new rubric categories
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_content.id, 'grade':0}) )
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_impact.id, 'grade':0}) )
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_quality.id, 'grade':0}) )
            else: # If not first draft, copy old rubric_category assocation grades
                
                # For first-time on existing reviews, create rubric_categories
                if not prev_review.rubric:
                    prev_review.rubric = Rubric(**new_rubric_params)
                    if not prev_review.rubric._rubric_categories:
                        prev_review.rubric._rubric_categories.append(**{'name':'Content'} )
                        prev_review.rubric._rubric_categories.append(**{'name':'Impact'} )
                        prev_review.rubric._rubric_categories.append(**{'name':'Quality'} )


                rub_cats = prev_review.rubric._rubric_categories
                content_grade = rub_cats.read_by_filter({'name':'Content'})[0].grade
                impact_grade  = rub_cats.read_by_filter({'name':'Impact'})[0].grade
                quality_grade = rub_cats.read_by_filter({'name':'Quality'})[0].grade
                # Create new rubric Categories with grades from prior review/rubric
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_content.id, 'grade':content_grade}) )
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_impact.id, 'grade':impact_grade}) )
                rubric._rubric_categories.append( RubricCategoryRubricAssociations(**{'rubric_category_id':rubr_cat_quality.id, 'grade':quality_grade}) )
            
            db.session.commit()
            #rubric.RubricCategoryRubricAssociations.append(rubric.RubricCategoryRubricAssociations)
 
           # Create rubric + rubric_category joins with Grade Data

            # Create rubric here
            # Include copying grade to new join table objects

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
