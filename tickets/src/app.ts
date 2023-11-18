import { json } from "body-parser";
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@sid_ticketing/common";

import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust-proxy", true); // Express is aware is behind the proxy and should trust the connection

app.use(json());

app.use(
  cookieSession({
    signed: false,
    // secure: true,      // Turn ON in production to set cookie only when using HTTPS Connection
    secure: process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "dev",
    // secure:true
  })
);
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)


app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
