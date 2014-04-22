from flask.ext.restful import fields


class ResourceField(fields.Url):

    def output(self, key, obj):
        id = {"id": obj[key].id}
        return super(ResourceField, self).output(key, id)
