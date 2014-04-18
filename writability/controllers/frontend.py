# ----------------------------------------------------------------------------#
# Frontend Controllers
# ----------------------------------------------------------------------------#
from flask import Blueprint, render_template

host = Blueprint('frontend', __name__)


@host.route('/')
def home():
    return render_template('pages/landing.jinja')
