#!/bin/bash

dropdb writability
createdb writability

# This gave PG issue on mac OSX, needed to use 'createdb -O kirkportas writability'
# ./populate_db.py
