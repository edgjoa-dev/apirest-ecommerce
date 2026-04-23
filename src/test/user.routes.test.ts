import request from "supertest";
import Server from "../models/server.model";

describe("User API QA test suite", () => {
  const server = new Server();
  const app = server.getApp();

  describe("GET /api/users", () => {
    test("returns default pagination values (baseline regression)", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        msg: "Get all users - from controller",
        limit: "10",
        page: "1",
        from: "1",
        to: "10"
      });
    });

    test("returns custom pagination values from query params (equivalence partition)", async () => {
      const response = await request(app)
        .get("/api/users")
        .query({ limit: "25", page: "2", from: "26", to: "50" });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ok: true,
        limit: "25",
        page: "2",
        from: "26",
        to: "50"
      });
    });
  });

  describe("GET /api/users/:id", () => {
    test("returns user by id (happy path)", async () => {
      const response = await request(app).get("/api/users/abc123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        msg: "Get user",
        id: "abc123"
      });
    });

    test("returns 404 for missing route param id (error handling)", async () => {
      const response = await request(app).get("/api/users/");

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.msg).toBe("Get all users - from controller");
    });
  });

  describe("POST /api/users", () => {
    test("creates user when required fields are present (decision table)", async () => {
      const payload = {
        name: "Joaquin",
        email: "joaquin@example.com",
        password: "secret123"
      };

      const response = await request(app).post("/api/users").send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        user: payload
      });
    });

    test("returns 400 when name is missing (negative test)", async () => {
      const response = await request(app).post("/api/users").send({
        email: "joaquin@example.com",
        password: "secret123"
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        msg: "Bad request"
      });
    });

    test("returns 400 when email is missing (negative test)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        password: "secret123"
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        msg: "Bad request"
      });
    });

    test("returns 400 when password is missing (boundary/required field)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: "joaquin@example.com"
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        ok: false,
        msg: "Bad request"
      });
    });
  });

  describe("PUT /api/users/:id", () => {
    test("returns update confirmation (smoke test)", async () => {
      const response = await request(app).put("/api/users/abc123").send({
        name: "Nuevo Nombre"
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        msg: "update user"
      });
    });
  });

  describe("DELETE /api/users/:id", () => {
    test("returns delete confirmation (smoke test)", async () => {
      const response = await request(app).delete("/api/users/abc123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ok: true,
        msg: "delete user"
      });
    });
  });
});
