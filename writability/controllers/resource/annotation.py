"""
controllers.resource.annotation
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resources Annotation and Tag.

"""
from flask.ext.restful import fields, marshal

from models.annotation import Annotation, Tag

from .base import StatefulResourceManager, ItemResource, ListResource
from .fields import ResourceField
import review


class AnnotationResourceManager(StatefulResourceManager):

    item_resource_name = "annotation"
    list_resource_name = "annotations"
    model_class = Annotation

    def _add_item_fields(self):
        super(AnnotationResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "comment": fields.String,
            "original": fields.String,
            "start_index": fields.Integer,
            "end_index": fields.Integer,
            "tag": ResourceField(
                TagResourceManager.item_resource_name,
                absolute=True),
            "review": ResourceField(
                review.ReviewResourceManager.item_resource_name,
                absolute=True)
        })

class AnnotationResource(ItemResource):

    resource_manager_class = AnnotationResourceManager


class AnnotationListResource(ListResource):

    resource_manager_class = AnnotationResourceManager

    # def get(self):
    #     resource_name = self.resource_manager.list_resource_name
    #     model_class = self.resource_manager.model_class
    #     list_field = self.resource_manager.list_field

    #     ids = self._get_ids_from_query_params()
    #     models = []
    #     # if sent multiple ids then grab the list
    #     if ids:
    #         models = model_class.read_many(ids)
    #     # or do a filter
    #     else:
    #         query_filters = self._get_query_filters()
    #         if review_id:
    #             query_filters.update({"review": review_id})
    #         models = model_class.read_by_filter(query_filters)

    #     items = {resource_name: models}
    #     return marshal(items, list_field)

    # def post(self, review_id):
    #     return super(AnnotationListResource, self).post()


class TagResourceManager(StatefulResourceManager):

    item_resource_name = "tag"
    list_resource_name = "tags"
    model_class = Tag

    def _add_item_fields(self):
        super(TagResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "name": fields.String,
            "tag_type": fields.String,
            "category": fields.String,
            "description": fields.String,
            "example": fields.String,
            "super_category": fields.String
        })

class TagResource(ItemResource):

    resource_manager_class = TagResourceManager


class TagListResource(ListResource):

    resource_manager_class = TagResourceManager
