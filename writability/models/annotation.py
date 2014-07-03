"""
models.annotation
~~~~~~~~~~~~

This module contains Annotations, which are inline comments created by a Teacher.
Each Annotation has a Tag associated with it that contains general info about that
Annotation.

Annotations belong to Reviews.

"""
from .db import db
from .base import BaseModel, StatefulModel
from sqlalchemy.orm import validates

class Annotation(StatefulModel):

    _STATES = ["new", "resolved", "approved"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)

    # optional fields
    comment = db.Column(db.String)
    original = db.Column(db.String)
    start_index = db.Column(db.Integer)
    end_index = db.Column(db.Integer)

    # relationships
    tag_id = db.Column(db.Integer, db.ForeignKey("tag.id"))
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"))

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["resolved"],
            "resolved": ["approved"],
            "approved": []
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["new","resolved"]

    def create_copy(self):
        """Creates a new annotation as a copy of self."""
        params = {
                "comment": self.comment,
                "original": self.original,
                "start_index": self.start_index,
                "end_index": self.end_index,
                "state": self.state,
                "tag_id": self.tag_id,
                }
        new_anno = Annotation(**params)
        return new_anno

class Tag(BaseModel):

    _TYPE_CHOICES = ["POSITIVE", "NEGATIVE", "NEUTRAL"]

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    tag_type = db.Column(db.String, nullable=False, default="NEUTRAL")
    category = db.Column(db.String, nullable=False)

    # optional fields
    description = db.Column(db.String)
    example = db.Column(db.String)

    # relationships
    # Do we want to preserve this relationship or just carry the info over?
    annotations = db.relationship("Annotation", backref="tag")

    @validates('tag_type')
    def validate_tag_type(self, key, tag_type):
        """Assert that review_type is valid."""
        assert tag_type in self._TYPE_CHOICES
        return tag_type