import { pathToFileURL } from "node:url";

const REQUEST_TIMEOUT_MS = 15_000;

export async function verifyRemoteRelease({
  baseUrl,
  expectedCommit,
  fetchImpl = fetch,
  write = console.log
}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const commit = requireValue(expectedCommit, "commit atteso");

  write(section("Verifica rilascio remoto"));
  write(detail("URL", normalizedBaseUrl));
  write(detail("Commit atteso", commit));

  const health = await getJson(fetchImpl, `${normalizedBaseUrl}/health`);
  assertEqual(health.status, "ok", "health.status");
  assertEqual(health.provider, "replay", "health.provider");
  assertEqual(health.release, commit, "health.release");
  write(success("Health check", `${health.status} · ${health.provider}`));
  write(success("Release", health.release));

  const tickets = await getJson(fetchImpl, `${normalizedBaseUrl}/api/tickets`);
  if (!Array.isArray(tickets.tickets)) {
    throw new Error("GET /api/tickets non ha restituito un array tickets.");
  }
  write(success("API ticket", `${tickets.tickets.length} ticket disponibili`));

  const page = await getText(fetchImpl, `${normalizedBaseUrl}/incident.html`);
  if (!page.includes("Sintesi multi-ticket")) {
    throw new Error("La pagina incident.html non contiene il titolo atteso.");
  }
  write(success("Pagina", "Sintesi multi-ticket raggiungibile"));
  write(section("Rilascio remoto verificato"));

  return { health, ticketCount: tickets.tickets.length };
}

async function getJson(fetchImpl, url) {
  const response = await request(fetchImpl, url);
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(`${url} non ha restituito JSON.`);
  }

  return response.json();
}

async function getText(fetchImpl, url) {
  return (await request(fetchImpl, url)).text();
}

async function request(fetchImpl, url) {
  let response;

  try {
    response = await fetchImpl(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    throw new Error(`Richiesta fallita per ${url}: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`${url} ha risposto HTTP ${response.status}.`);
  }

  return response;
}

function normalizeBaseUrl(value) {
  const raw = requireValue(value, "URL staging").replace(/\/+$/, "");

  try {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) {
      throw new Error("protocollo non supportato");
    }
    return url.href.replace(/\/$/, "");
  } catch {
    throw new Error(`URL staging non valido: ${raw}`);
  }
}

function requireValue(value, label) {
  const normalized = String(value || "").trim();
  if (!normalized) {
    throw new Error(`Manca ${label}.`);
  }
  return normalized;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(
      `${label}: atteso ${JSON.stringify(expected)}, ricevuto ${JSON.stringify(actual)}.`
    );
  }
}

function section(value) {
  return color(`\n${value}`, "36;1");
}

function detail(label, value) {
  return `${color(label.padEnd(18), "90")} ${value}`;
}

function success(label, value) {
  return `${color("PASS", "32;1")} ${label.padEnd(18)} ${value}`;
}

function color(value, code) {
  if (!process.stdout.isTTY || process.env.NO_COLOR) {
    return value;
  }
  return `\u001b[${code}m${value}\u001b[0m`;
}

async function main() {
  const [baseUrl, expectedCommit] = process.argv
    .slice(2)
    .filter((argument) => argument !== "--");

  try {
    await verifyRemoteRelease({ baseUrl, expectedCommit });
  } catch (error) {
    console.error(`\n${color("FAIL", "31;1")} ${error.message}`);
    console.error(
      "Uso: pnpm verify:remote -- <URL_STAGING> <COMMIT_ATTESO>"
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
