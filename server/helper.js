function validateUrl(url) {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
}

function linkToAbsoluteUrl(link, hostUrl) {
    if (link.startsWith("http")) {
        return link;
    } else {
        const $url = new URL(hostUrl);
        if (link.startsWith("/")) {
            return $url.protocol + "//" + $url.host + link;
        } else {
            return req.body.url + link;
        }
    }
}

module.exports = {
    validateUrl,
    linkToAbsoluteUrl
}