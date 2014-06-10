"""
controllers.resource.user
~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource User, Teacher, Student. All Resources are
actually Users. Teachers and Students are different aspects of the same
resource.

"""
from flask.ext.restful import fields
from flask.ext.login import current_user

from models.user import User, Invitation

from .base import ResourceManager, ItemResource, ListResource
from .base import StatefulResourceManager
from .fields import ResourceField
import essay
import university
import role
import review


class UserResourceManager(StatefulResourceManager):

    item_resource_name = "user"
    list_resource_name = "users"
    model_class = User

    def _add_item_fields(self):
        super(UserResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "email": fields.String,
            "first_name": fields.String,
            "last_name": fields.String,
            "roles": fields.List(ResourceField(
                role.RoleResourceManager.item_resource_name,
                absolute=True))
        })


class UserResource(ItemResource):

    resource_manager_class = UserResourceManager

    def get(self, id):
        """Get requested user or if id==0, then get current_user."""
        if id == 0:
            id = current_user.id

        return super(UserResource, self).get(id)


class UserListResource(ListResource):

    resource_manager_class = UserResourceManager


class TeacherResourceManager(UserResourceManager):

    item_resource_name = "teacher"
    list_resource_name = "teachers"
    model_class = User

    def _add_item_fields(self):
        super(TeacherResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "students": fields.List(ResourceField(
                StudentResourceManager.item_resource_name,
                absolute=True)),
            "reviews": fields.List(ResourceField(
                review.ReviewResourceManager.item_resource_name,
                absolute=True)),
            "teacher_essays": fields.List(ResourceField(
                essay.ThemeEssayResourceManager.item_resource_name,
                absolute=True)),
            "invitations": fields.List(ResourceField(
                InvitationResourceManager.item_resource_name,
                absolute=True))
        })


class TeacherResource(UserResource):

    resource_manager_class = TeacherResourceManager


class TeacherListResource(UserListResource):

    resource_manager_class = TeacherResourceManager


class StudentResourceManager(UserResourceManager):

    item_resource_name = "student"
    list_resource_name = "students"
    model_class = User

    def _add_item_fields(self):
        super(StudentResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "teacher": ResourceField(
                TeacherResourceManager.item_resource_name,
                absolute=True),
            "essays": fields.List(ResourceField(
                essay.EssayResourceManager.item_resource_name,
                absolute=True)),
            "universities": fields.List(ResourceField(
                university.UniversityResourceManager.item_resource_name,
                absolute=True)),
            "application_essays": fields.List(ResourceField(
                essay.ApplicationEssayResourceManager.item_resource_name,
                absolute=True)),
            "theme_essays": fields.List(ResourceField(
                essay.ThemeEssayResourceManager.item_resource_name,
                absolute=True))
        })


class StudentResource(UserResource):

    resource_manager_class = StudentResourceManager


class StudentListResource(UserListResource):

    resource_manager_class = StudentResourceManager


class InvitationResourceManager(ResourceManager):

    item_resource_name = "invitation"
    list_resource_name = "invitations"
    model_class = Invitation

    def _add_item_fields(self):
        super(InvitationResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "email": fields.String,
            "is_registered": fields.Boolean,
            "teacher": ResourceField(
                TeacherResourceManager.item_resource_name,
                absolute=True),
        })


class InvitationResource(ItemResource):

    resource_manager_class = InvitationResourceManager


class InvitationListResource(ListResource):

    resource_manager_class = InvitationResourceManager
