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


class SpecialProgramListResource(ListResource):

    resource_manager_class = SpecialProgramResourceManager
