const request = require("supertest");
const app = require("../app");
const { User, Message, Document } = require("../models");
const { createToken } = require("../helpers/jwt");

let token = "";
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
  token = createToken({ id: user1.id, email: user1.email });

  const user2 = await User.create({
    name: "Friend",
    email: "friend@mail.com",
    phone: "6789",
    password: "password",
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
  });

  const msg = await Message.create({
    message: "Testing",
    status: "Sent",
    UserIdSender: 2,
    UserIdReceiver: 1,
  });

  const doc = await Document.create({
    documentName: "TestPDF",
    metaTitle: "PDF123_Test",
    documentPath: "https://picsum.photos/200",
    digitalSignature: "",
    MessageId: 1,
    UserId: 1,
  });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Message.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Document.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET Document", () => {
  test("200 -- ONE", async () => {
    const response = await request(app)
      .get("/documents/1")
      .set("access_token", token);

    expect(response.statusCode).toEqual(200);
  });
  test("404 -- No Document found with that ID", async () => {
    const response = await request(app)
      .get("/documents/999")
      .set("access_token", token);

    expect(response.statusCode).toEqual(404);
  });
  test("500 -- OTHER", async () => {
    const response = await request(app)
      .get("/documents/1")
      .set("access_token", token);

    expect(response.statusCode).toEqual(500);
  });
});
