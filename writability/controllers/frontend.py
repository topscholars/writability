"""
controllers.frontend
~~~~~~~~~~~~~~~~~~~~

This module contains all frontend controllers.

All security controllers are implemented silently through Flask-Security.

"""
from flask import Blueprint, render_template
from flask.ext.login import current_user

bp = Blueprint('frontend', __name__)


@bp.route('/', defaults={'path': '/'})
@bp.route('/<path:path>')
def index(path):
    if current_user.is_authenticated():
        return render_template('pages/app.jinja')
    else:
        return render_template('pages/landing.jinja')
