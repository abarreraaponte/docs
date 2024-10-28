import Server from "lume/core/server.ts";

import { apiDocumentContentTypeMiddleware } from "./middleware/apiDocContentType.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import feedbackApiMiddleware from "./middleware/feedbackApi.ts";

export const server = new Server({
  port: 8000,
  root: ".",
});


server.use(redirectsMiddleware);
server.use(feedbackApiMiddleware);
server.use(createGAMiddleware(server));
server.use(apiDocumentContentTypeMiddleware);

server.start();

console.log("Listening on http://localhost:8000");
