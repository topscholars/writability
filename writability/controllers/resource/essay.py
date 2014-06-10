"""
controllers.resource.essay
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Essay, ThemeEssay, and ApplicationEssay.

"""
from flask import request
from flask.ext.restful import Resource, fields
from flask.ext.restful import marshal

from models.essay import Essay, ThemeEssay, ApplicationEssay

from .base import ResourceManager, ItemResource, ListResource
from .base import StatefulResourceManager, InvalidUsage
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
            "draft_due_date": fields.String,
            "next_action": fields.String,
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
            "theme": ResourceField(
                theme.ThemeResourceManager.item_resource_name,
                absolute=True),
            "application_essay_states": fields.String
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
            "theme_essays": fields.List(ResourceField(
                ThemeEssayResourceManager.item_resource_name,
                absolute=True))
            # 'proposed_topics': fields.List(fields.String)
        })


class ApplicationEssayResource(EssayResource):

    resource_manager_class = ApplicationEssayResourceManager


class ApplicationEssayListResource(EssayListResource):

    resource_manager_class = ApplicationEssayResourceManager


class ApplicationEssayStateResource(ThemeEssayResource):
    """
    This resource allows direct updates of the Application Essay states upon clicking
    them in the Essays view. 
    """
    def get(self, themeessay_id, appessay_id):
        # what's the correct way to 404 this?
        raise NotImplementedError()
        return None

    def delete(self, themeessay_id, appessay_id):
        # what's the correct way to 404 this?
        raise NotImplementedError()
        return None

    def put(self, themeessay_id, appessay_id):
        resource_name = self.resource_manager.item_resource_name
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        payload = self._get_payload(appessay_id)
        # print resource_name, id   # TODO KIRK DELETE THESE
        # print payload

        app_essay_states = model_class.read(themeessay_id).application_essay_states

        if appessay_id in app_essay_states:
            # Should return a single state. Validated by the model class.
            app_essay_states[appessay_id] = payload
            item = {resource_name: model_class.update(themeessay_id, { 'application_essay_states' : app_essay_states })}            
            return marshal(item, item_field)
        else:
            raise InvalidUsage('Did you pass the correct application essay ID in the URL?')

    def _get_payload(self, appessay_id):
        """
        Get the JSON body of the request.
        Should be in the form { "appessay_id" : "NEW_STATE" }

        """        
        json = request.get_json()
        try:            
            payload = json[str(appessay_id)]
        except:
            raise InvalidUsage('Did you pass the correct application essay ID in the request body?')
        return payload