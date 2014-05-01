"""
controllers.resource.fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom output fields.

"""
from flask.ext.restful import fields


class ResourceField(fields.Url):

    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """

    def output(self, key, obj):
        id = None

        # if object is a list get the right key
        if hasattr(obj, "__iter__"):
            id = {"id": obj[key].id}
        # else, just grab the id from the object
        else:
            sub_obj = getattr(obj, key)
            if sub_obj:
                id = {"id": sub_obj.id}

        if id:
            return super(ResourceField, self).output(key, id)
        else:
            return None
