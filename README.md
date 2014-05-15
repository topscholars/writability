writability
===========
Install Chrome plugin 'Ember Inspector'

== Setup
       virtualenv venv_writ 
       pip install -r requirements.txt 
       pg_ctl -D /Development/pg -l logfile start # set -D to your postgres location 
       createdb -O youruser writability # create a db, will be owned by your user
       cd writability/scripts
       python populate_db.py

For grunt:
       npm install grunt-cli -g


Use 'grunt watch' to keep Ember app updated.