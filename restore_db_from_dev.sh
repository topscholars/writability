heroku pgbackups:capture --app writability-dev

curl -o latest.dump `heroku pgbackups:url --app writability-dev`