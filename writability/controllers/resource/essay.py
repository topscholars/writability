from flask.ext.restful import fields

from models.essay import Essay

from base import ItemRequestParser, ItemResource, ListResource


class EssayRequestParser(ItemRequestParser):

    def _add_arguments(self):
        self.parser.add_argument('prompt', required=True, type=str)
        self.parser.add_argument('audience', required=True, type=str)
        self.parser.add_argument('context', required=True, type=str)
        self.parser.add_argument('topic', type=str)
        # parser.add_argument('due_date', type=date)
        self.parser.add_argument('word_count', type=int)
        self.parser.add_argument('num_of_drafts', type=int)


class EssayResource(ItemResource):

    model = Essay

    my_endpoint = "essay"

    parser = EssayRequestParser()

    # variable 'fields' is used by Flask
    _item_fields = {
        "prompt": fields.String,
        "audience": fields.String,
        "context": fields.String,
        "topic": fields.String,
        # "proposed_topics": fields.String,
        # "due_date": fields.String,
        "word_count": fields.Integer,
        "num_of_drafts": fields.Integer,
        "uri": fields.Url(my_endpoint, absolute=True)
    }


class EssaysListResource(ListResource):

    model = Essay

    my_endpoint = "essays"

    parser = EssayResource.parser

    _item_resource = EssayResource
