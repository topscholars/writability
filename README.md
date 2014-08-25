writability
===========
Install Chrome plugin 'Ember Inspector'

## Setup
    Install Ubuntu
    sudo apt-get install git ruby nodejs npm nodejs-legacy postgresql libpq-dev python-dev python-virtualenv
    git clone <repo uri>
    virtualenv venv_writ
    source venv_writ/bin/activate
    pip install -r writability/requirements.txt
    # on Ubuntu the next line is not necessary, but may be needed in other distros
    # pg_ctl -D /Development/pg -l logfile start # set -D to your postgres location
    sudo -u postgres createuser -s $(whoami)
    sudo -u postgres createdb -O $(whoami) writability
    sudo gem install foreman
    cd writability
    cp .env.example .env    # edit DATABASE_URL=postgres:///writability
    foreman start
    # in a new shell:
    cd writability/writability/scripts
    export DATABASE_URL=postgres:///writability
    export DEPLOYMENT=DEV
    python2 populate_db.py      # server must be running for this to work
    # The site is available at http://localhost:5000


## Postgres Note
    *To stop postgres and drop connections then recreate database
    pg_ctl -D /Development/pg -l logfile start # set -D to your postgres location
    createdb -O youruser writability # create a db, will be owned by your user

For any npm issues, run 'sudo npm install' from the project root.


## Ember Setup

To setup the dependencies for ember and ember cli, run `sh ember-setup.sh`.

## EmberCLI file watching

While working on the client application in ember (files located in `ember/app`), run `sh ember-server.sh`.
Continue to access the site as served by the python server (http://localhost:5000).

> When we get authentication completely brought on to the client side, we can look at using ember CLI with its built-in proxy server.


## Heroku
Add Postgres DB
Set buildpack to recognize app as Python instead of node:
heroku config:set BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-python.

To run the populate_db.py script:
Set the HOST to be the full heroku URL, e.g. "http://writability-staging.herokuapp.com"
Use $heroku run bash to get into the heroku command line.
cd into /scripts and run as usual with 'python populate_db.py'

### Refreshing data from Prod
This script is not yet working on Heroku, a ticket is filed with their support team. But you can manually enter the lines from the script file into a console.
`heroku run bash db_refresh_from_prod.sh --app writability-dev`
Production DB backups will be stored in the code repo occasionally and after major updates.

To reset:
heroku pg:reset DATABASE_URL --app writability-dev --confirm writability-dev
