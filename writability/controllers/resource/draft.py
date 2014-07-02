"""
controllers.resource.draft
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Draft.

"""
from flask.ext.restful import fields

from models.draft import Draft

from .base import StatefulResourceManager, ItemResource, ListResource
from .fields import ResourceField
import essay, review


class DraftResourceManager(StatefulResourceManager):

    item_resource_name = "draft"
    list_resource_name = "drafts"
    model_class = Draft

    def _add_item_fields(self):
        super(DraftResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "plain_text": fields.String,
            "formatted_text": fields.String,
            "word_count": fields.Integer,
            "due_date": fields.String,
            "is_final_draft": fields.Boolean,
            "essay": ResourceField(
                essay.EssayResourceManager.item_resource_name,
                absolute=True),
            "review": ResourceField(
                review.ReviewResourceManager.item_resource_name,
                absolute=True)
        })


class DraftResource(ItemResource):

    resource_manager_class = DraftResourceManager


class DraftListResource(ListResource):

    resource_manager_class = DraftResourceManager
