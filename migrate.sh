
export PYTHONUNBUFFERED=true
export DATABASE_URL=postgres://kirkportas:@localhost/writability
export DEPLOYMENT=DEV

cd writability
python app.py db upgrade