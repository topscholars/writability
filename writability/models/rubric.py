"""
models.rubric
~~~~~~~~~~~~

This module contains a Rubric that is used to grade Drafts (as part of a Review).

"""
from .db import db
from .base import BaseModel
# from sqlalchemy.orm import validates
from annotation import Tag

class Rubric(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    categories = db.relationship(
        "RubricCategory",
        backref=db.backref("rubrics", uselist=False),
        uselist=True,
        nullable=False)

    # optional fields
    name = db.Column(db.String)

    # relationships
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))

class RubricCategory(BaseModel):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    # all of this is fixed except the grade. how can we store the grade?
    grade = db.Column(db.Integer)
    criteria = db.relationship(
        "Criterion",
        backref=db.backref("rubriccategory", uselist=False),
        uselist=True,
        nullable=False)

    help_text = db.Column(db.String)

class Criterion(Tag):
    pass
    # rubriccategory: don't explicitly declare it but it's here

    def change_related_objects(self):
        super(Criterion, self).change_related_objects()
        if not RubricCategory.read_by_filter({'name':self.name}):
            new_rc_params = {
                "name": self.name
            }
            new_rc = RubricCategory(**new_rc_params)
        self.rubriccategory = RubricCategory.read_by_filter({'name':self.name})[0]