import assert from "node:assert/strict";
import test from "node:test";

import { verifyRemoteRelease } from "../../scripts/verify-remote.js";

test("verifies health identity, ticket API and the incident page", async () => {
  const lines = [];
  const result = await verifyRemoteRelease({
    baseUrl: "https://example.test/",
    expectedCommit: "commit-123",
    fetchImpl: buildFetch({ release: "commit-123" }),
    write: (line) => lines.push(line)
  });

  assert.equal(result.health.release, "commit-123");
  assert.equal(result.ticketCount, 1);
  assert.match(lines.at(-1), /Rilascio remoto verificato/);
});

test("fails when the remote release is not the expected commit", async () => {
  await assert.rejects(
    verifyRemoteRelease({
      baseUrl: "https://example.test",
      expectedCommit: "commit-new",
      fetchImpl: buildFetch({ release: "commit-old" }),
      write: () => {}
    }),
    /health\.release: atteso "commit-new", ricevuto "commit-old"/
  );
});

function buildFetch({ release }) {
  return async (url) => {
    if (url.endsWith("/health")) {
      return Response.json({ status: "ok", provider: "replay", release });
    }

    if (url.endsWith("/api/tickets")) {
      return Response.json({ tickets: [{ id: "TCK-1" }] });
    }

    if (url.endsWith("/incident.html")) {
      return new Response("<h1>Sintesi multi-ticket</h1>", {
        headers: { "content-type": "text/html" }
      });
    }

    return new Response("Not found", { status: 404 });
  };
}
