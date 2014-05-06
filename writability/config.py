import os

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

# Enable debug mode.
DEBUG = False

# Secret key for session management. You can generate random strings here:
# http://clsc.net/tools-old/random-string-generator.php
SECRET_KEY = 'my precious'

SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

DEPLOYMENT = os.environ.get("DEPLOYMENT")

if DEPLOYMENT == "PRODUCTION":
    DEBUG = False
elif DEPLOYMENT == "STAGING":
    # TODO: Switch this to False when Staging server has SSL.
    DEBUG = True
elif DEPLOYMENT == "DEV":
    DEBUG = True
else:
    raise ValueError("Set DEPLOYMENT with PRODUCTION, STAGING, or DEV.")
