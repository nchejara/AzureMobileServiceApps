function insert(item, user, request) {
    var identities = user.getIdentities();
    if (identities.facebook) {
        item.identities = identities.facebook.accessToken;
    }
    else if (identities.microsoft) {
        item.identities = identities.microsoft.accessToken;
    }
    else if (identities.google) {
        item.identities = identities.google.accessToken;
    } else {
        item.identities = identities.twitter.accessToken;
    }
    request.execute();
}