"""
controllers.resource.role
~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Role.

"""
from flask.ext.restful import fields

from models.role import Role

from .base import ResourceManager, ItemResource, ListResource


class RoleResourceManager(ResourceManager):

    item_resource_name = "role"
    list_resource_name = "roles"
    model_class = Role

    def _add_item_fields(self):
        super(RoleResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "description": fields.String
        })


class RoleResource(ItemResource):

    resource_manager_class = RoleResourceManager


class RoleListResource(ListResource):

    resource_manager_class = RoleResourceManager
