"""
models.essay
~~~~~~~~~~~~

This module contains an abstract Essay and its subclasses, ThemeEssay and
ApplicationEssay. A ThemeEssay is the essay the students first write. An
ApplicationEssay is the essay the students write for a specific Application.

Essays have a series of Drafts that the Student writes.

"""
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from .db import db
from .base import BaseModel, StatefulModel
from .fields import SerializableStringList
from .draft import Draft


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
    is_displayed = db.Column(db.Boolean, default=True)

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
        self.num_of_drafts = self.num_of_drafts or 3

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

    @property
    def next_action(self):
        """Return next action to be taken on essay."""
        drafts = self.drafts
        existing_drafts = self.existing_drafts
        num_of_drafts = self.num_of_drafts
        curr_draft = self.current_draft
        s = curr_draft.state if curr_draft else None
        # chokes when no curr_draft
        action = "ERROR"
        # if self.proposed_topics[0] or self.proposed_topics[1]:
        if self.state == "new":
            if self.isTheme():
                action = "Add Topics"
            elif self.isApplication():
                action = "Write"
                return "%s Draft %d / %d" % (
                    action,
                    existing_drafts or 0,
                    num_of_drafts or 0)
        elif self.state == "added_topics":  # State change may need added
            action = "Approve Topic"
        elif self.state == "in_progress":
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

    @property
    def existing_drafts(self):
        return len(self.drafts)


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

    essay_associations = db.relationship(
        "EssayStateAssociations",
        backref=db.backref("theme_essay"))

    application_essays = association_proxy('essay_associations', 'application_essay',
                                           creator=lambda app_essay: EssayStateAssociations(
                                               application_essay=app_essay))

    @validates('proposed_topics')
    def validate_proposed_topics(self, key, proposed_topics):
        assert len(proposed_topics) == 2
        return proposed_topics

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ThemeEssay, self).process_before_create()
        theme_essay_template = self.essay_template
        self.audience = theme_essay_template.audience
        self.context = theme_essay_template.context
        self.theme = theme_essay_template.theme
        # set a default number of drafts here for now
        for ea in self.essay_associations:
            ea.state = "pending"

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

            self.drafts.append(Draft(**new_draft_params))

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


class ApplicationEssay(StatefulModel, Essay):
    # inheritance
    __tablename__ = "application_essay"
    __mapper_args__ = {'polymorphic_identity': 'application_essay'}

    _STATES = ["new", "in_progress", "completed"]

    # required fields
    id = db.Column(db.Integer, db.ForeignKey('essay.id'), primary_key=True)

    # optional fields
    onboarding_is_selected = db.Column(db.Boolean, nullable=False, default=False)

    # relationships
    theme_essays = association_proxy('essay_associations', 'theme_essay')

    def change_related_objects(self):
        super(ApplicationEssay, self).change_related_objects()
        if self.state == "new" and self.is_displayed and not self.drafts:
            new_draft_params = {
                "essay": self
            }

            self.drafts.append(Draft(**new_draft_params))

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "new": ["in_progress"],
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
    def university_name(self):
        return self.essay_template.university.name

    @property
    def selected_theme_essay(self):
        """
        Gets the ThemeEssay for which this ApplicationEssay is selected.
        """
        for ea in self.essay_associations:
            if ea.state == "selected":
                return ea.theme_essay

    def process_before_create(self):
        """Process model to prepare it for adding it db."""
        super(ApplicationEssay, self).process_before_create()
        app_essay_template = self.essay_template
        self.max_words = app_essay_template.max_words
        self.due_date = self.essay_template.due_date
        self.university = app_essay_template.university


class EssayStateAssociations(StatefulModel):
    __tablename__ = 'essay_associations'
    # __table_args__ = {'extend_existing': True} #Because table is defined in relationships.py

    _STATES = ["selected", "not_selected", "pending"]

    def __init__(self, **object_dict):
        super(StatefulModel, self).__init__(**object_dict)
        # if the object is new (no id) and has no state, give it one.
        if not (self.application_essay_id and self.theme_essay_id) and not self.state:
            self.state = self._get_default_state()

    def _get_next_states(self, state):
        """Helper function to have subclasses decide next states."""
        next_states_mapping = {
            "pending": ["selected", "not_selected"],
            "selected": ["not_selected"],
            "not_selected": ["selected"]
        }
        return next_states_mapping[state]

    def _get_default_state(self):
        """Get the default new state."""
        return "pending"

    def _get_initial_states(self):
        """Get the allowed initial states."""
        return ["pending"]

    @classmethod
    def read(class_, application_essay_id, theme_essay_id):
        return class_.query.filter(class_.application_essay_id == application_essay_id).filter(
            class_.theme_essay_id == theme_essay_id).first()

    @classmethod
    def update(class_, application_essay_id, theme_essay_id, updated_dict):
        model = class_.read(application_essay_id, theme_essay_id)
        db.session.add(model)

        prepared_dict = class_._replace_resource_ids_with_models(updated_dict)
        model.process_before_update(prepared_dict)
        for k, v in prepared_dict.items():
            # only update attributes that have changed
            try:
                if getattr(model, k) != v:
                    setattr(model, k, v)
            except AttributeError:
                setattr(model, k, v)

        model.change_related_objects()
        db.session.commit()

        return model

    application_essay = db.relationship(
        "ApplicationEssay",
        backref=db.backref("essay_associations"))  # , lazy="dynamic" -> removed
    # theme_essay: don't explicitly declare it but it's here'

    # this needs to be a list?
    application_essay_id = db.Column(
        db.Integer,
        db.ForeignKey("application_essay.id"),
        primary_key=True)
    theme_essay_id = db.Column(
        db.Integer,
        db.ForeignKey("theme_essay.id"),
        primary_key=True)

    def change_related_objects(self):
        """
        Change any related objects before commit.

        If an application essay state is "selected", go through all other
        theme essays and mark it "not_selected".

        """
        super(EssayStateAssociations, self).change_related_objects()

        # when an app essay is marked selected for this theme essay, mark the app essay
        # 'not_selected' for all other theme essays
        if self.state == "selected":
            for esa in EssayStateAssociations.read_by_filter({'application_essay_id': self.application_essay_id}):
                if esa.theme_essay_id != self.theme_essay_id:
                    esa.state = "not_selected"
