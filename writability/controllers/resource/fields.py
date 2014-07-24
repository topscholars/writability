"""
controllers.resource.fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom output fields.

"""
from flask.ext.restful import fields
from flask import jsonify


class ResourceField(fields.Url):

    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """

    def output(self, key, obj):
        id = None

        # if object is a list get the right key
        if hasattr(obj, "__iter__"):
            id = obj[key].id
            # id = {"id": obj[key].id}
        # else, just grab the id from the object
        else:
            sub_obj = getattr(obj, key)
            if sub_obj:
                id = sub_obj.id
                # id = {"id": sub_obj.id}

        if id:
            return id
            # return super(ResourceField, self).output(key, id)
        else:
            return None

class ApplicationEssayResourceField(fields.Url):

    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """

    def output(self, key, obj):
        id = None
        state = None

        # if object is a list get the right key
        if hasattr(obj, "__iter__"):
            id = obj[key].id
            try:
                for ea in obj[key].essay_associations:
                    if ea.application_essay_id == id:
                        state = ea.state
            except:
                pass
            # id = {"id": obj[key].id}
        # else, just grab the id from the object
        else:
            sub_obj = getattr(obj, key)
            if sub_obj:
                id = sub_obj.id
                try: 
                    for ea in sub_obj.essay_associations:
                        if ea.application_essay_id == id:
                            state = ea.state
                except:
                    pass
                # id = {"id": sub_obj.id}

        if id:
            return {id : state}
            # return super(ResourceField, self).output(key, id)
        else:
            return None

class JSONField(fields.String):

    """
    Convert a string field to JSON for output.

    """
    def format(self, value):
        return value