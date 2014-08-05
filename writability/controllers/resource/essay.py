"""
controllers.resource.essay
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Essay, ThemeEssay, and ApplicationEssay.

"""
from flask import request
from flask.ext.restful import abort, fields, marshal

from models.essay import Essay, ThemeEssay, ApplicationEssay, EssayStateAssociations
from .base import ResourceManager, ItemResource, ListResource
from .base import StatefulResourceManager, InvalidUsage
from .fields import ResourceField, ApplicationEssayResourceField
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
            "is_displayed": fields.Boolean,
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
            "merged_theme_essays": fields.List(ResourceField(
                ThemeEssayResourceManager.item_resource_name,
                absolute=True)),
            "application_essays": fields.List(ApplicationEssayResourceField(
                ApplicationEssayResourceManager.item_resource_name,
                absolute=True)),
            "parent_id": fields.Integer
        })


class ThemeEssayResource(EssayResource):
    resource_manager_class = ThemeEssayResourceManager


class ThemeEssayListResource(EssayListResource):
    resource_manager_class = ThemeEssayResourceManager

    def get(self):
        resource_name = self.resource_manager.list_resource_name
        model_class = self.resource_manager.model_class
        list_field = self.resource_manager.list_field

        ids = self._get_ids_from_query_params()

        if ids:  # if sent multiple ids then grab the list
            models = model_class.read_many(ids)
        else:  # or do a filter
            query_filters = self._get_query_filters()
            models = model_class.read_by_filter(query_filters)

        items = {resource_name: models}
        return marshal(items, list_field)


class ApplicationEssayResourceManager(EssayResourceManager):
    item_resource_name = "application_essay"
    list_resource_name = "application_essays"
    model_class = ApplicationEssay

    def _add_item_fields(self):
        super(ApplicationEssayResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "theme_essays": fields.List(ResourceField(
                ThemeEssayResourceManager.item_resource_name,
                absolute=True)),
            "selected_theme_essay": ResourceField(
                ThemeEssayResourceManager.item_resource_name,
                absolute=True),
            "school_name": fields.String
            # 'proposed_topics': fields.List(fields.String)
        })


class ApplicationEssayResource(EssayResource):
    resource_manager_class = ApplicationEssayResourceManager


class ApplicationEssayListResource(EssayListResource):
    resource_manager_class = ApplicationEssayResourceManager


class EssayStateAssociationsManager(StatefulResourceManager):
    item_resource_name = "essaystateassociation"
    list_resource_name = "essaystateassociations"
    model_class = EssayStateAssociations

    def _add_item_fields(self):
        super(EssayStateAssociationsManager, self)._add_item_fields()
        self._item_fields.update({
            "theme_essay_id": fields.Integer,
            "application_essay_id": fields.Integer
        })


class EssayStateAssociationsResource(ItemResource):
    """
    This resource allows direct updates of the Application Essay states upon clicking
    them in the Essays view. 
    """
    resource_manager_class = EssayStateAssociationsManager

    def get(self, themeessay_id, appessay_id):
        abort(400, message="Bad Request")

    def delete(self, themeessay_id, appessay_id):
        abort(400, message="Bad Request")

    def put(self, themeessay_id, appessay_id):
        resource_name = self.resource_manager.item_resource_name
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        payload = self._get_payload(appessay_id)
        # print resource_name, id   # TODO KIRK DELETE THESE
        # print payload
        try:
            essay_assoc = model_class.read_by_filter({"theme_essay_id": themeessay_id,
                                                      "application_essay_id": appessay_id})
            assert len(essay_assoc) == 1
            essay_assoc = essay_assoc[0]
        except:  # FIXME: too broad exception
            essay_assoc = None

        if essay_assoc:
            # Should return a single state. Validated by the model class.
            # essay_assoc.state = payload
            item = {resource_name: model_class.update(essay_assoc.application_essay_id, essay_assoc.theme_essay_id,
                                                      {'state': payload})}
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
        except:  # FIXME: too broad exception
            raise InvalidUsage('Did you pass the correct application essay ID in the request body?')
        return payload
