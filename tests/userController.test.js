const request = require("supertest");
const app = require("./config/server");

let listener;

beforeAll(() => {
  // Start the server
  listener = app.listen(() => {
    console.log("Test server has started");
  });
});

afterAll(() => {
  // Stop the server
  listener.close();
});

// TESTS
describe("POST /login", () => {
  test("should return Invalid input", async () => {
    const response = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "",
    });
    expect(response.body.error).toBe("Invalid input.");
  });

  test("should return Invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "agent_one@gmail.com",
      password: "wrong_pass",
    });
    expect(response.body.error).toBe("Invalid credentials");
  });

  test("should return correct user details", async () => {
    const response = await request(app).post("/login").send({
      email: "agent_one@gmail.com",
      password: "pass111",
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("agent_one");
    expect(response.body.email).toBe("agent_one@gmail.com");
    expect(response.body.role).toBe("helper");
    expect(response.body.isAvailable).toBe(true);
    expect(response.body.jwt).toBeDefined();
  });
});
