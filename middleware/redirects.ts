//import REDIRECTS from "../_redirects.json" with { type: "json" };
import GO_LINKS from "../go.json" with { type: "json" };
import REDIRECT_LINKS from "../oldurls.json" with { type: "json" };

let REDIRECTS = {} as Record<string, string>;

try {
    const redirectsAsBytes = Deno.readFileSync("./_redirects.json");
    const redirectsAsString = new TextDecoder().decode(redirectsAsBytes);
    const redirectsAsJson = JSON.parse(redirectsAsString);
    REDIRECTS = redirectsAsJson;
} catch (e) {
    REDIRECTS = {};
}

let redirects = REDIRECTS || {} as Record<string, string>;

redirects["/api/"] = "/api/deno/";

for (const [name, url] of Object.entries(GO_LINKS)) {
    redirects[`/go/${name}/`] = url;
}

for (const [name, url] of Object.entries(REDIRECT_LINKS)) {
    redirects[name] = url;
}

export default async function redirectsMiddleware(req, next) {

    let res: Response;
    try {
        const url = new URL(req.url);
        const redirect = redirects[url.pathname] ||
            (url.pathname.endsWith("/")
                ? redirects[url.pathname.slice(0, -1)]
                : redirects[url.pathname + "/"]);
        if (redirect) {
            res = new Response(null, {
                status: 301,
                headers: {
                    "Location": redirect,
                },
            });
        } else {
            res = await next(req);
        }
        return res;
    } catch (e) {
        res = new Response("Internal Server Error", {
            status: 500,
        });
        throw e;
    }
}
