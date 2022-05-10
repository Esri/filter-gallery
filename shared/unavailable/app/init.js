require(["esri/core/urlUtils", "dojo/i18n!application/nls/resources"], function (urlUtils, i18n) {
    const urlObj = urlUtils.urlToObject(document.location.href);
    const appid = urlObj.query?.appid || null;
    let message = appid ? i18n.message : i18n.appMessage;

    const messageContainer = document.getElementById("missingMessage");
    messageContainer.innerHTML = message;

});