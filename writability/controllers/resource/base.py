from flask.ext.restful import Resource, reqparse, fields
from flask.ext.restful import marshal


class ItemRequestParser(object):

    def __init__(self):
        self.parser = reqparse.RequestParser()
        self._add_arguments()

    def parse_args(self):
        return self.parser.parse_args()

    def _add_arguments(self):
        raise NotImplementedError()


class ItemResource(Resource):

    def get(self, id):
        item = self.model.read(id)
        return marshal(item, self.get_item_fields())

    def put(self, id):
        args = self.parser.parse_args()
        item = self.model.update(id, args)
        return marshal(item, self.get_item_fields())

    def delete(self, id):
        # TODO: what should I return on deletes?
        id = self.model.delete(id)
        return id

    @classmethod
    def get_item_fields(class_):
        try:
            return class_._item_fields
        except NameError:
            raise NotImplementedError()


class ListResource(Resource):

    def get(self):
        items = {self.my_endpoint: self.model.read_all()}
        print items
        print self._get_list_field()
        print self._get_item_fields()
        return marshal(items, self._get_list_field())

    def post(self):
        args = self.parser.parse_args()
        item = self.model.create(args)
        return marshal(item, self._get_item_fields()), 201

    def _get_list_field(self):
        try:
            return {
                self.my_endpoint: fields.List(
                    fields.Nested(self._get_item_fields()))
            }
        except NameError:
            raise NotImplementedError()

    def _get_item_fields(self):
        try:
            return self._item_resource.get_item_fields()
        except NameError:
            raise NotImplementedError()
