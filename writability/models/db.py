from flask.ext.sqlalchemy import SQLAlchemy


def init_app(app):
    db.init_app(app)
    with app.app_context():
        # Extensions like Flask-SQLAlchemy now know what the "current" app
        # is while within this block. Therefore, you can now run........
        db.create_all()

db = SQLAlchemy()

# imports at the bottom as they require db
from essay import Essay
