const app = require("../app");
const request = require("supertest");
const { User, Signature, Company, sequelize } = require("../models");
const queryInterface = sequelize.queryInterface;
const { createToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { generateKeyPair } = require("../helpers/crypto");

let validToken, invalidToken;

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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    let data = await User.create(userTest);
    console.log(data, "data");
    validToken = createToken({
      id: data.id,
      email: data.email,
    });

    await queryInterface.bulkInsert("Signatures", {
      signatureImage:
        "http://res.cloudinary.com/dh0pchr2t/image/upload/v1675733545/os5jof0z5itryhe133vx.png",
      UserId: 1,
    });
  } catch (error) {
    console.log(error);
  }
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
    await Signature.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error, "afterAll");
  }
});

describe("signature route test", () => {
  describe("get signature image - create signature", () => {

    const signatureImage = "data:image/png;base64,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"

    test("200 success get signatureImage", async () => {
      const response = await request(app).post("/signatures")
      .send(signatureImage)
      .set("access_token", validToken)
      expect(response.status).toBe(200)
    })

    // test("401 cant get signatureImage", async () => {
    //   console.log(validToken, "validtoken");
    //   const response = await request(app).get("/signatures");
    //   expect(response.status).toBe(401);
    // });
  });
});
