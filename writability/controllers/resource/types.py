"""
controllers.resource.types
~~~~~~~~~~~~~~~~~~~~~~~~~~

This module contains custom types of parsing request parameters.

"""


def resource(value):
    """Extract an ID from a resource URL."""
    # TODO: Add url validation
    try:
        id = int(value)
        # id = int(value.rsplit('/', 1)[-1])
    except:
        raise ValueError("This value is not a url that ends with an id.")
    return id


def resource_list(values):
    """Extract IDs from a list of resource URLs."""
    if type(values) != list:
        raise ValueError("These values are not a list of resource URLs.")

    ids = []
    for v in values:
        ids.append(resource(v))
    return ids


def unicode_list(values):
    """Validate a list of unicodes."""
    if type(values) != list:
        raise ValueError("These values are not a list of unicode strings.")

    for uni_string in values:
        if type(uni_string) != unicode:
            raise ValueError("This value is not a unicode string.")

    return values
