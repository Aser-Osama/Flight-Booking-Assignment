/**
 * Smoke test: create flight -> GET /api/flights -> verify it appears -> delete it
 *
 * Requires the server to be running on localhost:5000.
 * Run: node tests/flights-get-all.js
 */

const http = require("http");

const BASE = "http://localhost:5000/api/flights";

const TEST_FLIGHT = {
  flightNumber: `TEST-${Date.now()}`,
  from: "New York",
  to: "London",
  date: "2027-06-15T10:00:00.000Z",
  totalSeats: 180,
  availableSeats: 180,
  price: 499,
};

let failed = false;

function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (data) opts.headers["Content-Length"] = Buffer.byteLength(data);

    const req = http.request(url, opts, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function ok(msg) {
  console.log("  PASS:", msg);
}

function fail(msg, detail) {
  console.error("  FAIL:", msg);
  if (detail !== undefined) console.error("       ", JSON.stringify(detail));
  failed = true;
}

(async () => {
  console.log("flights GET /api/flights");
  console.log("flight number:", TEST_FLIGHT.flightNumber);
  console.log();

  // 1. Create a flight so we have something to find
  console.log("POST /api/flights");
  const created = await request("POST", BASE, TEST_FLIGHT);
  console.log(" ", created.status, JSON.stringify(created.body));

  let createdId = null;
  if (created.status === 201 && created.body._id) {
    createdId = created.body._id;
    ok(`flight created (id: ${createdId})`);
  } else {
    fail("expected 201 with _id", created.body);
  }

  // 2. GET all flights
  console.log("\nGET /api/flights");
  const list = await request("GET", BASE);
  console.log(" ", list.status, `array of ${Array.isArray(list.body) ? list.body.length : "?"} flights`);

  if (list.status === 200 && Array.isArray(list.body)) {
    ok("returned 200 with array");
  } else {
    fail("expected 200 with array", list.body);
  }

  // 3. Verify the created flight is in the list
  if (Array.isArray(list.body) && createdId) {
    const found = list.body.find((f) => f._id === createdId);
    if (found) {
      ok(`created flight found in list (${found.from} -> ${found.to}, $${found.price})`);
    } else {
      fail("created flight not found in list");
    }
  }

  // 4. Check shape of a flight object
  if (Array.isArray(list.body) && list.body.length > 0) {
    const f = list.body[0];
    const fields = ["_id", "flightNumber", "from", "to", "date", "totalSeats", "availableSeats", "price"];
    const missing = fields.filter((k) => !(k in f));
    if (missing.length === 0) {
      ok("flight objects have expected fields");
    } else {
      fail(`missing fields: ${missing.join(", ")}`);
    }
  }

  // 5. Clean up
  if (createdId) {
    console.log("\nDELETE /api/flights/" + createdId);
    const del = await request("DELETE", `${BASE}/${createdId}`);
    console.log(" ", del.status, JSON.stringify(del.body));
    if (del.status === 200) {
      ok("test flight deleted");
    } else {
      fail("cleanup failed", del.body);
    }
  }

  console.log();
  console.log(failed ? "FAILED" : "PASSED");
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error("unexpected error:", err.message);
  process.exit(1);
});
