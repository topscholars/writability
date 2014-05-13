#!/usr/bin/env python

import json
import requests

ROOT_URL = "http://localhost:5000/api/"
HEADERS = {'Content-type': 'application/json'}


class Populator(object):

    _PATH = None
    _FILE_PATH = None

    def __init__(self):
        self._wins = []
        self._losses = []

        f = open(self._FILE_PATH, "r")
        lines = f.read().splitlines()

        for line in lines:
            if line:
                payload = self._construct_payload(line)
                title = self._get_title(payload)

                is_success = self._populate_db(payload)

                if is_success:
                    self._wins.append(title)
                else:
                    self._losses.append(title)

        self._print_outcome()

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

    def _get_id_with_query_url(self, query_url, object_type):
        resp = requests.get(query_url)

        if resp.status_code != 200:
            return False

        item = resp.json()

        return item[object_type][0]["id"]


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

        return self._get_id_with_query_url(url, "themes")

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

        # word count
        char_max = columns[1].strip()
        word_count = columns[2].strip()
        if not word_count:
            word_count = int(char_max) / 5
        word_count = int(word_count)

        # theme
        themecats = columns[3].split(';')
        themes = []
        for tc in themecats:
            tokens = tc.split('-')
            category = tokens[0].strip()
            name = tokens[1].strip()
            theme_id = self._get_theme_id(name, category)
            themes.append(theme_id)

        # essay_prompt
        essay_prompt = columns[4].strip().strip("\"")

        payload = {
            "application_essay_template": {
                "university": uni_id,
                "word_count": word_count,
                "themes": themes,
                "essay_prompt": essay_prompt
            }
        }

        return payload

    def _get_theme_id(self, theme_name, category_name):
        _THEME_QUERY_URL = "{}themes?".format(ROOT_URL)
        _QUERY_STRING = "name={}&category={}".format(theme_name, category_name)
        url = _THEME_QUERY_URL + _QUERY_STRING

        return self._get_id_with_query_url(url, "themes")

    def _get_uni_id(self, uni_name):
        _UNI_QUERY_URL = "{}universities?".format(ROOT_URL)
        _QUERY_STRING = "name=" + uni_name
        url = _UNI_QUERY_URL + _QUERY_STRING

        return self._get_id_with_query_url(url, "universities")

    def _get_title(self, payload):
        return payload["application_essay_template"]["essay_prompt"][0:20]


def populate_db():
    RolePopulator()
   #UniversityPopulator()
   #ThemePopulator()
   #ThemeEssayTemplatePopulator()
   #ApplicationEssayTemplatePopulator()


populate_db()
