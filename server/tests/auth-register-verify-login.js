/**
 * Smoke test: register -> verify email -> login
 *
 * Requires the server to be running on localhost:5000.
 * Run: node tests/auth-register-verify-login.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const http = require("http");
const mongoose = require("mongoose");
const User = require("../models/User");

const BASE = "http://localhost:5000/api/auth";
const EMAIL = `test_${Date.now()}@example.com`;
const PASSWORD = "TestPass123!";
const NAME = "Test User";

let failed = false;

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, body: raw });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
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
  console.log("auth register -> verify -> login");
  console.log("email:", EMAIL);
  console.log();

  // 1. Register
  console.log("POST /register");
  const reg = await post(`${BASE}/register`, { name: NAME, email: EMAIL, password: PASSWORD });
  console.log(" ", reg.status, JSON.stringify(reg.body));
  if (reg.status === 201) {
    ok("register returned 201");
  } else {
    fail("expected 201", reg.body);
  }

  // 2. Pull verification code from DB
  console.log("\nDB lookup: verificationCode");
  await mongoose.connect(process.env.MONGO_URI);

  let user = null;
  for (let i = 1; i <= 5; i++) {
    user = await User.findOne({ email: EMAIL.toLowerCase() });
    if (user?.verificationCode) break;
    console.log("  attempt", i, "- not ready, retrying in 1s");
    await new Promise((r) => setTimeout(r, 1000));
  }

  await mongoose.disconnect();

  if (!user) {
    fail("user not found in DB");
    process.exit(1);
  }

  const code = user.verificationCode;
  if (code) {
    ok(`code found: ${code}`);
  } else {
    fail("verificationCode missing");
    process.exit(1);
  }

  // 3. Verify email
  console.log("\nPOST /verify");
  const ver = await post(`${BASE}/verify`, { email: EMAIL, code });
  console.log(" ", ver.status, JSON.stringify(ver.body));
  if (ver.status === 200) {
    ok("email verified");
  } else {
    fail("expected 200", ver.body);
  }

  // 4. Login
  console.log("\nPOST /login");
  const login = await post(`${BASE}/login`, { email: EMAIL, password: PASSWORD });
  console.log(" ", login.status, JSON.stringify({ token: login.body.token ? "<jwt>" : null, user: login.body.user }));
  if (login.status === 200 && login.body.token) {
    ok("login returned 200 with token");
  } else {
    fail("expected 200 + token", login.body);
  }

  console.log();
  console.log(failed ? "FAILED" : "PASSED");
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error("unexpected error:", err.message);
  process.exit(1);
});
