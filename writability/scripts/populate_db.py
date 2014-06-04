#!/usr/bin/env python

import os
import json
import requests
from BeautifulSoup import BeautifulSoup

base_dir = os.path.dirname(os.path.abspath(__file__))

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
    _FILE_PATH = "data/themes.txt"

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
        columns = line.split(',', 4)

        # university
        uni = columns[0].strip()
        uni_id = self._get_uni_id(uni)

        # max words
        max_chars = columns[1].strip()
        max_words = columns[2].strip()
        if not max_words:
            max_words = int(max_chars) / 5
        max_words = int(max_words)

        # theme
        themecats = columns[3].split(';')
        themes = []
        for tc in themecats:
            tokens = tc.split('-')
            category = tokens[0].strip()
            name = tokens[1].strip()
            theme_id = self._get_theme_id(name, category)
            if theme_id:
                themes.append(theme_id)
        if not themes:
            return False

        # essay_prompt
        essay_prompt = columns[4].strip().strip("\"")

        payload = {
            "application_essay_template": {
                "university": uni_id,
                "max_words": max_words,
                "themes": themes,
                "essay_prompt": essay_prompt
            }
        }

        return payload

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
            # setup the dict for the PUT request
            if "password" in payload:
                del payload["password"]
            if "password_confirm" in payload:
                del payload["password_confirm"]
            user_payload = {"user": payload}
            # add the missing parameters here through an API put request
            put_url = "{}/{}".format(self._get_url(), id)
            put_resp = requests.put(
                put_url,
                cookies=new_cookie_dict,
                data=json.dumps(user_payload),
                headers=HEADERS)

            if put_resp.status_code != 200:
                return False

        return True

    def _get_title(self, payload):
        return "{} {}".format(
            payload["first_name"],
            payload["last_name"])


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

        theme_essay_template_id = self._get_field_with_query_url(url, "themes",
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

def populate_db():
    # predefined
    RolePopulator()
    UniversityPopulator()
    ThemePopulator()
    ThemeEssayTemplatePopulator()
    ApplicationEssayTemplatePopulator()
    # custom data
    UserPopulator()
    ThemeEssayPopulator()
    DraftPopulator()


populate_db()
