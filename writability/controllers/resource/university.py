"""
controllers.resource.university
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource University.

"""
from flask.ext.restful import fields

from models.university import University

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField

import essay_template


class UniversityResourceManager(ResourceManager):

    item_resource_name = "university"
    list_resource_name = "universities"
    model_class = University

    def _add_item_fields(self):
        from special_program import SpecialProgramResourceManager

        super(UniversityResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "logo_url": fields.String,
            "use_common_app": fields.Boolean,
            "special_programs": fields.List(ResourceField(
                SpecialProgramResourceManager.item_resource_name, absolute=True)
            ),
            "application_essay_templates": fields.List(ResourceField(
                essay_template.ApplicationEssayTemplateResourceManager.item_resource_name,
                absolute=True))
        })


class UniversityResource(ItemResource):

    resource_manager_class = UniversityResourceManager


class UniversityListResource(ListResource):

    resource_manager_class = UniversityResourceManager
