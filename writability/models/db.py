"""
models.db
~~~~~~~~~

This model attaches the app to the database and imports all tables.

"""
import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore
from flask.ext.security import user_registered
from flask.ext.script import Manager, Server
from flask.ext.migrate import Migrate, MigrateCommand

db = SQLAlchemy()

def on_user_registered(sender, user, confirm_token):
    invitation = Invitation.query.filter_by(
        email=user.email, is_registered=False).first()
    if invitation is not None:
        user.teacher_id = invitation.teacher_id
        invitation.is_registered = True
        db.session.commit()


def init_app(app, security_forms):
    manager = init_manager(app)
    db.init_app(app)
    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        Security(app, user_datastore, **security_forms)
        db.create_all()
    user_registered.connect(on_user_registered, app)
    return manager

def init_manager(app):
    """
    This function intializes the Manager class. This adds migrate functions and
    overwrites the runserver command.

    To run the server, run 'python app.py runserver'.

    To initialize a new db for migration, run 'python app.py db init'.

    To migrate, run 'python app.py db migrate' to generate migrations, then check
    they were generated correctly, then 'python app.py db upgrade' to apply them.

    Migrations will be stored in source control. 
    """
    migrate = Migrate(app, db)
    manager = Manager(app)
    manager.add_command('db', MigrateCommand)
    port = int(os.environ.get('PORT', 5000))
    manager.add_command("runserver", Server(host='0.0.0.0', port=port))
    return manager

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
from rubric import Rubric, RubricCategory, RubricCategoryRubricAssociations
