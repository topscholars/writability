"""
controllers.resource.user
~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains the resource User, Teacher, Student.

"""
from flask.ext.restful import fields

from models.user import User, Teacher, Student

from .base import StatefulResourceManager, ItemResource, ListResource
from .fields import ResourceField
import essay
import university


class UserResourceManager(StatefulResourceManager):

    item_resource_name = "user"
    list_resource_name = "users"
    model_class = User

    def _add_item_fields(self):
        super(UserResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "email": fields.String,
            "first_name": fields.String,
            "last_name": fields.String
        })


class UserResource(ItemResource):

    resource_manager_class = UserResourceManager


class UserListResource(ListResource):

    resource_manager_class = UserResourceManager


class TeacherResourceManager(UserResourceManager):

    item_resource_name = "teacher"
    list_resource_name = "teachers"
    model_class = Teacher

    def _add_item_fields(self):
        super(TeacherResourceManager, self)._add_item_fields()
        self._item_fields.update({
            "students": fields.List(ResourceField(
                StudentResourceManager.item_resource_name,
                absolute=True))
        })


class TeacherResource(UserResource):

    resource_manager_class = TeacherResourceManager


class TeacherListResource(UserListResource):

    resource_manager_class = TeacherResourceManager


class StudentResourceManager(UserResourceManager):

    item_resource_name = "student"
    list_resource_name = "students"
    model_class = Student

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
                absolute=True))
        })


class StudentResource(UserResource):

    resource_manager_class = StudentResourceManager


class StudentListResource(UserListResource):

    resource_manager_class = StudentResourceManager
