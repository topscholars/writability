writability
===========


$ virtualenv venv_writ
$ pip install -r requirements.txt
$ pg_ctl -D /development/pg -l logfile start  # starts pg, set -D to your postgres location
$ createdb writability                        # create a db, will be owned by your user

Run the populate_db.py script from that dir.