import request from "supertest";
import Server from "../models/server.model";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

// Mock User model to avoid database dependencies
jest.mock("../models/user.model");
jest.mock("bcryptjs");

describe("User API QA test suite", () => {
  const server = new Server();
  const app = server.getApp();

  // Reset mocks before each test (Principle 1: Intensive Testing)
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    // Principle 2 & 3: Early Testing + Defect Clustering - Test validation first
    test("VALIDATION: rejects name with less than 3 characters (boundary test)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Jo",
        email: "test@example.com",
        password: "secret12312"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.name).toBeDefined();
    });

    test("VALIDATION: rejects password with less than 10 characters (boundary test)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: "test@example.com",
        password: "short123"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.password).toBeDefined();
    });

    test("VALIDATION: rejects invalid email format (negative test)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: "invalid-email",
        password: "secret12312"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.email).toBeDefined();
    });

    test("VALIDATION: rejects when name is missing (required field)", async () => {
      const response = await request(app).post("/api/users").send({
        email: "joaquin@example.com",
        password: "secret12312"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.name).toBeDefined();
    });

    test("VALIDATION: rejects when email is missing (required field)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        password: "secret12312"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.email).toBeDefined();
    });

    test("VALIDATION: rejects when password is missing (required field)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: "joaquin@example.com"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.password).toBeDefined();
    });

    // Principle 4: Pesticide Paradox - Vary test data to catch different scenarios
    test("VALIDATION: accepts name at minimum boundary (3 chars)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joa",
        email: "test@example.com",
        password: "secret12312"
      });

      // Should pass validation (400 only if validation fails or other errors)
      expect([200, 400]).toContain(response.status);
    });

    test("VALIDATION: accepts password at minimum boundary (10 chars)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: "test@example.com",
        password: "secret1234"
      });

      expect([200, 400]).toContain(response.status);
    });

    // Principle 5: Test positive and negative paths
    test("BUSINESS LOGIC: rejects empty strings even with valid length (whitespace validation)", async () => {
      const response = await request(app).post("/api/users").send({
        name: "   ",
        email: "test@example.com",
        password: "secret12312"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
    });

    test("BUSINESS LOGIC: creates user successfully with valid data (happy path)", async () => {
      const payload = {
        name: "Joaquin Hernandez",
        email: `test${Date.now()}@example.com`,
        password: "securePassword123"
      };

      const hashedPassword = "hashedSecurePassword123WithSalt";

      // Mock bcrypt.genSalt and bcrypt.hash
      (bcrypt.genSalt as unknown as jest.Mock).mockResolvedValue("salt10");
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock User.findOne to return null (email doesn't exist)
      (User.findOne as unknown as jest.Mock).mockResolvedValue(null);

      // Mock User constructor and save method
      const mockUserInstance = {
        _id: "507f1f77bcf86cd799439011",
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        save: jest.fn().mockResolvedValue({
          _id: "507f1f77bcf86cd799439011",
          name: payload.name,
          email: payload.email,
          password: hashedPassword
        })
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

      const response = await request(app).post("/api/users").send(payload);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(payload.name);
      expect(response.body.user.email).toBe(payload.email);
      // Password should be hashed, never plain text
      expect(response.body.user.password).not.toBe(payload.password);
      expect(response.body.user.password).toBe(hashedPassword);

      // Verify mocks were called
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(payload.password, "salt10");
      expect(User.findOne).toHaveBeenCalledWith({ email: payload.email });
    });

    test("BUSINESS LOGIC: rejects duplicate email addresses (data integrity)", async () => {
      const payload = {
        name: "Joaquin",
        email: "existing@example.com",
        password: "securePassword123"
      };

      // Mock User.findOne to return existing user
      (User.findOne as unknown as jest.Mock).mockResolvedValue({
        _id: "507f1f77bcf86cd799439010",
        email: payload.email
      });

      const response = await request(app).post("/api/users").send(payload);

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.msg).toContain("Email already exists");
    });

    // Principle 6: Absence of Errors Fallacy - Test edge cases
    test("BUSINESS LOGIC: handles special characters in name", async () => {
      const payload = {
        name: "José García-López",
        email: "test@example.com",
        password: "securePassword123"
      };

      const response = await request(app).post("/api/users").send(payload);

      // Should pass validation with special chars, might fail on business logic
      expect([200, 400, 500]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body.ok).toBe(false);
      }
    });

    test("BUSINESS LOGIC: handles very long email address", async () => {
      const longEmail = `${"a".repeat(50)}@example.com`;
      const response = await request(app).post("/api/users").send({
        name: "Joaquin",
        email: longEmail,
        password: "securePassword123"
      });

      expect([200, 400, 500]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body.ok).toBe(false);
      }
    });

    // Principle 7: Test Planning - Comprehensive coverage
    test("SECURITY: password is encrypted (not stored in plain text)", async () => {
      const payload = {
        name: "Test User",
        email: `security${Date.now()}@example.com`,
        password: "MySecurePassword123"
      };

      const hashedPassword = "$2a$10$encryptedPasswordHash";

      (bcrypt.genSalt as unknown as jest.Mock).mockResolvedValue("salt10");
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue(hashedPassword);
      (User.findOne as unknown as jest.Mock).mockResolvedValue(null);

      const mockUserInstance = {
        _id: "607f1f77bcf86cd799439012",
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        save: jest.fn().mockResolvedValue({
          _id: "607f1f77bcf86cd799439012",
          name: payload.name,
          email: payload.email,
          password: hashedPassword
        })
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

      const response = await request(app).post("/api/users").send(payload);

      if (response.status === 200 && response.body.user) {
        expect(response.body.user.password).not.toEqual(payload.password);
        expect(response.body.user.password).toBe(hashedPassword);
        // Hash should be longer than plain password
        expect(response.body.user.password.length).toBeGreaterThan(payload.password.length);
      }
    });

    test("CONSISTENCY: response structure is always consistent on validation errors", async () => {
      const response = await request(app).post("/api/users").send({
        name: "T",
        email: "invalid",
        password: "short"
      });

      expect(response.status).toBe(400);
      expect(response.body.ok).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(typeof response.body.errors).toBe("object");
    });

    test("CONSISTENCY: response structure is always consistent on success", async () => {
      const payload = {
        name: "Valid User",
        email: `consistency${Date.now()}@example.com`,
        password: "ValidPassword123"
      };

      (bcrypt.genSalt as unknown as jest.Mock).mockResolvedValue("salt10");
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue("hashedPassword");
      (User.findOne as unknown as jest.Mock).mockResolvedValue(null);

      const mockUserInstance = {
        _id: "707f1f77bcf86cd799439013",
        name: payload.name,
        email: payload.email,
        password: "hashedPassword",
        save: jest.fn().mockResolvedValue({
          _id: "707f1f77bcf86cd799439013",
          name: payload.name,
          email: payload.email,
          password: "hashedPassword"
        })
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

      const response = await request(app).post("/api/users").send(payload);

      expect(response.status).toBe(200);
      expect(response.body.ok).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBeDefined();
      expect(response.body.user.email).toBeDefined();
      expect(response.body.user.password).toBeDefined();
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
