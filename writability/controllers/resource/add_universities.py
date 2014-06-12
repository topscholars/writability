import json
from flask import request
from flask.ext.restful import Resource
from .user import User
from models.db import db
from models.essay import ApplicationEssay, ThemeEssay
from models.essay_template import ApplicationEssayTemplate


class AddUniversitiesResource(Resource):

    @classmethod
    def get_endpoint(self):
        return 'add-universities'

    def _create(self, model, **kwargs):
        return model.create(kwargs)

    def _create_application_essay(self, student, application_essay_template):
        return self._create(ApplicationEssay,
                            student=student.id,
                            essay_template=application_essay_template.id)

    def _create_theme_essay(self, student, application_essay, theme):
        return self._create(ThemeEssay,
                            theme=theme.id,
                            application_essays=[application_essay.id],
                            essay_template=theme.theme_essay_template.id,
                            student=student.id,
                            state='new',
                            proposed_topics=['',''])

    def post(self, student_id):
        university_ids = json.loads(request.form.get('universities', '[]'))
        student = User.query.filter_by(id=student_id).first()
        required_application_essay_templates = []
        for university_id in university_ids:
            required_application_essay_templates.extend(
                ApplicationEssayTemplate.query.filter_by(university_id=university_id))
        existing_application_essay_template_ids = [application_essay.essay_template_id
            for application_essay in student.application_essays]
        application_essay_templates = [x for x in required_application_essay_templates
                                       if x.id not in existing_application_essay_template_ids]
        for application_essay_template in application_essay_templates:
            application_essay = self._create_application_essay(student, application_essay_template)
            db.session.add(application_essay)
            db.session.flush()
            db.session.refresh(application_essay)   # make sure 'id' field is set properly
            for theme in application_essay_template.themes:
                db.session.add(self._create_theme_essay(student, application_essay, theme))
        if len(application_essay_templates) > 0:
            db.session.commit()
        return 'OK ' + str(len(application_essay_templates))
