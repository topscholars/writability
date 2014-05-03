"""
controllers.resource.theme
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Theme.

"""
from flask.ext.restful import fields

from models.theme import Theme

from .base import ResourceManager, ItemResource, ListResource


class ThemeResourceManager(ResourceManager):

    item_endpoint = "theme"
    list_endpoint = "themes"
    model_class = Theme

    def _add_item_fields(self):
        super(ThemeResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "category": fields.String
        })


class ThemeResource(ItemResource):

    resource_manager_class = ThemeResourceManager


class ThemeListResource(ListResource):

    resource_manager_class = ThemeResourceManager
