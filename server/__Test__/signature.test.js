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
    await Company.bulkCreate(
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
    );

    let data = await User.create(userTest);
    console.log(data, "data");
    validToken = createToken({
      id: data.id,
      email: data.email,
    });

    invalidToken = createToken({
      id: 3,
      email: "invalid@mail.com"
    })  

    await Signature.bulkCreate([{
      signatureImage:
        "http://res.cloudinary.com/dh0pchr2t/image/upload/v1675733545/os5jof0z5itryhe133vx.png",
      UserId: 1,
    }]);
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
  describe("post signature image - create signature", () => {

    const signatureImage = "data:image/png;base64,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"

    test("200 success get signatureImage", async () => {
      const response = await request(app).post("/signatures")
      .set("access_token", validToken)
      .send({signatureImage})
      expect(response.status).toBe(201)
      expect(response.body).toBeInstanceOf(Object);
    })

    test("404 cant find user", async () =>{
      const response = await request(app).post("/signatures")
      .set("access_token", "invalid")
      .send({signatureImage})
      expect(response.status).toBe(401)

    })
    test("500 error get signature", (done) => {
      jest.spyOn(Signature, "create").mockRejectedValue("Error");
      request(app)
        .post(`/signatures`)
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

    test("401 cant get signatureImage", async () => {
      console.log(validToken, "validtoken");
      const response = await request(app).get("/signatures");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
    });

    test("401 cant get signatureImage with invalidToken", async () => {
      const response = await request(app).get("/signatures")
      .set("access_token", "invalidToken")
      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object);
    })

    test("401 cant get signatureImage with invalidToken", async () => {
      const response = await request(app).get("/signatures")
      .set("access_token", invalidToken)
      console.log(invalidToken);
      expect(response.status).toBe(401)
      expect(response.body).toBeInstanceOf(Object);
    })

    test("500 error get signature", (done) => {
      jest.spyOn(Signature, "findOne").mockRejectedValue("Error");
      request(app)
        .get(`/signatures`)
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

    describe("GET signature image", () =>{
      test("200 get signature image", async () =>{
        const response = await request(app).get('/signatures')
        .set("access_token", validToken)
        expect(response.status).toBe(200)
      })

      
    })

    describe("EDIT signature image", () => {
      test("201 edit signature image", async () =>{
        const response = await request(app).put('/signatures')
        .set("access_token", validToken)
        .send({signatureImage})
        expect(response.status).toBe(201)
      })
      
      test("500 error get signature", (done) => {
        jest.spyOn(Signature, "update").mockRejectedValue("Error");
        request(app)
          .put(`/signatures`)
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
    })


    describe("POST upload signature", () => {
      test("201 upload signature", async () =>{
        const response = await request(app).post('/signatures/upload')
        .attach('file', './__Test__/signatureFile/ttd.png')
        .set("access_token", validToken)
        expect(response.status).toBe(201)
      })
      
      test("500 error get signature", (done) => {
        jest.spyOn(Signature, "create").mockRejectedValue("Error");
        request(app)
          .post(`/signatures/upload`)
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
      
    })

    describe("PUT edit signature", () =>{
      test("201 put edit signature", async () =>{
        const response = await request(app).put('/signatures/upload')
        .attach('file', './__Test__/signatureFile/ttd.png')
        .set("access_token", validToken)
        expect(response.status).toBe(201)
      })

      test("500 error get signature", (done) => {
        jest.spyOn(Signature, "create").mockRejectedValue("Error");
        request(app)
          .put(`/signatures/upload`)
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
    })



  });
});
