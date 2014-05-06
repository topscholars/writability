"""
models.db
~~~~~~~~~

This model attaches the app to the database and imports all tables.

"""
from flask.ext.sqlalchemy import SQLAlchemy


def init_app(app):
    db.init_app(app)
    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()

db = SQLAlchemy()

# Imports at the bottom as they require db
# They need to be imported to be added to the db
from essay import Essay
from draft import Draft
from university import University
from theme import Theme
from essay_template import EssayTemplate
