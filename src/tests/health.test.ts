import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("debe responder con status 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
