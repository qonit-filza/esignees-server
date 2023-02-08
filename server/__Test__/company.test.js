const app = require("../app");
const request = require("supertest");
const { Admin, User, Company, sequelize } = require("../models");
const queryInterface = sequelize.queryInterface;
const { createToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { generateKeyPair } = require("../helpers/crypto");

let validToken, validToken1, invalidToken;

const userTest = {
  name: "test",
  role: "admin",
  email: "usertest@mail.com",
  phone: "09871273251635",
  password: "usertest",
  jobTitle: "manager",
  ktpId: "67123138102320",
  ktpImage: "http://image.ktp",
  status: "unverified",
  CompanyId: 1,
};

const userTest1 = {
  name: "test1",
  role: "admin",
  email: "usertest1@mail.com",
  phone: "09871273251635",
  password: "usertest1",
  jobTitle: "manager",
  ktpId: "67123138102320",
  ktpImage: "http://image.ktp1",
  status: "unverified",
  CompanyId: 10,
};

beforeAll(async () => {
  try {
    await queryInterface.bulkInsert(
      "Companies",
      [
        {
          nameCompany: "testCompany",
          legalName: "testingCompany",
          address: "Jl. abdi negara",
          phoneCompany: "(021) 88976123",
          emailCompany: "testCompany@mail.com",
          industry: "agrobisnis",
          companySize: "makro company",
          status: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    let data = await User.create(userTest);
    validToken = createToken({
      id: data.id,
      email: data.email,
    });

    invalidToken = createToken({
      id: 3,
      email: "invalid@mail.com",
    });

    let data1 = await User.create(userTest1);
    validToken1 = createToken({
      id: data1.id,
      email: data1.email,
    });
  } catch (error) {
    console.log(error);
  }
});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  try {
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
  } catch (error) {
    console.log(error, "afterAll");
  }
});

describe("company route test", () => {
  describe("GET company data ", () => {
    test("200 get company data - should show data company", async () => {
      const response = await request(app)
        .get("/companies")
        .set("access_token", validToken);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("id", 1);
    });

    test("error cant get company data", (done) => {
      jest.spyOn(Company, "findAll").mockRejectedValue("Error");
      request(app)
        .get("/companies")
        .set("access_token", validToken)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty("message", "Internal server error");
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("401 cant get company data with invalid access token", async () => {
      const response = await request(app)
        .get("/companies")
        .set("access_token", "invalidToken");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    test("401 cant get company data without access token", async () => {
      const response = await request(app).get("/companies");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });
  });

  describe("PUT edit due date and status on company data", () => {
    test("200 success edit due date and update status", async () => {
      const response = await request(app)
        .put("/companies")
        .set("access_token", validToken);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Congrats, your subscription was successfully!"
      );
    });
    test("401 cant update company data with invalid access token", async () => {
      const response = await request(app)
        .put("/companies")
        .set("access_token", "invalidToken");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    test("401 cant update company data without access token", async () => {
      const response = await request(app).put("/companies");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });
  });

  describe("PUT edit subscription to free", () => {
    test("201 success update status data", async () => {
      const response = await request(app)
        .put("/companies/check")
        .set("access_token", validToken);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Your subscription was expired, please payment for more"
      );
    });

    test("401 cant update company status with invalid access token", async () => {
      const response = await request(app)
        .put("/companies/check")
        .set("access_token", "invalidToken");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    test("401 cant get company status without access token", async () => {
      const response = await request(app).put("/companies/check");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });
  });

  describe("POST midtrans transaction", () => {
    test("201 success create midtrans token and transaction", async () => {
      const response = await request(app)
        .post("/companies/createMidtransToken/500000")
        .set("access_token", validToken);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("redirect_url");
    });

    test("500 error midtrans token and transaction", (done) => {
      jest.spyOn(Company, "update").mockRejectedValue("Error");
      request(app)
        .put("/companies")
        .set("access_token", validToken)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty("message", "Internal server error");
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("401 cant create midtrans token with invalid price", async () => {
      const response = await request(app)
        .put("/companies/createMidtransToken/ ")
        .set("access_token", validToken);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
    });

    test("401 cant create midtrans token with invalid access token", async () => {
      const response = await request(app)
        .put("/companies/createMidtransToken/500000")
        .set("access_token", "invalidToken");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    test("401 cant create midtrans token without access token", async () => {
      const response = await request(app).put(
        "/companies/createMidtransToken/500000"
      );
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    test("500 error midtrans token and transaction", (done) => {
      jest.spyOn(User, "findByPk").mockRejectedValue("Error");
      request(app)
        .put("/companies/createMidtransToken/500000")
        .set("access_token", validToken)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty("message", "Internal server error");
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test("500 error midtrans token and transaction", (done) => {
      jest.spyOn(Company, "findByPk").mockRejectedValue("Error");
      request(app)
        .put("/companies/check")
        .set("access_token", validToken)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body).toHaveProperty("message", "Internal server error");
          expect(res.body).toBeInstanceOf(Object);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
