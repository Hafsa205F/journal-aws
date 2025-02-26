// Use supertest instead of axios for simpler API testing
const request = require("supertest");
const app = require("../index");

// This test is more suitable for CI/CD as it tests the API directly
describe("Journal API Integration Tests", () => {
  test("API health endpoint should be accessible", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("ok");
  });

  test("API hello endpoint should return message", async () => {
    const res = await request(app).get("/api/hello");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Hello Data Scince Big Data!");
  });
});
