import assert from "node:assert/strict";
import test from "node:test";

import { startTestApplication } from "../helpers/ticket-api.js";

test("GET /health reports that the application can receive requests", async (t) => {
  const baseUrl = await startTestApplication(t, {
    healthProvider: "replay",
    healthRelease: "commit-test-123"
  });
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: "ok",
    provider: "replay",
    release: "commit-test-123"
  });
});
