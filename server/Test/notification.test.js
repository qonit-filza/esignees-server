const request = require("supertest");
const app = require("../app");
const { User, Notification } = require("../models");
const { createToken } = require("../helpers/jwt");

let token = "";
let token2 = "";

beforeAll(async () => {
  const user1 = await User.create({
    name: "Test",
    email: "test@mail.com",
    phone: "12345",
    password: "password",
    jobTitle: "testJob",
    ktpId: "12345",
    ktpImage: "12345.png",
  });
  let userId1 = user1.id;

  const user2 = await User.create({
    name: "Friend",
    email: "friend@mail.com",
    phone: "6789",
    password: "password",
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
  });
  let userId2 = user2.id;

  const notif = await Notification.create({
    message: `You Have new message from ${user2.email}`,
    UserId: user1.id,
  });

  token = createToken({ id: userId1, email: user1.email });
  token2 = createToken({ id: 999, email: "NUser@mail.com" });
});

afterAll(async () => {
  await User.destroy({
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
      .post("/notifications")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Login First");
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
    expect(response.body.message).toEqual("Login First");
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
    expect(response.body.message).toEqual("Login First");
  });
});
