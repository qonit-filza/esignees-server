const request = require("supertest");
const app = require("../app");
const User = require("../models");
const Contact = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");

beforeAll(async () => {
  const user1 = await User.create({
    email: "test@mail.com",
    password: hashPassword("password"),
  });
  let userId1 = user1.id;
  let token = createToken({ id: 1, email: user1.email });
  console.log(userId1, "<<<>>>", token);

  const user2 = await User.create({
    email: "friend@mail.com",
    password: hashPassword("password"),
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
        email: "friend@example.com",
      })
      .set("Authorization", "string");

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });
});

// SHOW CONTACT
describe("Show all contacts", () => {
  test("Should return a 200 status code and the list of contacts", async () => {
    const response = await request(app)
      .get("/contacts")
      .set("Authorization", "string");

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(/* List of contacts */);
  });
});

// DETAIL
describe("Show contact detail", () => {
  test("Should return a 200 status code and contact detail", async () => {
    const response = await request(app)
      .get("/contacts/1")
      .set("Authorization", "string");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
  });
});

// DELETE
describe("Delete contact", () => {
  test("Should return 201 and success delete contact message when contact is deleted", async () => {
    const response = await request(app)
      .delete(`/contacts/1`)
      .set("Authorization", "string")
      .send();

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("success delete contact");
  });
});
