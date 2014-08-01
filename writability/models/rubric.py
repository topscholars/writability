"""
models.rubric
~~~~~~~~~~~~

This module contains a Rubric that is used to grade Drafts (as part of a Review).

"""
from sqlalchemy.orm import validates #, Column, Integer, String

from .db import db
from .base import BaseModel
# from sqlalchemy.orm import validates
from annotation import Tag
from sqlalchemy.ext.associationproxy import association_proxy

class Rubric(BaseModel):
    __tablename__ = 'rubric'
    ## Belongs to REVIEW
    ## When review is submitted, this is copied to next draft
    ## along with current review. (not done)

    ## Rubric Category - only 3 categories to start: Content/Impact/Quality
    ## Rubric Criteria are static

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    #rubric_categories = db.relationship(
    #    "RubricCategory",
    #    backref=db.backref("rubric", uselist=False),
    #    uselist=True) 


    rubric_associations = db.relationship(
        "RubricCategoryRubricAssociations",
        backref=db.backref("rubric"))

    rubric_categories = association_proxy('rubric_associations', 'rubric_category')

    # optional fields
    name = db.Column(db.String)

    # relationships
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))

class RubricCategory(BaseModel): # Impact, Content, and Quality.
    __tablename__ = 'rubric_category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    # all of this is fixed except the grade. how can we store the grade?
    # grade = db.Column(db.Integer) # Move grade to 
    criteria = db.relationship(
        "Criterion",
        backref=db.backref("rubriccategory", uselist=False),
        uselist=True)

    help_text = db.Column(db.String)

class Criterion(Tag):   # Tags that a teacher can write an annotation against, 
                        # that are also associated with a rubric category
    #__tablename__ = 'criteria'
    ##### ADD relationship to RubricCategory 
    rubric_category_id = db.Column(db.Integer, db.ForeignKey('rubric_category.id'))


    #__tablename__ = 'criteria'
    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'criteria'}
    # required fields
    id = db.Column(db.Integer, db.ForeignKey('tag.id'), primary_key=True)



    ## Creates rubric categories from criteria
    def change_related_objects(self):
        super(Criterion, self).change_related_objects()
        if not RubricCategory.read_by_filter({'name':self.name}):
            print "NOT loop"
            new_rc_params = {
                "name": self.name
            }
            new_rc = RubricCategory(**new_rc_params)
        #import pdb; pdb.set_trace()
        self.rubriccategory = RubricCategory.read_by_filter({'name':self.name})[0]

class RubricCategoryRubricAssociations(BaseModel):
    __tablename__ = 'rubric_rubric_category_associations'

    #rubric_category = db.relationship(
    #    "rubric_category",
    #    backref=db.backref("rubric_category_associations") )

    #_application_essays = db.relationship(
    #    "ApplicationEssay",
    #    secondary=essay_associations,
    #    backref=db.backref("theme_essays", lazy="dynamic"))
    
    ALLOWED_GRADES = [0,10,20,30,40,50,60,70,80,90,100]

    @validates('grade')
    def validate_grades(self, key, grade):
        """Assert that grade is rounded to 10. 0/10/20../90/100."""
        assert grade in self.ALLOWED_GRADES
        return grade

    rubric_category = db.relationship(
        "RubricCategory",
        backref=db.backref("rubric_associations"))

    rubric_id = db.Column(
        db.Integer,
        db.ForeignKey("rubric.id"),
        primary_key=True)
    rubric_category_id = db.Column(
        db.Integer,
        db.ForeignKey("rubric_category.id"),
        primary_key=True)
    grade = db.Column(db.Integer, default=0)
