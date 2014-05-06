"""
controllers.resource.essay_template
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource EssayTemplate, ThemeEssayTemplate, and
ApplicationEssayTemplate.

"""
from flask.ext.restful import fields

from models.essay_template import EssayTemplate, ThemeEssayTemplate
from models.essay_template import ApplicationEssayTemplate

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField
import theme
import university


class EssayTemplateResourceManager(ResourceManager):

    item_resource_name = "essay_template"
    list_resource_name = "essay_templates"
    model_class = EssayTemplate

    def _add_item_fields(self):
        super(EssayTemplateResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "essay_prompt": fields.String,
            "due_date": fields.String
        })


class EssayTemplateResource(ItemResource):

    resource_manager_class = EssayTemplateResourceManager


class EssayTemplateListResource(ListResource):

    resource_manager_class = EssayTemplateResourceManager


class ThemeEssayTemplateResourceManager(EssayTemplateResourceManager):

    item_resource_name = "theme_essay_template"
    list_resource_name = "theme_essay_templates"
    model_class = ThemeEssayTemplate

    def _add_item_fields(self):
        super(ThemeEssayTemplateResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "audience": fields.String,
            "context": fields.String,
            "theme": ResourceField(
                theme.ThemeResourceManager.item_resource_name,
                absolute=True)
        })


class ThemeEssayTemplateResource(EssayTemplateResource):

    resource_manager_class = ThemeEssayTemplateResourceManager


class ThemeEssayTemplateListResource(EssayTemplateListResource):

    resource_manager_class = ThemeEssayTemplateResourceManager


class ApplicationEssayTemplateResourceManager(EssayTemplateResourceManager):

    item_resource_name = "application_essay_template"
    list_resource_name = "application_essay_templates"
    model_class = ApplicationEssayTemplate

    def _add_item_fields(self):
        super(ApplicationEssayTemplateResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "word_count": fields.Integer,
            "university": ResourceField(
                university.UniversityResourceManager.item_resource_name,
                absolute=True),
            "themes": fields.List(ResourceField(
                theme.ThemeResourceManager.item_resource_name,
                absolute=True))
        })


class ApplicationEssayTemplateResource(EssayTemplateResource):

    resource_manager_class = ApplicationEssayTemplateResourceManager


class ApplicationEssayTemplateListResource(EssayTemplateListResource):

    resource_manager_class = ApplicationEssayTemplateResourceManager
