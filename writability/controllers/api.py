"""
controllers.api
~~~~~~~~~~~~~~~

This module contains the Flask-RESTful hook and loads all api URLs.

"""
from flask.ext import restful

from resource.essay import EssayListResource, EssayResource, ThemeEssayListResource, ThemeEssayResource, \
    ApplicationEssayListResource, ApplicationEssayResource, EssayStateAssociationsResource
from resource.draft import DraftListResource, DraftResource
from resource.review import ReviewListResource, ReviewResource
from resource.university import UniversityListResource, UniversityResource
from resource.theme import ThemeListResource, ThemeResource
from resource.essay_template import EssayTemplateListResource, EssayTemplateResource, ThemeEssayTemplateListResource,\
    ThemeEssayTemplateResource, ApplicationEssayTemplateListResource, ApplicationEssayTemplateResource, \
    ChoiceGroupResource, ChoiceGroupListResource
from resource.user import UserListResource, UserResource, TeacherListResource, TeacherResource, StudentListResource, \
    StudentResource, InvitationListResource, InvitationResource
from resource.role import RoleListResource, RoleResource
from resource.annotation import AnnotationResource, AnnotationListResource, TagResource, TagListResource
from resource.add_universities import AddUniversitiesResource, SetEssayDisplayResource
from resource.rubric import RubricListResource, RubricResource, RubricCategoryResource, RubricCategoryListResource, \
    CriterionResource, CriterionListResource, RubricCategoryRubricAssociationsResource
from resource.special_program import SpecialProgramListResource, SpecialProgramResource, SpecialProgramSetResource


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

    # application essay state update
    api.add_resource(EssayStateAssociationsResource,
        "/essay-associations/<int:themeessay_id>-<int:appessay_id>")

    # draft
    add_resource_with_endpoint(api, DraftListResource, "/drafts")
    add_resource_with_endpoint(api, DraftResource, "/drafts/<int:id>")

    # review
    add_resource_with_endpoint(api, ReviewListResource, "/reviews")
    add_resource_with_endpoint(api, ReviewResource, "/reviews/<int:id>")

    # annotation
    add_resource_with_endpoint(api, AnnotationListResource, "/annotations")
    add_resource_with_endpoint(api, AnnotationResource, "/annotations/<int:id>")

    # tags
    add_resource_with_endpoint(api, TagListResource, "/tags")
    add_resource_with_endpoint(api, TagResource, "/tags/<int:id>")

    # university
    add_resource_with_endpoint(api, UniversityListResource, "/universities")
    add_resource_with_endpoint(
        api,
        UniversityResource,
        "/universities/<int:id>")

    # special program
    add_resource_with_endpoint(api, SpecialProgramListResource, "/special-programs")
    add_resource_with_endpoint(api, SpecialProgramResource, "/special-programs/<int:id>")

    # theme
    add_resource_with_endpoint(api, ThemeListResource, "/themes")
    add_resource_with_endpoint(api, ThemeResource, "/themes/<int:id>")

    # choice groups
    add_resource_with_endpoint(api, ChoiceGroupListResource, "/choice-groups")
    add_resource_with_endpoint(api, ChoiceGroupResource, "/choice-groups/<int:id>")

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
    add_resource_with_endpoint(api, AddUniversitiesResource,
                               "/students/<int:student_id>/add-universities")
    api.add_resource(SpecialProgramSetResource,
        "/students/<int:student_id>/special-programs/<int:sp_id>")
    api.add_resource(SetEssayDisplayResource,
        "/students/<int:student_id>/set-essay-display")

    # invitation
    add_resource_with_endpoint(api, InvitationListResource, "/invitations")
    add_resource_with_endpoint(
        api,
        InvitationResource,
        "/invitations/<int:id>")

    # role
    add_resource_with_endpoint(api, RoleListResource, "/roles")
    add_resource_with_endpoint(api, RoleResource, "/roles/<int:id>")

    # rubric, criterion
    add_resource_with_endpoint(api, RubricListResource, "/rubrics")
    add_resource_with_endpoint(api, RubricResource, "/rubrics/<int:id>")
    add_resource_with_endpoint(api, CriterionListResource, "/criteria")
    add_resource_with_endpoint(api, CriterionResource, "/criteria/<int:id>")
    add_resource_with_endpoint(api, RubricCategoryListResource, "/rubric-categories")
    add_resource_with_endpoint(api, RubricCategoryResource, "/rubric-categories/<int:id>")

    api.add_resource(RubricCategoryRubricAssociationsResource,
        "/rubric-associations/<int:rubric_id>-<int:rubric_category_id>")
