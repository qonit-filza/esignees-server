const app = require("../app");
const request = require("supertest");
const { Admin, User, Company, sequelize } = require("../models");
const queryInterface = sequelize.queryInterface;
const { createToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { generateKeyPair } = require("../helpers/crypto");

let validToken, invalidToken, userId;
const adminTest = {
  name: "admin",
  email: "admin@mail.com",
  phone: "089123136457",
  password: "adminesign",
};

beforeAll(async () => {
  try {
    let data = await Admin.create(adminTest);
    validToken = createToken({
      id: data.id,
      email: data.email,
    });
    userId = data.id;
    invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJhZG1pbjRAbWFpbC5jb20iLCJpYXQiOjE2NzU2NzA5NTR9.Z_kzg2Bx3jh8OK90oVQC2JNlGdM-LQ0tUymc98saxGA";
    await queryInterface.bulkInsert(
      "Companies",
      {
        nameCompany: "testing company",
        legalName: "the real test",
        address: "Jl. sandi negara",
        phoneCompany: "(021) 80976123",
        emailCompany: "companytest@mail.com",
        industry: "education",
        companySize: "mikro company",
      },
      {}
    );

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "test",
          role: "admin",
          email: "usertest@mail.com",
          phone: "09871273251635",
          password: hashPassword("usertest"),
          jobTitle: "manager",
          ktpId: "67123138102320",
          publicKey: generateKeyPair(),
          ktpImage: "http://image.ktp",
          status: "unverified",
          CompanyId: 1,
        },
        {
          name: "test1",
          role: "admin",
          email: "usertest1@mail.com",
          phone: "09871273251635",
          password: hashPassword("usertest1"),
          jobTitle: "manager",
          ktpId: "67123138102321",
          publicKey: generateKeyPair(),
          ktpImage: "http://image.ktp1",
          status: "unverified",
          CompanyId: 1,
        },
      ],
      {}
    );
  } catch (error) {
    console.log(error);
  }
});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  try {
    await Admin.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
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

describe("admin routes test", () => {
  describe("POST/register - create new Admin", () => {
    const admin = {
      name: "test",
      email: "test@mail.com",
      phone: "0891231367",
      password: "testadmin",
    };
    test("201 success register - should create new admin", async () => {
      const response = await request(app)
        .post("/adm/register")
        .send(admin)
        .set("access_token", validToken);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("name", admin.name);
      expect(response.body).toHaveProperty("email", admin.email);
    });

    test("400 email is not valid - shouldn't create new admin", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send({
          ...admin,
          email: "testmail.com",
        });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is not valid");
    });

    test("400 email is null - shouldn't create new admin", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send({
          ...admin,
          email: "",
        });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message");
    });

    test("400 email is empty - shouldn't create new email", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send({
          ...admin,
          email: " ",
        });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email is cant be empty");
    });

    test("400 email is must be unique - shouldn't create new email", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send(admin);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email must be unique");
    });

    test("400 name cant be null", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send({
          ...admin,
          name: "",
        });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "name cant be empty");
    });

    test("400 name cant be empty", async () => {
      const response = await request(app)
        .post("/adm/register")
        .set("access_token", validToken)
        .send({
          ...admin,
          name: " ",
        });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "name cant be empty");
    });
  });

  describe("POST login - login admin", () => {
    const admin = {
      email: "test@mail.com",
      password: "testadmin",
    };

    test("201 success login - should create new admin", async () => {
      const response = await request(app).post("/adm/login").send(admin);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("email", admin.email);
    });

    test("401 failed login - should return error", async () => {
      const response = await request(app)
        .post("/adm/login")
        .send({ email: "testsalah@mail.com", password: "testsalah" });
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });

    test("401 failed login - should return error", async () => {
      const response = await request(app)
        .post("/adm/login")
        .send({ email: "test@mail.com", password: "" });
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email or Password is required"
      );
    });

    test("401 failed login wrong password - should return error", async () => {
      const response = await request(app)
        .post("/adm/login")
        .send({ ...admin, password: "testadmin1" });
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });
  });

  describe("GET data user", () => {
    test("404 cant get data user", async () => {
      const response = await request(app)
        .get("/adm/users")
        .set("access_token", validToken);
      // console.log(response, "true");
      expect(response.status).toBe(404);
    });

    test("404 cant get data user", async () => {
      const response = await request(app)
        .get("/adm/users?search=test1")
        .set("access_token", validToken);
      expect(response.status).toBe(404);
    });

    test("404 cant get data user", async () => {
      const response = await request(app)
        .get("/adm/users?search=wrong")
        .set("access_token", validToken);
      expect(response.status).toBe(404);
    });

    test("401 get data user with invalid token", async () => {
      const response = await request(app)
        .get("/adm/users")
        .set("access_token", invalidToken);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });

    test("401 get data user without token", async () => {
      const response = await request(app).get("/adm/users");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });
  });

  describe("GET data user by Id", () => {
    test("200 success get data user by Id", async () => {
      const response = await request(app)
        .get("/adm/users/1")
        .set("access_token", validToken);
      expect(response.status).toBe(200);
    });

    test("500 error fetch data user By Id ", (done) => {
      jest.spyOn(User, "findByPk").mockRejectedValue("NotFoundUser");
      request(app)
        .get("/users/1")
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

    test("401 get data user with invalid token", async () => {
      const response = await request(app)
        .get("/adm/users/1")
        .set("access_token", invalidToken);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });

    test("401 get data user without token", async () => {
      const response = await request(app).get("/adm/users/1");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });
  });

  describe("PATCH status on user", () => {
    test("200 success update status", async () => {
      // console.log(userId, "userId");
      const response = await request(app)
        .patch(`/adm/users/1`)
        .set("access_token", validToken)
        .send({ status: "Verified" });
      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
    });

    test("401 update status without access token", async () => {
      // console.log(userId, "userId");
      const response = await request(app).patch(`/adm/users/${userId}`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });

    test("401 update status with invalid token", async () => {
      // console.log(userId, "userId");
      const response = await request(app)
        .patch(`/adm/users/${userId}`)
        .set("access_token", invalidToken);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });
  });

  describe("DELETE user", () => {
    test("200 success delete user", async () => {
      const response = await request(app)
        .delete(`/adm/users/1`)
        .set("access_token", validToken);
      console.log(response, "delete");
      expect(response.status).toBe(500);
    });

    test("401 delete user without token", async () => {
      const response = await request(app).delete(`/adm/users/1`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });
    test("401 delete user with invalid token", async () => {
      const response = await request(app)
        .delete(`/adm/users/1`)
        .set("access_token", invalidToken);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Login First");
    });
  });
});
