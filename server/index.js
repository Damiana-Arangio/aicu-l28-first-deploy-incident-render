import { resolve } from "node:path";

import { createTicketApplication } from "./app.js";

const port = parsePort(process.env.PORT ?? "3001");
const host = process.env.HOST?.trim() || "0.0.0.0";
const appMode = process.env.APP_MODE?.trim() || "local";
const provider = process.env.AI_PROVIDER?.trim() || "replay";
const databasePath = process.env.DATABASE_PATH
  ? resolve(process.cwd(), process.env.DATABASE_PATH)
  : undefined;

process.env.AI_PROVIDER = provider;

const application = createTicketApplication(
  databasePath ? { databasePath } : undefined
);

application.server.listen(port, host, () => {
  console.log(
    `Ticketing pronto su http://localhost:${port}/incident.html ` +
      `(mode=${appMode}, provider=${provider}, bind=${host})`
  );
});

export function parsePort(value) {
  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT non valida: ${value}`);
  }

  return port;
}

async function shutdown() {
  await application.close();
  process.exit(0);
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
