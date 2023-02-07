const request = require("supertest");
const app = require("../app");
const { User, Message, Document, Company } = require("../models");
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
  invite = company1.companyInviteCode;

  const user1 = await User.create({
    name: "Owner",
    role: "Admin",
    email: "owner@mail.com",
    phone: "12345",
    password: "password",
    jobTitle: "testJob",
    ktpId: "12345",
    ktpImage: "12345.png",
    status: "Verified",
    CompanyId: 1,
  });

  token = createToken({
    id: user1.id,
    name: user1.name,
    idCompany: user1.CompanyId,
  });
  token2 = createToken({
    id: 999,
    name: "aaa",
    idCompany: 1,
  });

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
  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .get("/documents/1")
      .set("access_token", token2);

    expect(response.statusCode).toEqual(401);
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
