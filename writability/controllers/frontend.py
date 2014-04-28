# ----------------------------------------------------------------------------#
# Frontend Controllers
# ----------------------------------------------------------------------------#
from flask import Blueprint, render_template

bp = Blueprint('frontend', __name__)


@bp.route('/landing')
def landing():
    return render_template('pages/landing.jinja')


@bp.route('/', defaults={'path': '/'})
@bp.route('/<path:path>')
def home(path):
    return render_template('pages/app.jinja')
