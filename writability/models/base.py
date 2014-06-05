"""
models.base
~~~~~~~~~~~

This module contains BaseModel and StatefulModel.

"""
from datetime import datetime
from sqlalchemy.orm import properties, class_mapper, validates

from .db import db
from .fields import SerializableDateTime


class BaseModel(db.Model):
    """
    BaseModel represents a database table. It provides generic CRUD methods and
    required properties.

    """
    __abstract__ = True

    _utcnow = datetime.utcnow()

    created_ts = db.Column(
        SerializableDateTime,
        nullable=False,
        default=_utcnow)

    updated_ts = db.Column(
        SerializableDateTime,
        nullable=False,
        default=_utcnow,
        onupdate=_utcnow)

    deleted_ts = db.Column(SerializableDateTime)

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        pass

    def process_before_update(self):
        """Process model upon update / save."""
        pass

    @classmethod
    def create(class_, object_dict):
        prepared_dict = class_._replace_resource_ids_with_models(object_dict)
        model = class_(**prepared_dict)
        model.process_before_create()
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
    def read_many(class_, ids):
        return class_.query.filter(class_.id.in_(ids)).all()

    @classmethod
    def update(class_, id, updated_dict):
        model = class_.read(id)
        db.session.add(model)

        prepared_dict = class_._replace_resource_ids_with_models(updated_dict)
        model.process_before_update()
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
                    if id is None:
                        object_dict[relation.key] = None
                    else:
                        model = relation_class.query.get(id)
                        if model is None:
                            raise ValueError(
                                "The relationship {} has no id {}".format(
                                    relation.key,
                                    id))
                        object_dict[relation.key] = model

        return object_dict


class StatefulModel(BaseModel):
    """
    StatefulModel has a 'state' property and helper functions.

    """
    __abstract__ = True

    state = db.Column(db.String, nullable=False)

    def __init__(self, **object_dict):
        super(StatefulModel, self).__init__(**object_dict)
        # if the object is new (no id) and has no state, give it one.
        if not self.id and not self.state:
            self.state = self._get_default_state()

    @validates('state')
    def validate_state(self, key, state):
        """Assert that state is valid and conditions are satisfied."""
        old_state = self.state

        assert state in self._STATES
        if old_state is None:
            assert state in self._get_initial_states()
        elif old_state != state:
            assert state in self._get_next_states(old_state)

        return state

    @property
    def next_states(self):
        """Return list of valid next states."""
        return self._get_next_states(self.state)

    def _validate_state(self, state):
        """Helper function to have subclasses validate state."""
        raise NotImplementedError()

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        raise NotImplementedError()

    def _get_default_state(self):
        """Get the default new state."""
        raise NotImplementedError()

    def _get_initial_states(self):
        """Get the allowed initial states."""
        raise NotImplementedError()
