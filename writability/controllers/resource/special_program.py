"""
controllers.resource.special_program
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource SpecialProgram.

"""
from flask.ext.restful import fields, marshal
from flask import request

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField
from models.user import User

from models.special_program import SpecialProgram
from university import UniversityResourceManager

class SpecialProgramResourceManager(ResourceManager):
    item_resource_name = "special_program"
    list_resource_name = "special_programs"
    model_class = SpecialProgram

    def _add_item_fields(self):
        from .essay_template import ApplicationEssayTemplateResourceManager

        super(SpecialProgramResourceManager, self)._add_item_fields()

        self._item_fields.update({
            "name": fields.String,
            "description": fields.String,
            "application_essay_templates": ResourceField(
                ApplicationEssayTemplateResourceManager.item_resource_name,
                absolute=True),
            "university": ResourceField(
                UniversityResourceManager.item_resource_name,
                absolute=True),
        })


class SpecialProgramListResource(ListResource):
    resource_manager_class = SpecialProgramResourceManager


class SpecialProgramResource(ItemResource):
    resource_manager_class = SpecialProgramResourceManager


class SpecialProgramSetResource(ListResource):
    from .essay import ApplicationEssayResourceManager

    resource_manager_class = ApplicationEssayResourceManager

    def get(self, student_id, sp_id):
        abort(400, message="Bad Request")

    def delete(self, student_id, sp_id):
        abort(400, message="Bad Request")

    def put(self, student_id, sp_id):
        resource_name = self.resource_manager.list_resource_name
        model_class = self.resource_manager.model_class
        list_field = self.resource_manager.list_field

        essay_templates = SpecialProgram.read(sp_id).application_essay_templates
        app_essays = [e for e in User.read(student_id).essays if e.isApplication() 
                        and e.essay_template in essay_templates]
        checked = self._get_payload()

        essays_to_update = [e for e in app_essays if e.essay_template.requirement_type == 'Required']

        if app_essays:
            for essay in essays_to_update:
                # If checked, set all Required essays_to_update. If not checked, unset all essays_to_update.
                if checked and essay.essay_template.requirement_type != 'Required':
                    continue
                item = {resource_name: model_class.update(essay.id,{'onboarding_is_selected': checked})}
            return marshal({resource_name: app_essays}, list_field)
        else:
            raise InvalidUsage('Did you pass the correct IDs in the URL?')

    def _get_payload(self):
        """
        Get the JSON body of the request.
        Should be in the form
        {
            "checked": <boolean>
        }

        """
        json = request.get_json()
        try:
            checked = json["checked"]
        except (KeyError, IndexError) as e:  # FIXME: too broad exception
            raise InvalidUsage('Did you pass a special program, student, and checked in the request?')
        return checked