"""
controllers.resource.university
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource University.

"""
from flask.ext.restful import fields

from models.university import University

from .base import ResourceManager, ItemResource, ListResource


class UniversityResourceManager(ResourceManager):

    item_endpoint = "university"
    list_endpoint = "universities"
    model_class = University

    def _add_item_fields(self):
        super(UniversityResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "logo_url": fields.String
        })


class UniversityResource(ItemResource):

    resource_manager_class = UniversityResourceManager


class UniversityListResource(ListResource):

    resource_manager_class = UniversityResourceManager
