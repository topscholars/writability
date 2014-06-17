import json
from flask import request
from flask.ext.restful import Resource
from .user import User
from models.db import db
from models.essay import ApplicationEssay, ThemeEssay
from models.user import User
from models.essay_template import ApplicationEssayTemplate, ThemeEssayTemplate


class AddUniversitiesResource(Resource):

    @classmethod
    def get_endpoint(self):
        return 'add-universities'

    def _create(self, model, **kwargs):
        return model.create(kwargs)

    def _update(self, model, id, **kwargs):
        return model.update(id, kwargs)

    def _create_application_essay(self, student, application_essay_template):
        return self._create(ApplicationEssay,
                            student=student.id,
                            essay_template=application_essay_template.id)

    def _create_theme_essay(self, student, application_essays, theme):
        essay_template_id = ThemeEssayTemplate.read_by_filter({'theme_id':theme})[0].id
        existing_theme_essay = ThemeEssay.read_by_filter({'student_id':student.id, 'essay_template_id': essay_template_id})[0]
        if existing_theme_essay:
            app_essays = existing_theme_essay.application_essays
            app_essays.extend(application_essays)
            return self._update(ThemeEssay,existing_theme_essay.id,
                            theme=theme,
                            application_essays=app_essays,
                            essay_template=essay_template_id,
                            student=student.id,
                            state='new',
                            proposed_topics=['',''])
        return self._create(ThemeEssay,
                            theme=theme,
                            application_essays=application_essays,
                            essay_template=essay_template_id,
                            student=student.id,
                            state='new',
                            proposed_topics=['',''])

    def post(self, student_id):       
        university_ids = request.get_json().get('universities')
        if university_ids is None:
            return 'Missing "universities" parameter in JSON request', 400
        student = User.query.filter_by(id=student_id).first()
        required_application_essay_templates = []
        for university_id in university_ids:
            required_application_essay_templates.extend(
                ApplicationEssayTemplate.query.filter_by(university_id=university_id))
        existing_application_essay_template_ids = [application_essay.essay_template_id
            for application_essay in student.application_essays]
        application_essay_templates = [x for x in required_application_essay_templates
                                       if x.id not in existing_application_essay_template_ids]

        current_user=User.read(student_id)
        all_themes = set([te.theme.id for te in current_user.theme_essays])

        app_essay_list = [] # (app_essay, [theme1,theme2,etc])
        for application_essay_template in application_essay_templates:
            application_essay = self._create_application_essay(student, application_essay_template)
            db.session.add(application_essay)
            db.session.flush()
            db.session.refresh(application_essay)   # make sure 'id' field is set properly

            # get set of themes and list of app essays for theme essay output
            app_essay_list.append((application_essay, [t.id for t in application_essay_template.themes]))
            for theme in application_essay_template.themes:
                all_themes.add(theme.id)

        for theme in all_themes:
            ae_list = [ae[0].id for ae in app_essay_list if theme in ae[1]]
            db.session.add(self._create_theme_essay(student, ae_list, theme))

        if len(application_essay_templates) > 0:
            db.session.commit()
        return 'OK ' + str(len(application_essay_templates))
