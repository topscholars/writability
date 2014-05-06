import os

# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

# Enable debug mode.
DEBUG = False

# Secret key for session management. You can generate random strings here:
# http://clsc.net/tools-old/random-string-generator.php
SECRET_KEY = 'my precious'

SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
SECURITY_PASSWORD_SALT = "8VQ7FP3TE8B5Pyxm"
SECURITY_REGISTERABLE = True

# Turn off email for temporary testing.
# FIXME XXX: Set up email registration and confirmation
SECURITY_SEND_REGISTER_EMAIL = False

SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

DEPLOYMENT = os.environ.get("DEPLOYMENT")

if DEPLOYMENT == "PRODUCTION":
    SECRET_KEY = 'my precious'
    DEBUG = False
elif DEPLOYMENT == "STAGING":
    # TODO: Switch this to False when Staging server has SSL.
    SECRET_KEY = 'my precious'
    DEBUG = True
elif DEPLOYMENT == "DEV":
    DEBUG = True
else:
    raise ValueError("Set DEPLOYMENT with PRODUCTION, STAGING, or DEV.")
