# ----------------------------------------------------------------------------#
# API Controllers
# ----------------------------------------------------------------------------#
from flask.ext import restful
from resource.essay import EssayListResource, EssayResource
from resource.essay import ThemeEssayListResource, ThemeEssayResource
from resource.essay import ApplicationEssayListResource
from resource.essay import ApplicationEssayResource


def add_resource_with_endpoint(api, resource_class, path):
    api.add_resource(
        resource_class,
        path,
        endpoint=resource_class.get_endpoint())


def initialize(app, api_prefix):

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
