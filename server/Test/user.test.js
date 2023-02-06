const request = require("supertest");
const app = require("../app");
const { Company, User } = require("../models");
const { createToken, decodedToken } = require("../helpers/jwt");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");

beforeAll(async () => {
  const user1 = await User.create({
    name: "Test",
    email: "test@mail.com",
    phone: "12345",
    password: hashPassword("password"),
    jobTitle: "testJob",
    ktpId: "12345",
    ktpImage: "12345.png",
  });
  let userId1 = user1.id;

  const user2 = await User.create({
    name: "Friend",
    email: "friend@mail.com",
    phone: "6789",
    password: hashPassword("password"),
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
  });
  let userId2 = user2.id;

  // const contact = await Contact.create({
  //   UserIdOwner: userId1,
  //   UserIdContact: userId2,
  // });
  // let contactId = contact.id;
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
describe("POST -- Register new User w/ Company & w/o Company", () => {
  test.only("should return 201 status code and create new User -- No invite code", async () => {
    const response = await request(app)
      .post("/register")
      .send({
        // COMPANY DATA
        nameCompany: "My Company",
        legalName: "My Company LLC",
        address: "123 Main St",
        phoneCompany: "12345",
        emailCompany: "mycompany@email.com",
        industry: "Technology",
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

    const company = await Company.findOne({
      where: { nameCompany: "My Company" },
    });
    expect(company).toBeDefined();
    expect(company.legalName).toBe("My Company LLC");
    expect(company.address).toBe("123 Main St");
    expect(company.phoneCompany).toBe("555-555-5555");
    expect(company.emailCompany).toBe("mycompany@email.com");
    expect(company.industry).toBe("Technology");
    expect(company.companySize).toBe("100-500");

    const user = await User.findOne({ where: { name: "John Doe" } });
    expect(user).toBeDefined();
    expect(user.role).toBe("admin");
    expect(user.email).toBe("johndoe@email.com");
    expect(user.phone).toBe("555-555-5555");
    expect(user.password).toBe("secret");
    expect(user.jobTitle).toBe("Manager");
    expect(user.ktpId).toBe("123456");
    expect(user.ktpImage).toBe("ktp.jpg");
    expect(user.CompanyId).toBe(company.id);
  });
});
