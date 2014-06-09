"""
models.db
~~~~~~~~~

This model attaches the app to the database and imports all tables.

"""
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore
from flask.ext.security import user_registered

db = SQLAlchemy()


def on_user_registered(sender, user, confirm_token):
    invitation = Invitation.query.filter_by(
        email=user.email, is_registered=False).first()
    if invitation is not None:
        user.teacher_id = invitation.teacher_id
        invitation.is_registered = True
        db.session.commit()


def init_app(app, security_forms):
    db.init_app(app)
    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        Security(app, user_datastore, **security_forms)
        db.create_all()
    user_registered.connect(on_user_registered, app)


# Imports at the bottom as they require db
# They need to be imported to be added to the db
from essay import Essay
from draft import Draft
from university import University
from theme import Theme
from essay_template import EssayTemplate
from user import User, Invitation
from role import Role
from review import Review
from annotation import Annotation, Tag
