writability
===========
Install Chrome plugin 'Ember Inspector'

== Setup
    virtualenv venv_writ 
    pip install -r requirements.txt 
    gem install foreman
    foreman start   /  python app.py
    cd writability/scripts
    python populate_db.py


    *To stop pg and drop connections then recreate DB
    pg_ctl -D /Development/pg -l logfile start # set -D to your postgres location 
    createdb -O youruser writability # create a db, will be owned by your user

For grunt:
       npm install grunt-cli -g



For any npm issues, run 'sudo npm install' from the project root.


Use 'grunt watch' to keep Ember app updated.