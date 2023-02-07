const request = require("supertest");
const app = require("../app");
const { Company, User } = require("../models");
const { createToken } = require("../helpers/jwt");

let invite = "";

beforeAll(async () => {
  try {
    const company1 = await Company.create({
      nameCompany: "Test Company",
      legalName: "Test Company LLC",
      address: "ABC Street",
      phoneCompany: "12345",
      emailCompany: "company@mail.com",
      industry: "Test",
      companySize: "100",
      balance: 5,
    });
    invite = company1.companyInviteCode;

    const user1 = await User.create({
      name: "Owner",
      role: "Admin",
      email: "owner@mail.com",
      phone: "12345",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "12345.png",
      status: "Verified",
      CompanyId: company1.id,
    });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Company.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

// REGISTER USER & COMPANY
describe("POST -- Register new User & Company", () => {
  test("201 -- Create new User // No invite code", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      nameCompany: "New Company",
      legalName: "New Company LLC",
      address: "123 Main St",
      phoneCompany: "12345",
      emailCompany: "newcompany@email.com",
      industry: "Test",
      companySize: "100",
      // USER DATA --
      name: "Test",
      email: "test@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      "Dear, Your company and account is in verification process. log-in after we send notification in your email"
    );
  });

  test("400 -- Company email already registered", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      nameCompany: "New Company",
      legalName: "New Company LLC",
      address: "123 Main St",
      phoneCompany: "12345",
      emailCompany: "newcompany@email.com",
      industry: "Test",
      companySize: "100",
      // USER DATA --
      name: "Test",
      email: "test@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    expect(response.statusCode).toBe(400);
    // expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.message).toEqual(
      "email company address already in use!"
    );
  });

  test("400 -- User email already registered", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      nameCompany: "New Company 2",
      legalName: "New Company 2 LLC",
      address: "123 Main St",
      phoneCompany: "12345",
      emailCompany: "newcompany2@email.com",
      industry: "Test",
      companySize: "100",
      // USER DATA --
      name: "Test",
      email: "test@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    expect(response.statusCode).toBe(400);
    // expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.message).toEqual("Email address already in use!");
  });

  test("400 -- Sequelize Validation Error (Company)", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      nameCompany: "",
      legalName: "",
      address: "",
      phoneCompany: "",
      emailCompany: "",
      industry: "Test",
      companySize: "100",
      // USER DATA --
      name: "Test",
      email: "test@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("company name is required");
  });

  test("400 -- Sequelize Validation Error (User) // No invite code", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      nameCompany: "New Company 2",
      legalName: "New Company 2 LLC",
      address: "123 Main St",
      phoneCompany: "12345",
      emailCompany: "newcompany2@email.com",
      industry: "Test",
      companySize: "100",
      // USER DATA --
      name: "",
      email: "",
      phone: "",
      password: "",
      jobTitle: "",
      ktpId: "",
      ktpImage: "",
    });

    // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("name is required");
  });

  test("201 -- Create new User // With invite code", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      companyInviteCode: invite,
      // USER DATA --
      name: "Test2",
      email: "test2@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      "Dear, Test2. Your account is in verification process. log-in after we send notification in your email"
    );
  });

  test("400 -- Sequelize Validation Error (User) // With invite code", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      companyInviteCode: invite,
      // USER DATA --
      name: "",
      email: "",
      phone: "",
      password: "",
      jobTitle: "",
      ktpId: "",
      ktpImage: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("name is required");
  });

  test("404 -- Company not found", async () => {
    const response = await request(app).post("/register").send({
      // COMPANY DATA
      companyInviteCode: "invite",
      // USER DATA --
      name: "Test3",
      email: "test3@mail.com",
      phone: "6789",
      password: "password",
      jobTitle: "testJob",
      ktpId: "12345",
      ktpImage: "ktp.jpg",
    });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Company not found");
  });
});

let access_token = "";
// LOGIN USER
describe("POST -- Login User", () => {
  test("201 -- Login User & Return email, role, and access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "test@mail.com",
      password: "password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("role", expect.any(String));
    access_token = response.body.access_token;
    // console.log(access_token, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  });

  test("400 -- Bad Request", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Email or Password is required");
  });

  test("401 -- Invalid Credentials (Email)", async () => {
    const response = await request(app).post("/login").send({
      email: "abc@mail.com",
      password: "password",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Invalid Email or Password");
  });

  test("401 -- Invalid Credentials (Password)", async () => {
    const response = await request(app).post("/login").send({
      email: "test@mail.com",
      password: "12345",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Invalid Email or Password");
  });
});

// GET PROFILE DETAIL
describe("GET -- Profile Detail", () => {
  test("200 -- Get User detail", async () => {
    const response = await request(app)
      .get("/profiles")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("phone", expect.any(String));
    expect(response.body).toHaveProperty("jobTitle", expect.any(String));
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .get("/profiles")
      .set("access_token", "aaa");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Unauthenticated");
  });
});

// EDIT PROFILE
describe("PUT -- Profile Detail", () => {
  test("201 -- Edit User Detail", async () => {
    const response = await request(app)
      .put("/profiles")
      .send({
        name: "Edit name",
        email: "edit@mail.com",
        password: "new password",
        phone: "12345",
        jobTitle: "Editing job",
      })
      .set("access_token", access_token);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("success edit your account Test");
  });

  test("400 -- Sequelize Validation Error", async () => {
    const response = await request(app)
      .put("/profiles")
      .send({
        // USER DATA --
        name: "",
        email: "",
        phone: "",
        password: "",
        jobTitle: "",
      })
      .set("access_token", access_token);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("name is required");
    // expect(Array.isArray(response.body.message)).toBe(true);
    // expect(response.body.message.length).toEqual(5);
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .put("/profiles")
      .send({
        name: "Edit name",
        email: "edit@mail.com",
        password: "new password",
        phone: "12345",
        jobTitle: "Editing job",
      })
      .set("access_token", "aaa");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.body.message).toEqual("Unauthenticated");
  });
});
