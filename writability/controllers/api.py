# ----------------------------------------------------------------------------#
# API Controllers
# ----------------------------------------------------------------------------#
from flask.ext import restful
from resource.essay import EssaysListResource, EssayResource


def add_resource_with_endpoint(api, resource_class, path):
    api.add_resource(
        resource_class,
        path,
        endpoint=resource_class.my_endpoint)


def initialize(app, api_prefix):

    # TODO: Add version numbers to API
    # version_prefix= "/v00.06"
    version_prefix = ""
    prefix = api_prefix + version_prefix
    api = restful.Api(app, prefix=prefix)

    add_resource_with_endpoint(api, EssaysListResource, "/essays")
    add_resource_with_endpoint(api, EssayResource, "/essays/<int:id>")
