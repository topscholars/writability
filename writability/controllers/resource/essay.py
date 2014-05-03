"""
controllers.resource.essay
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Essay, ThemeEssay, and ApplicationEssay.

"""
from flask.ext.restful import fields

from models.essay import Essay, ThemeEssay, ApplicationEssay

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField
import draft


class EssayResourceManager(ResourceManager):

    item_endpoint = "essay"
    list_endpoint = "essays"
    model_class = Essay

    def _add_item_fields(self):
        super(EssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "essay_prompt": fields.String,
            "audience": fields.String,
            "context": fields.String,
            "topic": fields.String,
            "word_count": fields.Integer,
            "num_of_drafts": fields.Integer,
            "due_date": fields.String,
            "drafts": fields.List(ResourceField(
                draft.DraftResourceManager.item_endpoint,
                absolute=True))
        })


class EssayResource(ItemResource):

    resource_manager_class = EssayResourceManager


class EssayListResource(ListResource):

    resource_manager_class = EssayResourceManager


class ThemeEssayResourceManager(EssayResourceManager):

    item_endpoint = "theme-essay"
    list_endpoint = "theme-essays"
    model_class = ThemeEssay

    def _add_item_fields(self):
        super(ThemeEssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "proposed_topics": fields.List(fields.String),
            "application_essays": fields.List(ResourceField(
                ApplicationEssayResourceManager.item_endpoint,
                absolute=True))
        })


class ThemeEssayResource(EssayResource):

    resource_manager_class = ThemeEssayResourceManager


class ThemeEssayListResource(EssayListResource):

    resource_manager_class = ThemeEssayResourceManager


class ApplicationEssayResourceManager(EssayResourceManager):

    item_endpoint = "application-essay"
    list_endpoint = "application-essays"
    model_class = ApplicationEssay

    def _add_item_fields(self):
        super(ApplicationEssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            # 'proposed_topics': fields.List(fields.String)
        })


class ApplicationEssayResource(EssayResource):

    resource_manager_class = ApplicationEssayResourceManager


class ApplicationEssayListResource(EssayListResource):

    resource_manager_class = ApplicationEssayResourceManager
