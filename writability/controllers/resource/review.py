"""
controllers.resource.draft
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Draft.

"""
from flask.ext.restful import fields

from models.review import Review

from .base import StatefulResourceManager, ItemResource, ListResource
from .fields import ResourceField
import draft, user


class ReviewResourceManager(StatefulResourceManager):

    item_resource_name = "review"
    list_resource_name = "reviews"
    model_class = Review

    def _add_item_fields(self):
        super(ReviewResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "text": fields.String,
            "is_draft_approved": fields.Boolean,
            "due_date": fields.String,
            "review_type": fields.String,
            "draft": ResourceField(
                draft.DraftResourceManager.item_resource_name,
                absolute=True),
            "teacher": ResourceField(
                user.TeacherResourceManager.item_resource_name,
                absolute=True)
        })

class ReviewResource(ItemResource):

    resource_manager_class = ReviewResourceManager


class ReviewListResource(ListResource):

    resource_manager_class = ReviewResourceManager
