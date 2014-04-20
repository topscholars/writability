from db import db
from base import BaseModel


class Essay(BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.String)
    audience = db.Column(db.String)
    context = db.Column(db.String)
    topic = db.Column(db.String)
    # proposed_topic = db.Column(db.String)
    # due_date = db.Column(db.String)
    word_count = db.Column(db.Integer)
    num_of_drafts = db.Column(db.Integer)
