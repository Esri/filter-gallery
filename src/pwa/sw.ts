const filesToCache = [
    "index.html",
    "bundle.css",
    "index.js"
];

const staticCacheName = "filter-gallery-v1";

self.addEventListener("install", function (event: any) {
    caches.open(staticCacheName)
        .then(function (cache: any) {
            return cache.addAll(filesToCache);
        });
});

self.addEventListener("fetch", function (event: any) {
    const url = event.request.url;
    if (
        endsWith(
            url,
            "index.js",
            "index.html",
            "bundle.css",
            "application.json",
            `${self.location.origin}/`,
            "f=json"
        ) ||
        url.slice(0, url.lastIndexOf("?")).endsWith("self")
    ) {
        event.respondWith(
            fetch(event.request)
                .then((response: any) => caches.open(staticCacheName)
                    .then((cache: any) => {
                        if (url.indexOf("test") < 0) {
                            cache.put(url, response.clone());
                        }
                        return response;
                    })
                ).catch((err: any) => caches.match(event.request))
        );
    } else if (
        endsWith(url, ".css", ".js", ".html", "/", "woff", "woff2", "ttf")
    ) {
        event.respondWith(
            caches.match(event.request)
                .then((response: any) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then((response: any) =>caches.open(staticCacheName)
                            .then(function (cache: any) {
                                if (url.indexOf("test") < 0) {
                                    cache.put(url, response.clone());
                                }
                                return response;
                            })
                        );
    
                }).catch(function (error: any) {
                    // do something when offline
                })
        );
    }
});

function endsWith(url: string, ...matches: string[]) {
    return matches.reduce(
        (acc, c) => url.endsWith(c) ? true : acc,
        false
    );
}
