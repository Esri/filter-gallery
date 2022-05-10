require(["esri/intl", "esri/core/urlUtils", "dojo/i18n!application/nls/resources"], function (esriIntl, urlUtils, i18n) {
    const urlObj = urlUtils.urlToObject(document.location.href);
    const appUrl = urlObj.query?.appUrl || null;

    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = "<p>" + i18n.originError.message + "</p><details><summary>" + i18n.originError.options + "</summary><a href=" + appUrl + ">" + appUrl + "</a></details>"

});