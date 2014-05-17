"""
controllers.resource.essay
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Essay, ThemeEssay, and ApplicationEssay.

"""
from flask.ext.restful import fields

from models.essay import Essay, ThemeEssay, ApplicationEssay

from .base import ResourceManager, ItemResource, ListResource
from .base import StatefulResourceManager
from .fields import ResourceField
import draft
import theme
import user
import essay_template


class EssayResourceManager(ResourceManager):

    item_resource_name = "essay"
    list_resource_name = "essays"
    model_class = Essay

    def _add_item_fields(self):
        super(EssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "essay_prompt": fields.String,
            "audience": fields.String,
            "context": fields.String,
            "topic": fields.String,
            "max_words": fields.Integer,
            "num_of_drafts": fields.Integer,
            "due_date": fields.String,
            "theme": ResourceField(
                theme.ThemeResourceManager.item_resource_name,
                absolute=True),
            "drafts": fields.List(ResourceField(
                draft.DraftResourceManager.item_resource_name,
                absolute=True)),
            "student": ResourceField(
                user.StudentResourceManager.item_resource_name,
                absolute=True),
            "essay_template": ResourceField(
                essay_template.EssayTemplateResourceManager.item_resource_name,
                absolute=True)
        })


class EssayResource(ItemResource):

    resource_manager_class = EssayResourceManager


class EssayListResource(ListResource):

    resource_manager_class = EssayResourceManager


class ThemeEssayResourceManager(StatefulResourceManager, EssayResourceManager):

    item_resource_name = "theme_essay"
    list_resource_name = "theme_essays"
    model_class = ThemeEssay

    def _add_item_fields(self):
        super(ThemeEssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "proposed_topics": fields.List(fields.String),
            "application_essays": fields.List(ResourceField(
                ApplicationEssayResourceManager.item_resource_name,
                absolute=True))
        })


class ThemeEssayResource(EssayResource):

    resource_manager_class = ThemeEssayResourceManager


class ThemeEssayListResource(EssayListResource):

    resource_manager_class = ThemeEssayResourceManager


class ApplicationEssayResourceManager(EssayResourceManager):

    item_resource_name = "application_essay"
    list_resource_name = "application_essays"
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
