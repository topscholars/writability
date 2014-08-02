"""
controllers.resource.rubric
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource Rubric.

"""
from flask.ext.restful import fields

from models.rubric import Rubric, RubricCategory, Criterion, RubricCategoryRubricAssociations
import review, annotation

from .base import ResourceManager, ItemResource, ListResource
from .fields import ResourceField, RubricCategoryResourceField


class RubricResourceManager(ResourceManager):

    item_resource_name = "rubric"
    list_resource_name = "rubrics"
    model_class = Rubric

    def _add_item_fields(self):
        super(RubricResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "review": ResourceField(
                review.ReviewResourceManager.item_resource_name,
                absolute=True),
            "rubric_categories": fields.List(RubricCategoryResourceField(
                RubricCategoryResourceManager.item_resource_name,
                absolute=True))
        })

class RubricResource(ItemResource):

    resource_manager_class = RubricResourceManager

class RubricListResource(ListResource):

    resource_manager_class = RubricResourceManager

class RubricCategoryRubricAssociationsResourceManager(ResourceManager):

    item_resource_name = "rubric_association"
    list_resource_name = "rubric_associations"
    model_class = Rubric

    def _add_item_fields(self):
        super(RubricCategoryRubricAssociationsResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "rubric_category_id": fields.Integer,
            "grade": fields.Integer
        })

class RubricCategoryRubricAssociationsResource(ItemResource):

    resource_manager_class = RubricCategoryRubricAssociationsResourceManager

class RubricCategoryRubricAssociationsListResource(ListResource):

    resource_manager_class = RubricCategoryRubricAssociationsResourceManager

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
