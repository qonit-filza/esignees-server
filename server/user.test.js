const request = require("supertest");
const app = require("./app");
const sequelize = require("./sequelize");
const Company = require("./models");
const User = require("./models");

// ???
describe("POST /registerCompany", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("creates a new company and user when no invite code is provided", async () => {
    const response = await request(app).post("/registerCompany").send({
      nameCompany: "My Company",
      legalName: "My Company LLC",
      address: "123 Main St",
      phoneCompany: "555-555-5555",
      emailCompany: "mycompany@email.com",
      industry: "Technology",
      companySize: "100-500",
      name: "John Doe",
      email: "johndoe@email.com",
      phone: "555-555-5555",
      password: "secret",
      jobTitle: "Manager",
      ktpId: "123456",
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

  it("creates a new user for an existing company when an invite code is provided", async () => {
    const company = await Company.create({
      nameCompany: "My Company",
      legalName: "My Company LLC",
      address: "123 Main St",
      phoneCompany: "555-555-5555",
      emailCompany: "mycompany@email.com",
      industry: "Technology",
      companySize: "100-500",
    });
  });
});
