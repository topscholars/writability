"""
models.essay
~~~~~~~~~~~~

This module contains an abstract Essay and its subclasses, ThemeEssay and
ApplicationEssay. A ThemeEssay is the essay the students first write. An
ApplicationEssay is the essay the students write for a specific Application.

Essays have a series of Drafts that the Student writes.

"""
from sqlalchemy.orm import validates

import draft
from .db import db
from .base import BaseModel, StatefulModel
from .fields import SerializableStringList
# from .relationships import essay_associations
from sqlalchemy.ext.associationproxy import association_proxy


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
    essay_template_id = db.Column(
        db.Integer,
        db.ForeignKey("essay_template.id"))

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
            # List. ordered by ID
            curr_draft_list = self.drafts[-1:]
            return curr_draft_list[0]
        else:
            return None

    @property
    def draft_due_date(self):
        """Return due date of current draft."""
        # import pdb; pdb.set_trace()
        return self.current_draft.due_date


class ThemeEssay(StatefulModel, Essay):

    __tablename__ = "theme_essay"

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

    # parent has many merged_theme_essays.
    parent = db.relationship(
        "ThemeEssay",
        backref=db.backref("merged_theme_essays", uselist=True),
        uselist=False,
        remote_side="ThemeEssay.id",
        foreign_keys="ThemeEssay.parent_id")
    parent_id = db.Column(db.Integer, db.ForeignKey("theme_essay.id"))

    _application_essays = db.relationship(
        "EssayStateAssociations",
        backref=db.backref("theme_essays", lazy="dynamic"))

    ## Commented from Master for merging merge-backend
    # @validates('proposed_topics')
    # def validate_proposed_topics(self, key, proposed_topics):
    #     assert len(proposed_topics) == 2
    #     return proposed_topics
    ALLOWED_APP_ESSAY_STATES = ["selected","not_selected","pending"]
    application_essay_states = db.Column(db.PickleType, default={})

    @validates('application_essay_states')
    def validate_app_essay_states(self, key, application_essay_states):
        for val in application_essay_states.values():
            assert val in self.ALLOWED_APP_ESSAY_STATES
        return application_essay_states

    @classmethod
    def create(class_, object_dict):
        if 'application_essays' in object_dict:
            object_dict['_application_essays'] = object_dict.pop('application_essays')
        return super(ThemeEssay, class_).create(object_dict)

    @classmethod
    def update(class_, id, updated_dict):
        if 'application_essays' in updated_dict:
            updated_dict['_application_essays'] = updated_dict.pop('application_essays')
        return super(ThemeEssay, class_).update(id,updated_dict)

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ThemeEssay, self).process_before_create()
        theme_essay_template = self.essay_template
        self.audience = theme_essay_template.audience
        self.context = theme_essay_template.context
        self.theme = theme_essay_template.theme
        self.application_essay_states = {}
        for ae in self._application_essays:
            self.application_essay_states[ae.id] = "pending"

    def change_related_objects(self):
        """
        Change any related objects before commit.

        If an application essay state is "selected", go through all other
        theme essays and mark it "not_selected".

        """
        super(ThemeEssay, self).change_related_objects()

        if self.state == "in_progress" and not self.drafts:
            new_draft_params = {
                "essay": self
            }

            self.drafts.append(draft.Draft(**new_draft_params))

        # just in case new application essays get in
        for ae in self._application_essays:
            if ae.id not in self.application_essay_states.keys():
                import pdb; pdb.set_trace();
                self.application_essay_states[ae.id] = "pending"
        # now mark others not selected
        if self.application_essay_states:
            selected_ae_ids = [id for id in self.application_essay_states if self.application_essay_states[id]=="selected"]            
            for ae_id in selected_ae_ids:
                ae = ApplicationEssay.read(ae_id) 
                for te in ae.theme_essays:
                    if te != self:
                        te.application_essay_states[ae_id] = "not_selected"


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

    @property
    def application_essays(self):
        """Return application essays to be shown in the list for this item."""
        return self._application_essays

    @property
    def next_action(self):
        """Return next action to be taken on essay."""
        drafts = self.drafts
        existing_drafts = len(drafts)
        num_of_drafts = self.num_of_drafts
        curr_draft = self.current_draft
        s = curr_draft.state if curr_draft else None
        # chokes when no curr_draft
        action = "ERROR"

        # if self.proposed_topics[0] or self.proposed_topics[1]:

        if self.state == "new":
            action = "Add Topics"
        elif self.state == "added_topics":  # State change may need added
            action = "Approve Topic"
        elif self.state == "in_progress":
            if existing_drafts != 0 and existing_drafts < num_of_drafts:
                if (s == "new") or (s == "in_progress"):
                    action = "Write"
                elif s == "submitted":
                    action = "Review"
                return "%s Draft %d / %d" % (
                    action,
                    existing_drafts,
                    num_of_drafts)
        elif curr_draft.is_final_draft and s == "reviewed":
            action = "Complete"
        else:
            action = "Error"
        return action


class ApplicationEssay(Essay):

    # inheritance
    __tablename__ = "application_essay"
    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields

    # relationships
    # theme_essays: don't explicitly declare it but it's here

    @property
    def selected_theme_essay(self):
        """
        Gets the ThemeEssay for which this ApplicationEssay is selected.
        """
        ste = [te for te in self.theme_essays if te.application_essay_states[self.id] == "selected"]
        assert len(ste) <= 1
        return ste[0] if ste[0] else None

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ApplicationEssay, self).process_before_create()
        app_essay_template = self.essay_template
        self.max_words = app_essay_template.max_words
        self.due_date = self.essay_template.due_date
        self.university = app_essay_template.university

class EssayStateAssociations(BaseModel):
    __tablename__ = 'essay_associations'

    ALLOWED_APP_ESSAY_STATES = ["selected","not_selected","pending"]

    @validates('state')
    def validate_app_essay_states(self, key, state):
        assert state in self.ALLOWED_APP_ESSAY_STATES
        return state

    application_essays = db.relationship(
        "ApplicationEssay",
        backref=db.backref("essay_associations", lazy="dynamic"))
    # theme_essays: don't explicitly declare it but it's here'

    # this needs to be a list?
    application_essay_id = db.Column(
        db.Integer,
        db.ForeignKey("application_essay.id"),
        primary_key=True),
    theme_essay_id = db.Column(
        db.Integer,
        db.ForeignKey("theme_essay.id"),
        primary_key=True),
    state = db.Column(db.String, default="pending")