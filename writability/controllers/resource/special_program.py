"""
controllers.resource.special_program
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource SpecialProgram.

"""
from flask.ext.restful import fields

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField

from models.special_program import SpecialProgram


class SpecialProgramResourceManager(ResourceManager):
    item_resource_name = "special_program"
    list_resource_name = "special_programs"
    model_class = SpecialProgram

    def _add_item_fields(self):
        from .essay_template import ApplicationEssayTemplateResourceManager

        super(SpecialProgramResourceManager, self)._add_item_fields()

        self._item_fields.update({
            "name": fields.String,
            "created_ts": fields.String,
            "updated_ts": fields.String,
            "application_essay_templates": ResourceField(
                ApplicationEssayTemplateResourceManager.item_resource_name,
                absolute=True)
        })


class SpecialProgramListResource(ListResource):
    resource_manager_class = SpecialProgramResourceManager


class SpecialProgramResource(ItemResource):
    resource_manager_class = SpecialProgramResourceManager
