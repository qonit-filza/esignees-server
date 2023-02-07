const request = require("supertest");
const app = require("../app");
const { User, Notification, Company } = require("../models");
const { createToken } = require("../helpers/jwt");

let token = "";
let token2 = "";

beforeAll(async () => {
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

  const user1 = await User.create({
    name: "Test",
    email: "test@mail.com",
    phone: "12345",
    password: "password",
    jobTitle: "testJob",
    ktpId: "12345",
    ktpImage: "12345.png",
    CompanyId: company1.id,
  });

  token = createToken({
    id: user1.id,
    name: user1.name,
    idCompany: user1.CompanyId,
  });

  token2 = createToken({ id: 999, name: "NUser@mail.com", idCompany: 1 });

  const user2 = await User.create({
    name: "Friend",
    email: "friend@mail.com",
    phone: "6789",
    password: "password",
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
    CompanyId: 1,
  });

  const notif = await Notification.create({
    message: `You Have new message from ${user2.email}`,
    UserId: user1.id,
  });
});

beforeEach(() => {
  jest.restoreAllMocks();
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
  await Notification.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

// SHOW ALL NOTIFICATION
describe("Show Notification", () => {
  test("200 -- Show all Notification", async () => {
    const response = await request(app)
      .get("/notifications")
      .set("access_token", token);
    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .get("/notifications")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  test("500 -- Internal Server Error (findAll)", (done) => {
    jest.spyOn(Notification, "findAll").mockRejectedValue("Error"); // you can pass your value as arg
    // or => User.findAll = jest.fn().mockRejectedValue('Error')
    request(app)
      .get("/notifications")
      .set("access_token", token)
      .then((res) => {
        // expect your response here
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

// NOTIFICATION DETAIL
describe("Show Notif Detail", () => {
  test("200 -- Show 1 Notification", async () => {
    const response = await request(app)
      .get("/notifications/1")
      .set("access_token", token);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("UserId");
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .post("/notifications/1")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  test("500 -- Internal Server Error (findDetail)", (done) => {
    jest.spyOn(Notification, "findByPk").mockRejectedValue("Error"); // you can pass your value as arg
    // or => User.findAll = jest.fn().mockRejectedValue('Error')
    request(app)
      .get("/notifications/1")
      .set("access_token", token)
      .then((res) => {
        // expect your response here
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

// NOTIFICATION UPDATE
describe("Edit Notif", () => {
  test("200 -- Show all Notification", async () => {
    const response = await request(app)
      .patch("/notifications/1")
      .set("access_token", token);
    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Inbox was read");
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .patch("/notifications/1")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  test("500 -- Internal Server Error (Edit)", (done) => {
    jest.spyOn(Notification, "update").mockRejectedValue("Error"); // you can pass your value as arg
    // or => User.findAll = jest.fn().mockRejectedValue('Error')
    request(app)
      .patch("/notifications/1")
      .set("access_token", token)
      .then((res) => {
        // expect your response here
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal server error");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
