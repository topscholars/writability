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


## Grunt
    sudo npm install -g grunt-cli
    cd writability
    npm install grunt grunt-ember-templates grunt-contrib-concat grunt-contrib-wah grunt-contrib-less
    grunt watch     # to keep Ember app updated (recompile assets/writability.js when src files change)
