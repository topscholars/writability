import json
from flask import request
from flask.ext.restful import Resource
from .user import User
from models.db import db
from models.essay import ApplicationEssay
from models.essay_template import ApplicationEssayTemplate


class AddUniversitiesResource(Resource):

    @classmethod
    def get_endpoint(self):
        return 'add-universities'

    def post(self, student_id):
        university_ids = json.loads(request.form.get('universities', '[]'))
        student = User.query.filter_by(id=student_id).first()
        required_application_essay_template_ids = []
        for university_id in university_ids:
            application_essay_templates = ApplicationEssayTemplate.query.filter_by(university_id=university_id)
            required_application_essay_template_ids.extend([x.id for x in application_essay_templates])
        existing_application_essay_template_ids = [application_essay.essay_template_id
            for application_essay in student.application_essays]
        application_essay_template_ids = (set(required_application_essay_template_ids)
                                        - set(existing_application_essay_template_ids))
        for application_essay_template_id in application_essay_template_ids:
            application_essay = ApplicationEssay(essay_template_id=application_essay_template_id,
                                                 student_id=student.id,
                                                 essay_prompt='NORMALIZE?') # prompt is already in the template...
            db.session.add(application_essay)
            # TODO: Foreach theme in the ApplicationEssay, create a ThemeEssay
            db.session.commit()
            pass
        return 'OK ' + str(application_essay_template_ids)
