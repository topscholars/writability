#!/usr/bin/env python

import json
import requests

root_url = "http://localhost:5000/api/"
headers = {'Content-type': 'application/json'}


def populate_universities():
    path = "universities"
    url = root_url + path
    f = open('data/universities.txt', 'r')

    wins = []
    losses = []

    lines = f.read().splitlines()

    for uni in lines:
        payload = {"university": {"name": uni}}
        resp = requests.post(
            url,
            data=json.dumps(payload),
            headers=headers)
        if resp.status_code == 201:
            wins.append(uni)
        else:
            losses.append(uni)

    print "Total: ", len(wins) + len(losses)
    print "# wins: ", len(wins)
    print "# losses: ", len(losses)
    print "--------"
    print "wins\n", wins
    print "losses\n", losses


def populate_themes():
    path = "themes"
    url = root_url + path
    f = open('data/themes.txt', 'r')

    wins = []
    losses = []

    lines = f.read().splitlines()

    for line in lines:
        if line:
            tokens = line.split(' ', 1)
            category = tokens[0].strip()
            theme = tokens[1].strip()

            payload = {
                "theme": {
                    "name": theme,
                    "category": category
                }
            }

            resp = requests.post(
                url,
                data=json.dumps(payload),
                headers=headers)
            if resp.status_code == 201:
                wins.append(theme)
            else:

                losses.append(theme)

    print "Total: ", len(wins) + len(losses)
    print "# wins: ", len(wins)
    print "# losses: ", len(losses)
    print "--------"
    print "wins\n", wins
    print "losses\n", losses


def populate_db():
    # populate_universities()
    populate_themes()


populate_db()
