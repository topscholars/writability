#!/usr/bin/env python
"""
app
~~~

This is the Writability app.

"""
import os
from flask import Flask, render_template
from flask_sslify import SSLify

import logging
from logging import Formatter, FileHandler
# from forms import LoginForm, RegisterForm, ForgotForm

from models.db import init_app
from controllers import frontend, api, security

# ----------------------------------------------------------------------------#
# App Config.
# ----------------------------------------------------------------------------#

app = Flask(__name__)

sslify = SSLify(app, subdomains=True)

app.config.from_object('config')

init_app(app, security.security_forms)

# Automatically tear down SQLAlchemy.
'''
@app.teardown_request
def shutdown_session(exception=None):
    db_session.remove()
'''

# Login required decorator.
'''
def login_required(test):
    @wraps(test)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return test(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for('login'))
    return wrap
'''
# ----------------------------------------------------------------------------#
# Controllers.
# ----------------------------------------------------------------------------#

app.register_blueprint(frontend.bp)
api.initialize(app, "/api")


@app.errorhandler(500)
def internal_error_500(error):
    # db_session.rollback()
    return render_template('errors/500.html'), 500


@app.errorhandler(404)
def internal_error_404(error):
    return render_template('errors/404.html'), 404

if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')


# ----------------------------------------------------------------------------#
# Launch.
# ----------------------------------------------------------------------------#

# Specify port manually:
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
