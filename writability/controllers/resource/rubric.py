"""
controllers.resource.rubric
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Rubric.

"""
from flask.ext.restful import fields, marshal
from flask import request

from models.rubric import Rubric, RubricCategory, Criterion, RubricCategoryRubricAssociations
import review, annotation

from .base import ResourceManager, ItemResource, ListResource, InvalidUsage
from .fields import ResourceField, RubricAssocationResourceField


class RubricResourceManager(ResourceManager):
    item_resource_name = "rubric"
    list_resource_name = "rubrics"
    model_class = Rubric

    def _add_item_fields(self):
        super(RubricResourceManager, self)._add_item_fields()
        self._item_fields.update({
            # THESE ARE TIED TO MODEL CLASS RELATIONSHIPS/ATTRs
            "name": fields.String,
            "review": ResourceField(
                review.ReviewResourceManager.item_resource_name,
                absolute=True),
            "rubric_associations": fields.List(RubricAssocationResourceField(
                RubricCategoryRubricAssociationsResourceManager.item_resource_name,
                absolute=True))
        })

class RubricResource(ItemResource):

    resource_manager_class = RubricResourceManager

class RubricListResource(ListResource):

    resource_manager_class = RubricResourceManager

class RubricCategoryRubricAssociationsResourceManager(ResourceManager):

    item_resource_name = "rubric_association"
    list_resource_name = "rubric_associations"
    model_class = RubricCategoryRubricAssociations

    def _add_item_fields(self):
        super(RubricCategoryRubricAssociationsResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "rubric_category_id": fields.Integer,
            "rubric_id": fields.Integer,
            "grade": fields.Integer
        })

class RubricCategoryRubricAssociationsResource(ItemResource):
    '''
    Sets grade for the rubric and category passed in.
    '''

    resource_manager_class = RubricCategoryRubricAssociationsResourceManager

    def get(self, rubric_id, rubric_category_id):
        # what's the correct way to 404 this?
        raise NotImplementedError()
        return None

    def delete(self, rubric_id, rubric_category_id):
        # what's the correct way to 404 this?
        raise NotImplementedError()
        return None

    def put(self, rubric_id, rubric_category_id):
        resource_name = self.resource_manager.item_resource_name
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        grade = self._get_payload()

        try:            
            rubric_association = model_class.read_by_filter({'rubric_id':rubric_id,'rubric_category_id':rubric_category_id})[0]
        except:
            rubric_association = None

        if rubric_association:
            item = {resource_name: model_class.update(rubric_id, rubric_category_id, { 'grade' : grade })}            
            return marshal(item, item_field)
        else:
            raise InvalidUsage('Rubric association does not exist.')

    def _get_payload(self):
        """
        Get the JSON body of the request.
        Should be in the form { "grade" : grade }

        """        
        json = request.get_json()
        try:            
            payload = json[str("grade")]
        except:
            raise InvalidUsage('Did you pass grade correctly?')
        return payload

class RubricCategoryResourceManager(ResourceManager):

    item_resource_name = "rubric_category"
    list_resource_name = "rubric_categories"
    model_class = RubricCategory

    def _add_item_fields(self):
        super(RubricCategoryResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "grade": fields.Integer,
            "criteria": fields.List(ResourceField(
                annotation.TagResourceManager.item_resource_name,
                absolute=True)),
            "help_text": fields.String
        })

class RubricCategoryResource(ItemResource):

    resource_manager_class = RubricCategoryResourceManager

class RubricCategoryListResource(ListResource):

    resource_manager_class = RubricCategoryResourceManager

class CriterionResourceManager(annotation.TagResourceManager):

    item_resource_name = "criterion"
    list_resource_name = "criteria"
    model_class = Criterion

    # RETURN ONLY TAGS WHERE rubriccategory != NULL or supercategory==TRUE

    def _add_item_fields(self):
        super(CriterionResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "rubriccategory": ResourceField(
                RubricCategoryResourceManager.item_resource_name,
                absolute=True)
        })

class CriterionResource(ItemResource):

    resource_manager_class = CriterionResourceManager


class CriterionListResource(ListResource):

    resource_manager_class = CriterionResourceManager
