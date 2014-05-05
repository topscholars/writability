"""
controllers.resource.base
~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the base resources for the API. It also contains a
StatefulResource.

"""
from flask import request
from flask.ext.restful import Resource, fields
from flask.ext.restful import marshal


class ResourceManager(object):

    item_endpoint = None
    list_endpoint = None
    model_class = None

    def __init__(self):
        self._item_fields = {}
        self.list_field = {}
        self.item_field = {}

        self._add_item_fields()
        self._add_list_field()
        self._add_item_field()

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

    def _get_payload(self):
        """Get the JSON body of the request."""
        json = request.get_json()
        endpoint = self.resource_manager.item_endpoint
        payload = json[endpoint]
        return payload

    def _get_query_filters(self):
        """Return the query filters with a single value for each one."""
        args = request.args
        # set flat=False to allow for multiple values.
        return args.to_dict(flat=True)


class ItemResource(BaseResource):

    def get(self, id):
        endpoint = self.resource_manager.item_endpoint
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        item = {endpoint: model_class.read(id)}
        return marshal(item, item_field)

    def put(self, id):
        endpoint = self.resource_manager.item_endpoint
        model_class = self.resource_manager.model_class
        item_field = self.resource_manager.item_field

        payload = self._get_payload()
        item = {endpoint: model_class.update(id, payload)}

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

        query_filters = self._get_query_filters()
        models = model_class.read_by_filter(query_filters)

        items = {endpoint: models}
        return marshal(items, list_field)

    def post(self):
        endpoint = self.resource_manager.item_endpoint
        item_field = self.resource_manager.item_field
        model_class = self.resource_manager.model_class

        payload = self._get_payload()
        item = {endpoint: model_class.create(payload)}

        return marshal(item, item_field), 201

    @classmethod
    def get_endpoint(class_):
        return class_.resource_manager_class.list_endpoint


class StatefulResourceManager(ResourceManager):

    def _add_item_fields(self):
        super(StatefulResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "state": fields.String,
            "next_states": fields.List(fields.String)
        })
