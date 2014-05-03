"""
controllers.api
~~~~~~~~~~~~~~~

This module contains the Flask-RESTful hook and loads all api URLs.

"""
from flask.ext import restful
from resource.essay import EssayListResource, EssayResource
from resource.essay import ThemeEssayListResource, ThemeEssayResource
from resource.essay import ApplicationEssayListResource
from resource.essay import ApplicationEssayResource
from resource.draft import DraftListResource, DraftResource
from resource.university import UniversityListResource, UniversityResource
from resource.theme import ThemeListResource, ThemeResource


def add_resource_with_endpoint(api, resource_class, path):
    """Help add a resource by standardizing the external interation."""
    api.add_resource(
        resource_class,
        path,
        endpoint=resource_class.get_endpoint())


def initialize(app, api_prefix):
    """Initialize Flask-RESTful API after the application is initialized."""
    # TODO: Add version numbers to API
    # version_prefix= "/v00.06"
    version_prefix = ""
    prefix = api_prefix + version_prefix
    api = restful.Api(app, prefix=prefix)

    add_resource_with_endpoint(api, EssayListResource, "/essays")
    add_resource_with_endpoint(api, EssayResource, "/essays/<int:id>")
    add_resource_with_endpoint(api, ThemeEssayListResource, "/theme-essays")
    add_resource_with_endpoint(
        api,
        ThemeEssayResource,
        "/theme-essays/<int:id>")
    add_resource_with_endpoint(
        api,
        ApplicationEssayListResource,
        "/application-essays")
    add_resource_with_endpoint(
        api,
        ApplicationEssayResource,
        "/application-essays/<int:id>")
    add_resource_with_endpoint(api, DraftListResource, "/drafts")
    add_resource_with_endpoint(api, DraftResource, "/drafts/<int:id>")
    add_resource_with_endpoint(api, UniversityListResource, "/universities")
    add_resource_with_endpoint(
        api,
        UniversityResource,
        "/universities/<int:id>")
    add_resource_with_endpoint(api, ThemeListResource, "/themes")
    add_resource_with_endpoint(api, ThemeResource, "/themes/<int:id>")
