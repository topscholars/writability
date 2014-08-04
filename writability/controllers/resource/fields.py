"""
controllers.resource.fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom output fields.

"""
from flask.ext.restful import fields
from flask import jsonify
from collections import Iterable
from models.rubric import RubricCategory

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


class RubricAssocationResourceField(fields.Url):
    """
    Fuckery specifically for Rubric API

    """
    def output(self, key, obj):
        rub_id = None
        rub_cat_id = None
        grade = None
        id=None

        # if object is a list get the right key
        if hasattr(obj, "__iter__"):
            rub_id = obj[key].rubric_id
            rub_cat_id = obj[key].rubric_category_id
            grade = obj[key].grade
            id = str(rub_id)+'-'+str(rub_cat_id)
            # id = {"id": obj[key].id}
        # else, just grab the id from the object
        else:
            sub_obj = getattr(obj, key)
            if sub_obj:
                rub_id = sub_obj.rubric_id
                rub_cat_id = sub_obj.rubric_category_id
                grade = sub_obj.grade
                id = str(rub_id)+'-'+str(rub_cat_id)

        if rub_id and rub_cat_id:
            return dict(id=id,rubric_category_id=rub_cat_id, grade=grade)
            # return super(ResourceField, self).output(key, id)
        else:
            return None

# Maybe?
# class RubricCategoryResourceField(fields.Url):

#     def output(self, key, obj):
#         rc_id = None
#         grade = None

#         if isinstance(obj, Iterable):  # if object is a list get the right key
#             rc_id = obj[key].id
#             for ea in obj[key].rubric_associations:
#                 grade = ea.grade   # TODO: (Mike) discuss it with John
#         else:  # else, just grab the id from the object
#             sub_obj = getattr(obj, key)
#             if sub_obj:
#                 rc_id = sub_obj.id
#                 for ea in sub_obj.rubric_associations:
#                     grade = ea.grade   # TODO: (Mike) discuss it with John
#         if rc_id:
#             return dict(rubric_category=RubricCategory.read(rc_id).name, grade=grade)
#         else:
#             return None

class JSONField(fields.String):

    """
    Convert a string field to JSON for output.

    """
    def format(self, value):
        return value