"""
controllers.security
~~~~~~~~~~~~~~~~~~~~

This module modifies Flask-Security.

"""
from flask_security.forms import RegisterForm
from flask_security.forms import Required, TextField, BooleanField


class StudentTeacherField(BooleanField):

    def process_formdata(self, valuelist):
        if valuelist:
            self.data = ["teacher"]
        else:
            self.data = ["student"]


class FullRegisterForm(RegisterForm):
    first_name = TextField('First Name', [Required()])
    last_name = TextField('Last Name', [Required()])
    roles = StudentTeacherField('Are you a teacher?', [Required()])


security_forms = {
    "register_form": FullRegisterForm
}
