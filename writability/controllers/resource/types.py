

def resource(value):
    """Extract an ID from a resource URL."""
    # TODO: Add url validation
    try:
        id = int(value.rsplit('/', 1)[-1])
    except:
        raise ValueError("This value is not a url that ends with an id.")
    return id


def resource_list(values):
    """Extract IDs from a list of resource URLs."""
    print 'here'
    ids = []
    for v in values:
        ids.append(resource(v))
    print ids
    return ids
