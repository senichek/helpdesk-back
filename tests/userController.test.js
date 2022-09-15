const request = require("supertest");
const app = require("./config/server");
const { v4: uuidv4 } = require('uuid');
const { DataTypes } = require("sequelize");

let listener;

let test_user_id;
let admin_jwt;
let test_user_jwt;

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
describe("===== userController tests =====", () => {
  test("POST /login - should return Invalid input", async () => {
    const response = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "",
    });
    expect(response.body.error).toBe("Invalid input.");
  });

  test("POST /login - should return Invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      email: "agent_one@gmail.com",
      password: "wrong_pass",
    });
    expect(response.body.error).toBe("Invalid credentials");
  });

  test("POST /login - should return correct user details", async () => {
    const response = await request(app).post("/login").send({
      email: "admin_one@gmail.com",
      password: "pass111",
    });
    // We will need it in the tests below
    admin_jwt = response.body.jwt;

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("admin_one");
    expect(response.body.email).toBe("admin_one@gmail.com");
    expect(response.body.role).toBe("admin");
    expect(response.body.isAvailable).toBe(false);
    expect(response.body.jwt).toBeDefined();
  });

  test("POST /signup - should return The details are incomplete.", async () => {
    const response = await request(app).post("/signup").send({
      email: "test@gmail.com",
      password: "",
    });
    expect(response.body.error).toBe("The details are incomplete.");
  });

  test("POST /signup - should return Both passwords must be the same.", async () => {
    const response = await request(app).post("/signup").send({
      name: 'agent_three',
      email: "agent_three@gmail.com",
      role: 'helper',
      password: "pass111",
      password2: "pass11",
    });
    expect(response.body.error).toBe("Both passwords must be the same.");
  });

  test("POST /signup - should return User exists", async () => {
    const response = await request(app).post("/signup").send({
      name: 'agent_three',
      email: "agent_one@gmail.com",
      role: 'helper',
      password: "pass111",
      password2: "pass111",
    });
    expect(response.body.error).toBe("User exists");
  });

  test("POST /signup - should return correct user details", async () => {
    const response = await request(app).post("/signup").send({
      id: uuidv4(),
      name: 'test_agent32332156756',
      email: 'test_agent32332156756@gmail.com',
      role: 'helper',
      password: 'test_password',
      password2: 'test_password',
      isAvailable: false
    });

    // We will need it for the tests below
    test_user_id = response.body.id;
    test_user_jwt = response.body.jwt;

    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("test_agent32332156756");
    expect(response.body.email).toBe("test_agent32332156756@gmail.com");
    expect(response.body.role).toBe("helper");
    expect(response.body.isAvailable).toBe(false);
    expect(response.body.jwt).toBeDefined();
  });

  test("POST /user - should return Not authorized, no JWT", async () => {
    const response = await request(app).post("/user")
    .send({
    role: "admin",
    name: "admin_two",
    email: "admin_two@gmail.com",
    password: "pass111",
    password2: "pass111",
    isAvailable: false,
    created_at: new Date()
    })
    expect(response.body.error).toBe('Not authorized, no JWT');
  });

  test("POST /user - should return Details incomplete", async () => {
    const response = await request(app).post("/user")
    .send({
    role: "admin",
    email: "admin_two@gmail.com",
    password: "pass111",
    password2: "pass111",
    isAvailable: false,
    created_at: new Date(),
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    expect(response.body.error).toBe('The details are incomplete.');
  });

  test("POST /user - should return Both passwords must be the same.", async () => {
    const response = await request(app).post("/user")
    .send({
    name: 'admin_two',
    role: "admin",
    email: "admin_two@gmail.com",
    password: "pass111",
    password2: "pass11",
    isAvailable: false,
    created_at: new Date(),
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    expect(response.body.error).toBe('Both passwords must be the same.');
  });

  test("POST /user - should return Not authorized", async () => {
    const response = await request(app).post("/user")
    .send({
    name: 'admin_two',
    role: "admin",
    email: "admin_two@gmail.com",
    password: "pass111",
    password2: "pass11",
    isAvailable: false,
    created_at: new Date(),
    })
    .set('Authorization', `Bearer ${test_user_jwt}`);
    expect(response.body.error).toBe('Not authorized');
  });

  test("POST /user - should return User exists", async () => {
    const response = await request(app).post("/user")
    .send({
    name: 'admin_one',
    role: "admin",
    email: "admin_one@gmail.com",
    password: "pass111",
    password2: "pass111",
    isAvailable: false,
    created_at: new Date(),
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    expect(response.body.error).toBe('User exists');
  });

  test("POST /user - should return correct user data", async () => {
    const response = await request(app).post("/user")
    .send({
    name: 'admin_two',
    role: "admin",
    email: "admin_two@gmail.com",
    password: "pass111",
    password2: "pass111",
    isAvailable: false,
    created_at: new Date(),
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("admin_two");
    expect(response.body.email).toBe("admin_two@gmail.com");
    expect(response.body.role).toBe("admin");
    expect(response.body.isAvailable).toBe(false);
    expect(response.body.jwt).toBeDefined();
  });

  test("PATCH /user - should return Not authorized, no JWT", async () => {
    const response = await request(app).patch("/user")
    .send({
    name: 'admin_two_updated',
    email: "admin_two@gmail.com",
    isAvailable: false,
    });
  
    expect(response.body.error).toBe('Not authorized, no JWT');
  });

  test("PATCH /user - should return Provide id, name, email, isAvailable", async () => {
    const response = await request(app).patch("/user")
    .send({
    id: test_user_id,
    email: "admin_one@gmail.com",
    isAvailable: false,
    })
    .set('Authorization', `Bearer ${test_user_jwt}`);
    expect(response.body.error).toBe('Provide id, name, email, isAvailable');
  });

  test("PATCH /user - should return User with id not found", async () => {
    const response = await request(app).patch("/user")
    .send({
    id: 'ce7dcc7c-3528-11ed-a261-0242ac120002',
    name: 'admin_two_updated',
    email: "admin_two@gmail.com",
    isAvailable: false,
    })
    .set('Authorization', `Bearer ${test_user_jwt}`);
  
    expect(response.body.error).toBe('User with id ce7dcc7c-3528-11ed-a261-0242ac120002 not found');
  });

  test("PATCH /user - should return updated data", async () => {
    const response = await request(app).patch("/user")
    .send({
    id: test_user_id,
    name: 'test_user_updated',
    email: "test_updated@gmail.com",
    isAvailable: true,
    })
    .set('Authorization', `Bearer ${test_user_jwt}`);
  
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("test_user_updated");
    expect(response.body.email).toBe("test_updated@gmail.com");
    expect(response.body.role).toBe("helper");
    expect(response.body.isAvailable).toBe(true);
  });

  test("DELETE /user - should return Not authorized", async () => {

    const response = await request(app).delete("/user")
    .send({
      id: test_user_id
    })
    .set('Authorization', `Bearer ${test_user_jwt}`);
    expect(response.body.error).toBe('Not authorized');
  });

  test("DELETE /user - should delete user", async () => {
    // Delete the test user which was created in the previous test
    const response = await request(app).delete("/user")
    .send({
      id: test_user_id
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    expect(response.body.message).toBe(`User with id ${test_user_id} was deleted`);
  });

  test("DELETE /user - should return User not found", async () => {
    const response = await request(app).delete("/user")
    .send({
      id: test_user_id
    })
    .set('Authorization', `Bearer ${admin_jwt}`);
    expect(response.body.message).toBe(`User with id ${test_user_id} not found`);
  });

});
