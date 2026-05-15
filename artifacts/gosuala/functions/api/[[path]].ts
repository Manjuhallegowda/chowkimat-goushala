import { handle } from "hono/cloudflare-pages";
import app from "../../../api-server/src/index";

export const onRequest = handle(app);
