"""
controllers.resource.draft
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Draft.

"""
from flask.ext.restful import fields, types

from models.draft import Draft

from .base import ResourceManager, ItemResource, ListResource
from .types import resource
from .fields import ResourceField
import essay


class DraftResourceManager(ResourceManager):

    item_endpoint = "draft"
    list_endpoint = "drafts"
    model_class = Draft

    def _add_parse_arguments(self):
        self.parser.add_argument("plain_text", type=str)
        self.parser.add_argument("formatted_text", type=str)
        self.parser.add_argument("word_count", type=int)
        self.parser.add_argument("due_date", type=types.date)
        self.parser.add_argument("is_final_draft", type=bool)
        self.parser.add_argument(
            "essay",
            type=resource)

    def _add_item_fields(self):
        super(DraftResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "plan_text": fields.String,
            "formatted_text": fields.String,
            "word_count": fields.Integer,
            "due_date": fields.String,
            "is_final_draft": fields.Boolean,
            "essay": ResourceField(
                essay.EssayResourceManager.item_endpoint,
                absolute=True)
        })


class DraftResource(ItemResource):

    resource_manager_class = DraftResourceManager


class DraftListResource(ListResource):

    resource_manager_class = DraftResourceManager
