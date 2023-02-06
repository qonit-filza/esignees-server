const request = require("supertest");
const app = require("../app");
const { Company, User } = require("../models");
const { createToken, decodedToken } = require("../helpers/jwt");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");

beforeAll(async () => {
  const company1 = await Company.create({
    nameCompany: "Test Company",
    legalName: "Test Company LLC",
    address: "ABC Street",
    phoneCompany: "12345",
    emailCompany: "company@mail.com",
    industry: "Test",
    companySize: "100",
    companyInviteCode: "abc123",
    balance: 5,
  });

  const user1 = await User.create({
    name: "Owner",
    role: "Admin",
    email: "owner@mail.com",
    phone: "12345",
    password: hashPassword("password"),
    jobTitle: "testJob",
    ktpId: "12345",
    ktpImage: "12345.png",
    status: "Verified",
    CompanyId: 1,
  });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Company.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

// REGISTER USER & COMPANY
describe("POST -- Register new User & Company", () => {
  test("should return 201 status code and create new User -- No invite code", async () => {
    const response = await request(app)
      .post("/register")
      .send({
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
        password: hashPassword("password"),
        jobTitle: "testJob",
        ktpId: "12345",
        ktpImage: "ktp.jpg",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message:
        "Dear, Your company and account is in verification process. log-in after we send notification in your email",
    });
  });
});
