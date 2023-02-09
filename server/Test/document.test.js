const request = require("supertest");
const app = require("../app");
const { User, Message, Document, Company } = require("../models");
const { createToken } = require("../helpers/jwt");
const { generateKeyPair, signPdf } = require("../helpers/crypto");

let token = "";
let token2 = "";
let token3 = "";
const [priKey1, pubKey1] = generateKeyPair();
const [priKey2, pubKey2] = generateKeyPair();

const signKey1 = signPdf(
  priKey1,
  "./Test/test.upload/1d1f1e7e-384e-48e8-9935-0bdbfb2a2329.pdf"
);
const signKey2 = signPdf(
  priKey2,
  "./Test/test.upload/dummy-2pdf.com-edit-metadata.pdf"
);

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
    CompanyId: company1.id,
    publicKey: pubKey1,
  });

  token = createToken({
    id: user1.id,
    name: user1.name,
    idCompany: user1.CompanyId,
  });

  const user2 = await User.create({
    name: "Friend",
    email: "friend@mail.com",
    phone: "6789",
    password: "password",
    jobTitle: "testJob",
    ktpId: "6789",
    ktpImage: "6789.png",
    status: "Verified",
    CompanyId: company1.id,
    publicKey: pubKey2,
  });

  token2 = createToken({
    id: user2.id,
    name: user2.name,
    idCompany: user2.CompanyId,
  });
  token3 = createToken({
    id: 999,
    name: "aaa",
    idCompany: 1,
  });

  const msg = await Message.create({
    message: "Testing",
    status: "Sent",
    UserIdSender: 2,
    UserIdReceiver: 1,
  });

  const msg2 = await Message.create({
    message: "Testing",
    status: "Sent",
    UserIdSender: 1,
    UserIdReceiver: 2,
  });

  const msg3 = await Message.create({
    message: "Testing",
    status: "Sent",
    UserIdSender: 2,
    UserIdReceiver: 1,
  });

  const doc11 = await Document.create({
    documentName: "sample 1",
    metaTitle: "tes_send-7/2/2023, 17.52.07",
    documentPath: "./Test/test.upload/1d1f1e7e-384e-48e8-9935-0bdbfb2a2329.pdf",
    digitalSignature: signKey1,
    MessageId: msg.id,
    UserId: user1.id,
  });

  const doc12 = await Document.create({
    documentName: "test 1",
    metaTitle: "tes_send-7/2/2023, 17.52.07",
    documentPath: "./Test/test.upload/1d1f1e7e-384e-48e8-9935-0bdbfb2a2329.pdf",
    digitalSignature: signKey1,
    MessageId: msg.id,
    UserId: user1.id,
  });

  const doc13 = await Document.create({
    documentName: "sample 2",
    metaTitle: "new-err",
    documentPath: "./Test/test.upload/another-test.pdf",
    digitalSignature: "signKey1",
    MessageId: msg3.id,
    UserId: user1.id,
  });

  const doc14 = await Document.create({
    documentName: "test 2",
    metaTitle: "new-err",
    documentPath: "./Test/test.upload/another-test.pdf",
    digitalSignature: "signKey1",
    MessageId: msg3.id,
    UserId: user1.id,
  });

  const doc21 = await Document.create({
    documentName: "testSample 1",
    metaTitle: "ANOTHER-TEST",
    documentPath: "./Test/test.upload/dummy-2pdf.com-edit-metadata.pdf",
    digitalSignature: signKey2,
    MessageId: msg2.id,
    UserId: user2.id,
  });
  const doc22 = await Document.create({
    documentName: "testSample 2",
    metaTitle: "dummy-v2",
    documentPath: "./Test/test.upload/dummy-v2.pdf",
    digitalSignature: "signKey2",
    MessageId: msg2.id,
    UserId: user2.id,
  });
});

beforeEach(() => {
  jest.restoreAllMocks();
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
  test("200 -- Show Document", async () => {
    const response = await request(app)
      .get("/documents/1")
      .set("access_token", token);
    // console.log(response, "<<<<<<<<<<<<<<<<<<<");

    expect(response.statusCode).toEqual(200);
  });
  test("401 -- Unauthorized", async () => {
    const response = await request(app)
      .get("/documents/1")
      .set("access_token", token3);

    expect(response.statusCode).toEqual(401);
  });
  test("404 -- No Document found with that ID", async () => {
    const response = await request(app)
      .get("/documents/999")
      .set("access_token", token);

    expect(response.statusCode).toEqual(404);
  });
});

describe("POST Document to Verify", () => {
  test("201 -- Verify document // NON SIGN WITH OTHER", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "./Test/test.upload/dummy-2pdf.com-edit-metadata.pdf")
      .set("access_token", token);

    // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.statusCode).toBe(201);
  });

  test("201 -- Verify document // SIGN WITH OTHER", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach(
        "file",
        "./Test/test.upload/1d1f1e7e-384e-48e8-9935-0bdbfb2a2329.pdf"
      )
      .set("access_token", token);

    // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.statusCode).toBe(201);
  });

  test("400 -- Invalid Document/Signature (Line 35)", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "./Test/test.upload/sample.pdf")
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
  });

  test("400 -- Invalid Document/Signature (Line 53)", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "./Test/test.upload/sample-2pdf.com-edit-metadata.pdf")
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
  });

  test("400 -- Invalid Document/Signature (Line 90)", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "./Test/test.upload/another-test.pdf")
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
  });

  test("400 -- Invalid Document/Signature (Line 112)", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "./Test/test.upload/dummy-v2.pdf")
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
  });

  test("500 -- ISE", async () => {
    const response = await request(app)
      .post("/verify-document")
      .attach("file", "")
      .set("access_token", token);

    expect(response.statusCode).toBe(500);
  });
});
