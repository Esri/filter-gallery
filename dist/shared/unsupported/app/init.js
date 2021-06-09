require(["esri/intl", "dojo/i18n!application/nls/resources"], function (esriIntl, i18n) {

    var browser = (function () {
        var ua = navigator.userAgent,
            tem,
            M =
                ua.match(
                    /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
                ) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: "IE", version: tem[1] || "" };
        }

        if (M[1] === "Chrome") {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                return { name: tem[1].replace("OPR", "Opera"), version: tem[2] };
            }
        }

        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];

        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }

        return { name: M[0], version: M[1] };
    })();

    // also contains version so need to figure out legacy edge
    var isIE = browser.name === "IE" || browser.name === "Edge" && browser.version <= 15;

    document.getElementById("supportMessage").innerHTML = esriIntl.substitute(!isIE ? i18n.message : i18n.ie11Message, {
        chrome: "https://www.google.com/chrome/",
        firefox: "https://www.mozilla.org/firefox/new/",
        edge: "https://www.microsoft.com/edge",
        safari: "https://support.apple.com/downloads/safari",
        catsGeoNetLink: "https://community.esri.com/community/gis/web-gis/arcgisonline",
        edgelegacy:
            "https://support.microsoft.com/en-us/help/4533505/what-is-microsoft-edge-legacy"
    });

});