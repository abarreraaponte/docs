
export default async function feedbackApiMiddleware(req, next) {
    const url = new URL(req.url);
    if (url.pathname !== "/_api/send-feedback") {
        return next(req);
    }

    // do google sheets stuff here
    console.log("Sending response to google sheets");

    return new Response("google sheets response");

}
