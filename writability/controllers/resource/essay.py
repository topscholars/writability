from flask.ext.restful import Resource, reqparse, fields
from flask.ext.restful import marshal_with, marshal_with_field

# TODO: Delete this dict
essays = [
    {
        "id": 901,
        "prompt": "a great prompt 901",
        "topic": "something truly brilliant"
    },
    {
        "id": 456,
        "prompt": "456asdasd",
        "topic": "something truly brilliant"
    }
]

parser = reqparse.RequestParser()
parser.add_argument('prompt', required=True, type=str)
parser.add_argument('audience', required=True, type=str)
parser.add_argument('context', required=True, type=str)
parser.add_argument('topic', type=str)
# parser.add_argument('due_date', type=date)
parser.add_argument('word_count', type=int)
parser.add_argument('num_drafts', type=int)


class EssayResource(Resource):

    my_endpoint = "essay"

    # variable 'fields' is used by Flask
    output_fields = {
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

    @marshal_with(output_fields)
    def get(self, id):
        for essay in essays:
            if essay.get("id") == id:
                return essay

    def put(self, id):
        pass

    def delete(self, id):
        pass


class EssayListResource(Resource):

    my_endpoint = "essays"

    output_fields = {
        my_endpoint: fields.List(fields.Nested(EssayResource.output_fields))
    }

    @marshal_with(output_fields)
    def get(self):
        return {self.my_endpoint: essays}

    def post(self):
        pass
