from datetime import datetime

from db import db


class SerializableDateTime(db.TypeDecorator):

    impl = db.DateTime

    def process_result_value(self, value, dialect):
        # account for nullable deleted_ts by simply returning None
        return value.isoformat() if value is not None else value


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
        model = class_(**object_dict)
        db.session.add(model)
        db.session.commit()
        return model

    @classmethod
    def read(class_, id):
        return class_.query.get(id)

    @classmethod
    def read_all(class_):
        return class_.query.all()

    @classmethod
    def update(class_, id, updated_dict):
        model = class_.read(id)
        db.session.add(model)

        for k, v in updated_dict.items():
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
