"""
controllers.resource.fields
~~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom output fields.
"""
from collections import Iterable

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
        obj_id = None

        if isinstance(obj, Iterable):  # if object is a list get the right key
            obj_id = obj[key].id
        else:  # else, just grab the id from the object
            sub_obj = getattr(obj, key)
            if sub_obj and hasattr(sub_obj, 'id'):
                obj_id = sub_obj.id

        if obj_id:
            return obj_id
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
            return dict(id=id, rubric_category=rub_cat_id, grade=grade)
            # return super(ResourceField, self).output(key, id)
        else:
            return None

class ApplicationEssayResourceField(fields.Url):
    """
    Convert a list (or single item of) Resource to the format for Url
    and then return the Url.

    """
    # def output(self, key, obj):
    #     ae_id = None
    #     state = None

    #     if isinstance(obj, Iterable):  # if object is a list get the right key
    #         ae_id = obj[key].id
    #         for ea in obj[key].essay_associations:
    #             state = ea.state   # TODO: (Mike) discuss it with John
    #     else:  # else, just grab the id from the object
    #         sub_obj = getattr(obj, key)
    #         if sub_obj:
    #             ae_id = sub_obj.id
    #             for ea in sub_obj.essay_associations:
    #                 state = ea.state   # TODO: (Mike) discuss it with John
    #     if ae_id:
    #         return dict(id=ae_id, state=state)
    #     else:
    #         return None

    def output(self, key, obj):
        te_id = None
        ae_id = None
        state = None
        id=None

        # if object is a list get the right key
        if hasattr(obj, "__iter__"):
            te_id = obj[key].theme_essay_id
            ae_id = obj[key].application_essay_id
            state = obj[key].state
            id = str(te_id)+'-'+str(ae_id)
            # id = {"id": obj[key].id}
        # else, just grab the id from the object
        else:
            sub_obj = getattr(obj, key)
            if sub_obj:
                te_id = sub_obj.theme_essay_id
                ae_id = sub_obj.application_essay_id
                state = sub_obj.state
                id = str(te_id)+'-'+str(ae_id)

        if te_id and ae_id:
            return dict(id=id, application_essay=ae_id, state=state)
            # return super(ResourceField, self).output(key, id)
        else:
            return None

class JSONField(fields.String):
    """
    Convert a string field to JSON for output.

    """

    def format(self, value):
        return value
