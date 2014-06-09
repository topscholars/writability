"""
controllers.frontend
~~~~~~~~~~~~~~~~~~~~

This module contains all frontend controllers.

All security controllers are implemented silently through Flask-Security.

"""
from flask import Blueprint, render_template
from flask.ext.login import current_user
from flask_wtf import Form


bp = Blueprint('frontend', __name__)


@bp.route('/', defaults={'path': '/'})
@bp.route('/<path:path>')
def index(path):
    if current_user.is_authenticated():
        return render_template('pages/app.jinja')
    else:
        return render_template('security/register_user.html',
                               register_user_form=Form())
