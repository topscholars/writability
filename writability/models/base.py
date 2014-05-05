"""
models.base
~~~~~~~~~~~

This module contains the base model that represents a database table.

"""
from datetime import datetime
from sqlalchemy.orm import properties, class_mapper

from .db import db
from .fields import SerializableDateTime


class BaseModel(db.Model):

    __abstract__ = True

    _utcnow = datetime.utcnow()

    created_ts = db.Column(
        SerializableDateTime,
        nullable=False,
        default=_utcnow)

    updated_ts = db.Column(
        SerializableDateTime,
        nullable=False,
        default=_utcnow)

    deleted_ts = db.Column(SerializableDateTime)

    @classmethod
    def create(class_, object_dict):
        prepared_dict = class_._replace_resource_ids_with_models(object_dict)
        model = class_(**prepared_dict)
        db.session.add(model)
        db.session.commit()
        return model

    @classmethod
    def read(class_, id):
        return class_.query.get(id)

    @classmethod
    def read_by_filter(class_, query_filters={}):
        # TODO: Accept flat=False query filter dict by adding OR conditions
        # to an embedded array.
        return class_.query.filter_by(**query_filters).all()

    @classmethod
    def update(class_, id, updated_dict):
        model = class_.read(id)
        db.session.add(model)

        prepared_dict = class_._replace_resource_ids_with_models(updated_dict)
        for k, v in prepared_dict.items():
            # only update attributes that have changed
            try:
                if getattr(model, k) != v:
                    setattr(model, k, v)
            except AttributeError:
                setattr(model, k, v)

        db.session.commit()
        return model

    @classmethod
    def delete(class_, id):
        # TODO: Change this to a delete flag timestamp
        model = class_.read(id)
        db.session.delete(model)
        db.session.commit()
        return id

    @classmethod
    def _get_relationship_properties(class_):
        return filter(
            lambda p: isinstance(p, properties.RelationshipProperty),
            class_mapper(class_).iterate_properties)

    @classmethod
    def _replace_resource_ids_with_models(class_, object_dict):
        """ Return an object dict with relationship ids replaced by models."""
        for relation in class_._get_relationship_properties():
            relation_class = relation.mapper.class_

            # only do replacement is object_dict has this property
            if relation.key in object_dict:
                if relation.uselist:
                    model_ids = object_dict.get(relation.key)
                    object_dict[relation.key] = [
                        relation_class.query.get(id)
                        for id in model_ids
                    ]
                else:
                    id = object_dict.get(relation.key)
                    object_dict[relation.key] = relation_class.query.get(id)

        return object_dict
