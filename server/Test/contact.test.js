const request = require("supertest");
const app = require("../app");
const { User, Contact } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
let token = "";

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
  token = createToken({ id: 1, email: user1.email });
  // console.log(userId1, "<<<>>>", token);

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

  const contact = await Contact.create({
    UserIdOwner: userId1,
    UserIdContact: userId2,
  });
  let contactId = contact.id;
});

afterAll(async () => {
  await User.destroy({
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
  test("Should return a 201 status code and creates a new contact", async () => {
    const response = await request(app)
      .post("/contacts")
      .send({
        email: "friend@mail.com",
      })
      .set("access_token", token);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("UserIdOwner");
    expect(response.body).toHaveProperty("UserIdContact");
  });
});

// SHOW CONTACT
describe("Show all contacts", () => {
  test("Should return a 200 status code and the list of contacts", async () => {
    const response = await request(app)
      .get("/contacts")
      .set("access_token", token);

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

// DETAIL
describe("Show contact detail", () => {
  test("Should return a 200 status code and contact detail", async () => {
    const response = await request(app)
      .get("/contacts/1")
      .set("access_token", token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });
});

// DELETE
describe("Delete contact", () => {
  test("Should return 201 and success delete contact message when contact is deleted", async () => {
    const response = await request(app)
      .delete("/contacts/1")
      .set("access_token", token);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("success delete contact");
  });
});
