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
            application_essay = ApplicationEssay(essay_template=application_essay_template,
                                                 essay_prompt=application_essay_template.essay_prompt,
                                                 student_id=student.id)
            db.session.add(application_essay)
            for theme in application_essay_template.themes:
                theme_essay = ThemeEssay(theme_id=theme.id,
                                         essay_prompt=application_essay_template.essay_prompt,
                                         student_id=student.id)
                db.session.add(theme_essay)
            db.session.commit()
        return 'OK ' + str(len(application_essay_templates))
