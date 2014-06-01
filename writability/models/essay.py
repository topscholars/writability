"""
models.essay
~~~~~~~~~~~~

This module contains an abstract Essay and its subclasses, ThemeEssay and
ApplicationEssay. A ThemeEssay is the essay the students first write. An
ApplicationEssay is the essay the students write for a specific Application.

Essays have a series of Drafts that the Student writes.

"""
from sqlalchemy.orm import validates

from .db import db
from .base import BaseModel, StatefulModel
from .fields import SerializableStringList
from .relationships import essay_associations


class Essay(BaseModel):

    # required fields
    id = db.Column(db.Integer, primary_key=True)
    essay_prompt = db.Column(db.String, nullable=False)

    # optional fields
    audience = db.Column(db.String)
    context = db.Column(db.String)
    topic = db.Column(db.String)
    max_words = db.Column(db.Integer)
    num_of_drafts = db.Column(db.Integer)
    due_date = db.Column(db.Date)

    # inheritance
    discriminator = db.Column('type', db.String(50))
    __mapper_args__ = {'polymorphic_on': discriminator}

    # relationships
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    drafts = db.relationship("Draft", backref="essay", order_by="Draft.id")
    essay_template_id = db.Column(db.Integer, db.ForeignKey("essay_template.id"))

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(Essay, self).process_before_create()
        if not self.essay_template:
            raise ValueError("essay template cannot be empty.")

        self.essay_prompt = self.essay_template.essay_prompt

    def isTheme(self):
        return isinstance(self, ThemeEssay)

    def isApplication(self):
        return isinstance(self, ApplicationEssay)

    @property
    def current_draft(self):
        if self.drafts:
            curr_draft_list = self.drafts[-1:]  #List. ordered by ID
            return curr_draft_list[0]  
        else:
            return None

    @property
    def draft_due_date(self):
        """Return due date of current draft."""
        #import pdb; pdb.set_trace()
        return self.current_draft.due_date


    @property
    def next_action(self):
        """Return next action to be taken on essay."""
        drafts = self.drafts
        existing_drafts = len(drafts) 
        num_of_drafts = self.num_of_drafts
        curr_draft = self.current_draft
        s = curr_draft.state if curr_draft else None
                    #chokes when no curr_draft
        action = "ERROR"

        if not self.topic:              # no topic selected
            action = "Add Topics"
        elif self.proposed_topics[0] or self.proposed_topics[1]:
            action = "Approve Topic"
        elif existing_drafts != 0 and existing_drafts < num_of_drafts:
            if (s == "new") or (s == "in_progress"):
                action = "Write"
            elif s == "submitted":
                action = "Review"
            return "%s Draft %d / %d" % (action, existing_drafts, num_of_drafts)
        else:
            return "else"
            if curr_draft.is_final_draft and s == "reviewed":
                action = "Complete"
            else:
                action = "Error"
        return action

class ThemeEssay(StatefulModel, Essay):

    _STATES = ["new", "added_topics", "in_progress", "completed"]

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'theme_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields
    proposed_topics = db.Column(SerializableStringList, default=["", ""])

    # relationships
    theme_id = db.Column(db.Integer, db.ForeignKey("theme.id"))
    theme = db.relationship("Theme")
    application_essays = db.relationship(
        "ApplicationEssay",
        secondary=essay_associations,
        backref=db.backref("theme_essays", lazy="dynamic"))

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ThemeEssay, self).process_before_create()
        theme_essay_template = self.essay_template
        self.audience = theme_essay_template.audience
        self.context = theme_essay_template.context
        self.theme = theme_essay_template.theme

    @validates('proposed_topics')
    def validate_proposed_topics(self, key, proposed_topics):
        assert len(proposed_topics) == 2
        return proposed_topics

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["added_topics"],
            "added_topics": ["in_progress"],
            "in_progress": ["completed"],
            "completed": []
        }

        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "new"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["new"]


class ApplicationEssay(Essay):

    # inheritance
    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields

    # relationships
    # theme_essays: don't explicitly declare it but it's here

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ApplicationEssay, self).process_before_create()
        app_essay_template = self.essay_template
        self.max_words = app_essay_template.max_words
        self.due_date = self.essay_template.due_date
        self.university = app_essay_template.university
