"""
controllers.resource.theme
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Theme.

"""
from flask.ext.restful import fields

from models.theme import Theme

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField
import essay_template


class ThemeResourceManager(ResourceManager):

    item_resource_name = "theme"
    list_resource_name = "themes"
    model_class = Theme

    def _add_item_fields(self):
        super(ThemeResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "category": fields.String,
            "theme_essay_template": ResourceField(
                essay_template.ThemeEssayTemplateResourceManager.item_resource_name,
                absolute=True),
            "application_essay_templates": fields.List(ResourceField(
                essay_template.ApplicationEssayTemplateResourceManager.item_resource_name,
                absolute=True))
        })


class ThemeResource(ItemResource):

    resource_manager_class = ThemeResourceManager


class ThemeListResource(ListResource):

    resource_manager_class = ThemeResourceManager
