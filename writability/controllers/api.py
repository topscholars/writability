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
from resource.essay_template import EssayTemplateListResource
from resource.essay_template import EssayTemplateResource
from resource.essay_template import ThemeEssayTemplateListResource
from resource.essay_template import ThemeEssayTemplateResource
from resource.essay_template import ApplicationEssayTemplateListResource
from resource.essay_template import ApplicationEssayTemplateResource
from resource.user import UserListResource, UserResource
from resource.user import TeacherListResource, TeacherResource
from resource.user import StudentListResource, StudentResource


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

    # essay
    add_resource_with_endpoint(api, EssayListResource, "/essays")
    add_resource_with_endpoint(api, EssayResource, "/essays/<int:id>")

    # theme essay
    add_resource_with_endpoint(api, ThemeEssayListResource, "/theme-essays")
    add_resource_with_endpoint(
        api,
        ThemeEssayResource,
        "/theme-essays/<int:id>")

    # application essay
    add_resource_with_endpoint(
        api,
        ApplicationEssayListResource,
        "/application-essays")
    add_resource_with_endpoint(
        api,
        ApplicationEssayResource,
        "/application-essays/<int:id>")

    # draft
    add_resource_with_endpoint(api, DraftListResource, "/drafts")
    add_resource_with_endpoint(api, DraftResource, "/drafts/<int:id>")

    # university
    add_resource_with_endpoint(api, UniversityListResource, "/universities")
    add_resource_with_endpoint(
        api,
        UniversityResource,
        "/universities/<int:id>")

    # theme
    add_resource_with_endpoint(api, ThemeListResource, "/themes")
    add_resource_with_endpoint(api, ThemeResource, "/themes/<int:id>")

    # essay template
    add_resource_with_endpoint(
        api,
        EssayTemplateListResource,
        "/essay-templates")
    add_resource_with_endpoint(
        api,
        EssayTemplateResource,
        "/essay-templates/<int:id>")

    # theme essay template
    add_resource_with_endpoint(
        api,
        ThemeEssayTemplateListResource, "/theme-essay-templates")
    add_resource_with_endpoint(
        api,
        ThemeEssayTemplateResource,
        "/theme-essay-templates/<int:id>")

    # application essay template
    add_resource_with_endpoint(
        api,
        ApplicationEssayTemplateListResource,
        "/application-essay-templates")
    add_resource_with_endpoint(
        api,
        ApplicationEssayTemplateResource,
        "/application-essay-templates/<int:id>")

    # user
    add_resource_with_endpoint(api, UserListResource, "/users")
    add_resource_with_endpoint(api, UserResource, "/users/<int:id>")

    # teacher
    add_resource_with_endpoint(api, TeacherListResource, "/teachers")
    add_resource_with_endpoint(api, TeacherResource, "/teachers/<int:id>")

    # student
    add_resource_with_endpoint(api, StudentListResource, "/students")
    add_resource_with_endpoint(api, StudentResource, "/students/<int:id>")
