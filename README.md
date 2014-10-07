writability
===========
Install Chrome plugin 'Ember Inspector'

## Day-to-day
- Open terminal
- Run 'foreman start' in one tab, to start server
- Run 'sh ember-server.sh' in a 2nd tab, to start ember file watching
- Code

## Setup
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
    python populate_db.py      # server must be running for this to work
    # The site is available at http://localhost:5000

Note: foreman is used to read the procfile. If not using foreman, the 'export' commands are needed for the 3 vars in the procfile.

## Postgres Note
To stop postgres, drop connections, then recreate a database:
- `pg_ctl -D /Development/pg -l logfile start`  Set -D to your postgres location
- `createdb -O youruser writability`    Create a db, will be owned by your user

For any npm issues, run 'sudo npm install' from the project root.


## Ember Setup

To setup the dependencies for ember and ember cli, run `sh ember-setup.sh`.

## EmberCLI file watching

While working on the client application in ember (files located in `ember/app`), run `sh ember-server.sh`.
Continue to access the site as served by the python server (http://localhost:5000).

> When we get authentication completely brought on to the client side, we can look at using ember CLI with its built-in proxy server.


## Heroku
To deploy on existing: git push (remote) develop:master

To deploy on a fresh instance:

1. Add Postgres DB to heroku app
2. Add logging tools of choice
3. Set buildpack to recognize app as Python instead of node:
  - `heroku config:set BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-python --app app_name`
4. run the populate_db.py script:
  - `heroku run bash`
  - `cd writability/scripts`
  - `python populate_db.py`
5. Prepare data with psql commands
  - `update essay set is_displayed=TRUE where is_displayed is null and type='theme_essay';`
  - `update essay set is_displayed=FALSE where is_displayed is null and type='application_essay';`
  - `update tag SET is_simple_tag=false WHERE tag_type='NEUTRAL';`

### Refreshing data from Prod
This script is not yet working on Heroku, their support team has confirmed python deployments don't support Heroku CLI commands (rails does..). But you can manually enter the lines from the script file into a console.

`heroku run bash db_refresh_from_prod.sh --app writability-dev`

Production DB backups will be stored in the code repo occasionally and after major updates.

To reset:
`heroku pg:reset DATABASE_URL --app writability-dev --confirm writability-dev`


