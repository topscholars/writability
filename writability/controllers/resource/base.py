"""
controllers.resource.base
~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the base resources for the API.

"""
from flask.ext.restful import Resource, reqparse, fields
from flask.ext.restful import marshal


class ResourceManager(object):

    item_endpoint = None
    list_endpoint = None
    model_class = None

    def __init__(self):
        self._item_fields = {}
        self.list_field = {}
        self.item_field = {}
        self.parser = reqparse.RequestParser()

        self._add_parse_arguments()
        self._add_item_fields()
        self._add_list_field()
        self._add_item_field()

    def parse_args(self):
        return self.parser.parse_args()

    def _add_parse_arguments(self):
        raise NotImplementedError()

    def _add_item_fields(self):
        self._item_fields.update({
            "id": fields.Integer
            # "uri": fields.Url(self.item_endpoint, absolute=True)
        })

    def _add_list_field(self):
        if self.list_endpoint is None:
            raise NotImplementedError

        self.list_field = {
            self.list_endpoint: fields.List(
                fields.Nested(self._item_fields))
        }

    def _add_item_field(self):
        if self.item_endpoint is None:
            raise NotImplementedError

        self.item_field = {
            self.item_endpoint: fields.Nested(self._item_fields)
        }


class BaseResource(Resource):

    resource_manager_class = None

    def __init__(self):
        super(BaseResource, self).__init__()
        self.resource_manager = None
        self._set_resource_manager()

    def _set_resource_manager(self):
        try:
            self.resource_manager = self.resource_manager_class()
        except TypeError as e:
            if e.args[0] == "'NoneType' object is not callable":
                raise NotImplementedError()
            else:
                raise e

    @classmethod
    def get_endpoint(class_):
        raise NotImplementedError()


class ItemResource(BaseResource):

    def get(self, id):
        endpoint = self.resource_manager.item_endpoint
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        item = {endpoint: model_class.read(id)}
        return marshal(item, item_field)

    def put(self, id):
        endpoint = self.resource_manager.item_endpoint
        args = self.resource_manager.parse_args()
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        item = {endpoint: model_class.update(id, args)}
        return marshal(item, item_field)

    def delete(self, id):
        model_class = self.resource_manager.model_class
        # TODO: what should I return on deletes?
        id = model_class.delete(id)
        return id

    @classmethod
    def get_endpoint(class_):
        return class_.resource_manager_class.item_endpoint


class ListResource(BaseResource):

    def get(self):
        endpoint = self.resource_manager.list_endpoint
        model_class = self.resource_manager.model_class
        list_field = self.resource_manager.list_field

        items = {endpoint: model_class.read_all()}
        return marshal(items, list_field)

    def post(self):
        endpoint = self.resource_manager.item_endpoint
        args = self.resource_manager.parse_args()
        item_field = self.resource_manager.item_field
        model_class = self.resource_manager.model_class

        item = {endpoint: model_class.create(args)}

        return marshal(item, item_field), 201

    @classmethod
    def get_endpoint(class_):
        return class_.resource_manager_class.list_endpoint
