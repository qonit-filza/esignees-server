const request = require("supertest");
const app = require("../app");
const { User, Contact, Company } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
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
    password: hashPassword("password"),
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
    password: hashPassword("password"),
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
    CompanyId: 1,
  });

  let userId1 = user1.id;
  let userId2 = user2.id;

  await Contact.create({
    UserIdOwner: userId1,
    UserIdContact: userId2,
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
  await Contact.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

// CREATE CONTACT
describe("Create contact", () => {
  test("201 -- Create new Contact", async () => {
    const response = await request(app)
      .post("/contacts")
      .send({
        email: "friend@mail.com",
      })
      .set("access_token", token);

    // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("UserIdOwner");
    expect(response.body).toHaveProperty("UserIdContact");
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .post("/contacts")
      .send({
        email: "friend@mail.com",
      })
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  test("404 -- Not Found User", async () => {
    const response = await request(app)
      .post("/contacts")
      .send({
        email: "a@mail.com",
      })
      .set("access_token", token);

    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("User not found");
  });
});

// SHOW CONTACT
describe("Show all contacts", () => {
  test("200 -- Show all contacts", async () => {
    const response = await request(app)
      .get("/contacts")
      .set("access_token", token);

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .get("/contacts")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthenticated");
  });

  // test("500 -- Internal Server Error", async () => {
  //   const response = await request(app)
  //     .get("/contacts")
  //     .send({})
  //     .set("access_token", token);

  //   expect(response.statusCode).toEqual(500);
  //   expect(response.body.message).toEqual("Internal server error");
  // });
});

// DETAIL
describe("Show contact detail", () => {
  test("200 -- Show friend", async () => {
    const response = await request(app)
      .get("/contacts/1")
      .set("access_token", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });

  test("404 -- Friend not found", async () => {
    const response = await request(app)
      .get("/contacts/999")
      .set("access_token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Friend not found on your contact");
  });
});

// DELETE
describe("Delete contact", () => {
  test("201 -- Friend deleted", async () => {
    const response = await request(app)
      .delete("/contacts/1")
      .set("access_token", token);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("success delete contact");
  });

  test("404 -- Friend not found", async () => {
    const response = await request(app)
      .delete("/contacts/999")
      .set("access_token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Friend not found on your contact");
  });
});