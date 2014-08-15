#!/usr/bin/env python

import os
import json
import requests
from BeautifulSoup import BeautifulSoup

base_dir = os.path.dirname(os.path.abspath(__file__))

## HEROKU_* vars are manually set on prod and staging.
if 'HEROKU_PROD' in os.environ:
    HOST = "http://writability-prod.herokuapp.com/"
elif 'HEROKU_DEV' in os.environ:
    HOST = "http://writability-dev.herokuapp.com/"
elif 'HEROKU_STG' in os.environ:
    HOST = "http://writability-staging.herokuapp.com/"
else:
    HOST = "http://localhost:5000/"

ROOT_URL = HOST + "api/"
HEADERS = {'Content-type': 'application/json'}


class Populator(object):

    _PATH = None
    _FILE_PATH = None

    def __init__(self):
        self._wins = []
        self._losses = []

        f = open(os.path.join(base_dir, self._FILE_PATH), "r")
        file = f.read()

        for obj in self._parse_file_into_objects(file):
            payload = self._construct_payload(obj)
            if payload:
                title = self._get_title(payload)

                is_success = self._populate_db(payload)

                if is_success:
                    self._wins.append(title)
                else:
                    self._losses.append(title)
            else:
                self._losses.append('mystery')

        self._print_outcome()

    def _parse_file_into_objects(self, file):
        objects = [line for line in file.splitlines() if line]
        return objects

    def _populate_db(self, payload):
        resp = requests.post(
            self._get_url(),
            data=json.dumps(payload),
            headers=HEADERS)

        if resp.status_code != 201:
            return False

        return True

    def _print_outcome(self):
        print "Total: ", len(self._wins) + len(self._losses)
        print "# wins: ", len(self._wins)
        print "# losses: ", len(self._losses)
        print "--------"
        print "wins\n", self._wins
        print "losses\n", self._losses

    def _get_url(self):
        return ROOT_URL + self._PATH

    def _get_field_with_query_url(self, query_url, object_type, field):
        resp = requests.get(query_url)

        if resp.status_code != 200:
            return False

        item = resp.json()

        if not item[object_type]:
            return False

        return item[object_type][0][field]


class JsonPopulator(Populator):

    _OBJECT_NAME = None

    def _parse_file_into_objects(self, file):
        return json.loads(file)

    def _construct_payload(self, obj):
        return {self._OBJECT_NAME: obj}


class RolePopulator(Populator):

    _PATH = "roles"
    _FILE_PATH = "data/roles.txt"

    def _construct_payload(self, line):
        payload = {"role": {"name": line}}
        return payload

    def _get_title(self, payload):
        return payload["role"]["name"]


class UniversityPopulator(Populator):

    _PATH = "universities"
    _FILE_PATH = "data/universities.txt"

    def _construct_payload(self, line):
        payload = {"university": {"name": line}}
        return payload

    def _get_title(self, payload):
        return payload["university"]["name"]


class ThemePopulator(Populator):

    _PATH = "themes"
    _FILE_PATH = "data/themes_new.txt"

    def _construct_payload(self, line):
        tokens = line.split(' ', 1)
        category = tokens[0].strip()
        theme = tokens[1].strip()

        payload = {
            "theme": {
                "name": theme,
                "category": category
            }
        }

        return payload

    def _get_title(self, payload):
        return payload["theme"]["name"]

class TagPopulator(Populator):

    _PATH = "tags"
    _FILE_PATH = "data/tags.csv"

    def _construct_payload(self, line):
        tokens = line.split('\t')
        name = tokens[0].strip()
        tag_type = tokens[1].strip()
        category = tokens[2].strip()
        description = tokens[3].strip()
        super_category = tokens[4].strip()

        payload = {
            "tag": {
                "name" : name,
                "tag_type" : tag_type,
                "category" : category,
                "description" : description,
                "super_category" : super_category
            }
        }

        return payload

    def _get_title(self, payload):
        return payload["tag"]["name"]

class CriteriaPopulator(Populator):

    _PATH = "criteria"
    _FILE_PATH = "data/rubric-criteria.csv"

    def _construct_payload(self, line):
        tokens = line.split('\t')
        name = tokens[0].strip()
        tag_type = tokens[1].strip()
        category = tokens[2].strip()
        description = tokens[3].strip()
        super_category = tokens[4].strip()

        payload = {
            "criterion": {
                "name" : name,
                "tag_type" : tag_type,
                "category" : category,
                "description" : description,
                "super_category" : super_category,
                "rubriccategory": None
            }
        }

        return payload

    def _get_title(self, payload):
        return payload["criterion"]["name"]

class RubricCategoryPopulator(Populator):

    _PATH = "rubric-categories"
    _FILE_PATH = "data/rubric_categories.txt"

    def _construct_payload(self, line):
        tokens = line.split('\t')
        name = tokens[0].strip()
        help_text = tokens[1].strip()

        payload = {
            "rubric-category": {
                "name" : name,
                "help_text" : help_text
            }
        }

        return payload

    def _get_title(self, payload):
        return payload["rubric-category"]["name"]

class ThemeEssayTemplatePopulator(Populator):

    _PATH = "theme-essay-templates"
    _FILE_PATH = "data/theme-essay-templates.csv"

    def _construct_payload(self, line):
        columns = line.split(',', 3)

        # theme
        category = columns[0].strip()
        name = columns[1].strip()
        theme_id = self._get_theme_id(name, category)

        # audience
        audience = columns[2].replace(";", ",").strip()

        # context
        context = ""

        # essay_prompt
        essay_prompt = columns[3][:-1].strip()

        payload = {
            "theme_essay_template": {
                "theme": theme_id,
                "audience": audience,
                "context": context,
                "essay_prompt": essay_prompt
            }
        }

        return payload

    def _get_theme_id(self, theme_name, category_name):
        _THEME_QUERY_URL = "{}themes?".format(ROOT_URL)
        _QUERY_STRING = "name={}&category={}".format(theme_name, category_name)
        url = _THEME_QUERY_URL + _QUERY_STRING

        return self._get_field_with_query_url(url, "themes", "id")

    def _get_title(self, payload):
        return payload["theme_essay_template"]["essay_prompt"][0:20]


class ApplicationEssayTemplatePopulator(Populator):

    _PATH = "application-essay-templates"
    _FILE_PATH = "data/application-essay-templates.csv"

    def _construct_payload(self, line):
        columns = line.split('\t', 8)

        # university
        uni = columns[0].strip()
        uni_id = self._get_uni_id(uni)

        # max words
        max_chars = columns[1].strip()
        max_words = columns[2].strip()
        if not max_words:
            try:
                max_words = int(max_chars) / 5
            except ValueError:
                max_words = 0
        try:
            max_words = int(max_words)
        except ValueError:
            max_words = 0

        # theme
        themecats = columns[3].split(';')
        themes = []
        for tc in themecats:
            try:
                tokens = tc.split('-')
                category = tokens[0].strip()
                name = tokens[1].strip()
                theme_id = self._get_theme_id(name, category)
                if theme_id:
                    themes.append(theme_id)
            except IndexError:
                pass
        # if not themes:
        #     return False

        # special program
        special_program = columns[4].strip()
        sp_id = self._add_or_get_special_program(special_program,uni_id)

        # requirement type
        requirement_type = columns[5].strip()

        # # choice group
        choice_group_id = columns[6].strip()
        num_required_essays = columns[7].strip()
        if choice_group_id and choice_group_id != '':
            internal_cg_id = self._add_or_get_choice_group(choice_group_id,num_required_essays,uni_id)
        else:
            internal_cg_id = None
        # essay_prompt
        essay_prompt = columns[8].strip().strip("\"")

        payload = {
            "application_essay_template": {
                "university": uni_id,
                "max_words": max_words,
                "themes": themes,
                "essay_prompt": essay_prompt,
                "special_program": sp_id,
                "requirement_type": requirement_type,
                "choice_group": internal_cg_id
            }
        }

        return payload

    def _add_or_get_special_program(self, special_program, uni_id):
        if special_program:
            _QUERY_URL = "{}special-programs?".format(ROOT_URL)
            _QUERY_STRING = "name={}".format(special_program)
            url = _QUERY_URL + _QUERY_STRING

            sp_id = self._get_field_with_query_url(url, "special_programs", "id")

            if sp_id:
                return sp_id
            else:
                payload = {
                    "special_program" : {
                        "name" : special_program,
                        "description": special_program,
                        "university": uni_id
                     }
                }
                resp = requests.post(
                    url,
                    data=json.dumps(payload),
                    headers=HEADERS)

                if resp.status_code != 201:
                    return None

                sp_id = self._get_field_with_query_url(url, "special_programs", "id")

                return sp_id
        else:
            return None

    def _add_or_get_choice_group(self, choice_group_id, num_required_essays, uni_id):
        if choice_group_id:
            _QUERY_URL = "{}choice-groups?".format(ROOT_URL)
            _QUERY_STRING = "cg_id={}&university_id={}".format(choice_group_id,uni_id)
            url = _QUERY_URL + _QUERY_STRING

            cg_id = self._get_field_with_query_url(url, "choice_groups", "id")

            if cg_id:
                return cg_id
            else:
                payload = {
                    "choice_group" : {
                        "cg_id" : choice_group_id,
                        "num_required_essays": num_required_essays,
                        "university": uni_id
                     }
                }
                resp = requests.post(
                    url,
                    data=json.dumps(payload),
                    headers=HEADERS)

                if resp.status_code != 201:
                    return None

                cg_id = self._get_field_with_query_url(url, "choice_groups", "id")

                return cg_id
        else:
            return None

    def _get_theme_id(self, theme_name, category_name):
        _THEME_QUERY_URL = "{}themes?".format(ROOT_URL)
        _QUERY_STRING = "name={}&category={}".format(theme_name, category_name)
        url = _THEME_QUERY_URL + _QUERY_STRING

        return self._get_field_with_query_url(url, "themes", "id")

    def _get_uni_id(self, uni_name):
        _UNI_QUERY_URL = "{}universities?".format(ROOT_URL)
        _QUERY_STRING = "name=" + uni_name
        url = _UNI_QUERY_URL + _QUERY_STRING

        return self._get_field_with_query_url(url, "universities", "id")

    def _get_title(self, payload):
        return payload["application_essay_template"]["essay_prompt"][0:20]


class UserPopulator(JsonPopulator):

    _PATH = "users"
    _FILE_PATH = "data/users.json"
    _OBJECT_NAME = "user"
    _REGISTER_FORM_PATH = "register"

    def _construct_payload(self, obj):
        # Flask-Security requires us to create a user using a form request
        # get the CSRF and session cookies
        register_url = HOST + self._REGISTER_FORM_PATH
        resp = requests.get(register_url)
        obj["session_cookie"] = resp.cookies["session"]
        soup = BeautifulSoup(resp.text)
        obj[u"csrf_token"] = soup.find(id="csrf_token")["value"]

        # create the other necessary parts of the form
        obj[u"password_confirm"] = obj["password"]
        obj[u"submit"] = "Register"

        # don't call super because you don't want a nested obj
        return obj

    def _populate_db(self, payload):
        # setup the session cookie
        cookies_dict = {"session": payload["session_cookie"]}
        del payload["session_cookie"]

        # allow_redirect=False gives you the first status_code
        resp = requests.post(
            HOST + self._REGISTER_FORM_PATH,
            data=payload,
            cookies=cookies_dict,
            allow_redirects=False)

        # if success then do a PUT to add the properties /register doesn't
        # accept
        if resp.status_code != 302:
            return False
        else:
            new_cookie_dict = {"session": resp.cookies["session"]}
            # get the newly created id
            id_resp = requests.get(
                self._get_url() + "/0",
                cookies=new_cookie_dict)
            id = id_resp.json()["user"]["id"]
            is_success = self._setup_user(id, payload, new_cookie_dict)
            return is_success

        return True

    def _get_title(self, payload):
        return "{} {}".format(
            payload["first_name"],
            payload["last_name"])

    def _setup_user(self, user_id, payload, authenticated_cookies):
        # setup the dict for the PUT request
        if "password" in payload:
            del payload["password"]
        if "password_confirm" in payload:
            del payload["password_confirm"]
        if "roles" in payload and 2 in payload["roles"]:
            payload["teacher"] = self.teacher_id
        user_payload = {"user": payload}

        # add the missing parameters here through an API put request
        put_url = "{}/{}".format(self._get_url(), user_id)
        put_resp = requests.put(
            put_url,
            cookies=authenticated_cookies,
            data=json.dumps(user_payload),
            headers=HEADERS)
        if put_resp.status_code != 200:
            return False
        # if student then add essays for the universities
        elif 2 in payload["roles"]:
            return self._add_essays_to_student(
                user_id,
                payload["universities"])
        else:
            self.teacher_id = user_id

        return True

    def _add_essays_to_student(self, student_id, uni_ids):
        # for each university get a list of application essay templates
        application_essay_template_ids = []
        for uni_id in uni_ids:
            uni_url = "{}universities/{}".format(ROOT_URL, uni_id)
            uni_resp = requests.get(uni_url)
            if uni_resp.status_code != 200:
                return False
            uni = uni_resp.json()["university"]
            application_essay_template_ids += uni[
                "application_essay_templates"]

        # for each application essay template, create an application essay
        application_essays = []
        for app_essay_template_id in application_essay_template_ids:
            app_essay_url = "{}application-essays".format(ROOT_URL)
            app_essay_payload = {
                "application_essay": {
                    "student": student_id,
                    "essay_template": app_essay_template_id
                }
            }
            app_essay_resp = requests.post(
                app_essay_url,
                data=json.dumps(app_essay_payload),
                headers=HEADERS)
            if app_essay_resp.status_code != 201:
                return False
            app_essay = app_essay_resp.json()["application_essay"]
            application_essays.append(app_essay)

        # group application essays by theme_id from essay templates
        app_essay_ids_by_theme_id = {}
        for app_essay in application_essays:
            app_essay_template_id = app_essay["essay_template"]
            app_essay_template_url = "{}application-essay-templates/{}".format(
                ROOT_URL,
                app_essay_template_id)
            app_essay_template_resp = requests.get(app_essay_template_url)
            if app_essay_template_resp.status_code != 200:
                return False
            app_essay_template = app_essay_template_resp.json()[
                "application_essay_template"]
            app_essay_id = app_essay["id"]
            for theme_id in app_essay_template["themes"]:
                if theme_id in app_essay_ids_by_theme_id:
                    app_essay_ids_by_theme_id[theme_id].append(app_essay_id)
                else:
                    app_essay_ids_by_theme_id[theme_id] = [app_essay_id]

        # get the themes for each theme_id
        themes = []
        for theme_id in app_essay_ids_by_theme_id.keys():
            theme_url = "{}themes/{}".format(ROOT_URL, theme_id)
            theme_resp = requests.get(theme_url)
            if theme_resp.status_code != 200:
                return False
            theme = theme_resp.json()["theme"]
            themes.append(theme)

        # for each theme create a theme essay using the template id and attach
        # application essays as ids
        theme_essays = []
        for theme in themes:
            theme_essay_template_id = theme["theme_essay_template"]
            theme_id = theme["id"]
            application_essay_ids = app_essay_ids_by_theme_id[theme_id]
            theme_essay_url = "{}theme-essays".format(ROOT_URL)
            theme_essay_payload = {
                "theme_essay": {
                    "essay_template": theme_essay_template_id,
                    "student": student_id,
                    "due_date": "2014-07-06",
                    "application_essays": application_essay_ids,
                    "num_of_drafts": 5
                }
            }
            theme_essay_resp = requests.post(
                theme_essay_url,
                data=json.dumps(theme_essay_payload),
                headers=HEADERS)
            if theme_essay_resp.status_code != 201:
                return False
            theme_essay = theme_essay_resp.json()["theme_essay"]
            theme_essays.append(theme_essay)

        return True


class ThemeEssayPopulator(JsonPopulator):

    _PATH = "theme-essays"
    _FILE_PATH = "data/theme_essays.json"
    _OBJECT_NAME = "theme_essay"

    def _construct_payload(self, obj):
        # theme
        name = obj["theme"]["name"]
        category = obj["theme"]["category"]
        obj["essay_template"] = self._get_theme_essay_template_id(
            name,
            category)
        del obj["theme"]

        return super(ThemeEssayPopulator, self)._construct_payload(obj)

    def _get_theme_essay_template_id(self, theme_name, category_name):
        _THEME_QUERY_URL = "{}themes?".format(ROOT_URL)
        _QUERY_STRING = "name={}&category={}".format(theme_name, category_name)
        url = _THEME_QUERY_URL + _QUERY_STRING

        theme_essay_template_id = self._get_field_with_query_url(
            url,
            "themes",
            "theme_essay_template")
        return theme_essay_template_id

    def _get_title(self, payload):
        return payload["theme_essay"]["due_date"]


class DraftPopulator(JsonPopulator):

    _PATH = "drafts"
    _FILE_PATH = "data/drafts.json"
    _OBJECT_NAME = "draft"

    def _get_title(self, payload):
        return payload["draft"]["formatted_text"][0:40]


class ReviewPopulator(JsonPopulator):

    _PATH = "reviews"
    _FILE_PATH = "data/reviews.json"
    _OBJECT_NAME = "review"

    def _get_title(self, payload):
        return payload["review"]["text"][0:40]


class AnnotationPopulator(JsonPopulator):

    # Note: this only works for loading annotations for review with id=0
    _PATH = "reviews/0/annotations"
    _FILE_PATH = "data/annotations.json"
    _OBJECT_NAME = "annotation"

    def _get_title(self, payload):
        return payload["annotation"]["comment"][0:40]


def delete_users():
    users_url = "{}users".format(ROOT_URL)
    users = requests.get(users_url)
    for user in users.json()["users"]:
        delete_user_url = "{}/{}".format(users_url, user["id"])
        requests.delete(delete_user_url)


def populate_db():
    RubricCategoryPopulator()
    CriteriaPopulator()

def populate_test_data():
    ## For deploy Aug 2
    #  # predefined
    RolePopulator()
    UniversityPopulator()
    ThemePopulator()
    ThemeEssayTemplatePopulator()
    ApplicationEssayTemplatePopulator()
    TagPopulator()
    #  # custom data
    delete_users()
    UserPopulator()
    #  DraftPopulator()
    #  ReviewPopulator()
    #  AnnotationPopulator()

import sys

for arg in sys.argv:
    if arg in ('--dev'):
        populate_test_data()

populate_db()
# ApplicationEssayTemplatePopulator()
