"""
controllers.resource.fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom output fields.
"""
from collections import Iterable

from flask.ext.restful import fields


class ResourceField(fields.Url):
    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """
    def output(self, key, obj):
        obj_id = None

        if isinstance(obj, Iterable):  # if object is a list get the right key
            obj_id = obj[key].id
        else:  # else, just grab the id from the object
            sub_obj = getattr(obj, key)
            if sub_obj:
                obj_id = sub_obj.id

        if obj_id:
            return obj_id
        else:
            return None


class ApplicationEssayResourceField(fields.Url):
    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """
    def output(self, key, obj):
        ae_id = None
        state = None

        if isinstance(obj, Iterable):  # if object is a list get the right key
            ae_id = obj[key].id
            for ea in obj[key].essay_associations:
                state = ea.state   # TODO: (Mike) discuss it with John
        else:  # else, just grab the id from the object
            sub_obj = getattr(obj, key)
            if sub_obj:
                ae_id = sub_obj.id
                for ea in sub_obj.essay_associations:
                    state = ea.state   # TODO: (Mike) discuss it with John
        if ae_id:
            return dict(application_essay_id=ae_id, state=state)
        else:
            return None


class JSONField(fields.String):
    """
    Convert a string field to JSON for output.

    """

    def format(self, value):
        return value