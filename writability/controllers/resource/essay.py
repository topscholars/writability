"""
controllers.resource.essay
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Essay, ThemeEssay, and ApplicationEssay.

"""
from flask.ext.restful import fields, types

from models.essay import Essay, ThemeEssay, ApplicationEssay

from .base import ResourceManager, ItemResource, ListResource
from .types import resource_list, unicode_list
from .fields import ResourceField


class EssayResourceManager(ResourceManager):

    item_endpoint = "essay"
    list_endpoint = "essays"
    model_class = Essay

    def _add_parse_arguments(self):
        self.parser.add_argument('essay_prompt', required=True, type=str)
        self.parser.add_argument('audience', type=str)
        self.parser.add_argument('context', type=str)
        self.parser.add_argument('topic', type=str)
        self.parser.add_argument('word_count', type=int)
        self.parser.add_argument('num_of_drafts', type=int)
        self.parser.add_argument('due_date', type=types.date)

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
        })


class EssayResource(ItemResource):

    resource_manager_class = EssayResourceManager


class EssayListResource(ListResource):

    resource_manager_class = EssayResourceManager


class ThemeEssayResourceManager(EssayResourceManager):

    item_endpoint = "theme-essay"
    list_endpoint = "theme-essays"
    model_class = ThemeEssay

    def _add_parse_arguments(self):
        super(ThemeEssayResourceManager, self)._add_parse_arguments()
        self.parser.add_argument(
            "proposed_topics",
            type=unicode_list)
        self.parser.add_argument(
            "application_essays",
            type=resource_list)

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

    def _add_parse_arguments(self):
        super(ApplicationEssayResourceManager, self)._add_parse_arguments()
        # self.parser.add_argument('proposed_topics', type=list)

    def _add_item_fields(self):
        super(ApplicationEssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            # 'proposed_topics': fields.List(fields.String)
        })


class ApplicationEssayResource(EssayResource):

    resource_manager_class = ApplicationEssayResourceManager


class ApplicationEssayListResource(EssayListResource):

    resource_manager_class = ApplicationEssayResourceManager
