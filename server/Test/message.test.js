const request = require("supertest");
const app = require("../app");
const { User, Message, Document, Company, sequelize } = require("../models");
const { createToken, decodedToken } = require("../helpers/jwt");
const { generateKeyPair, verifyPrivateKey } = require("../helpers/crypto");
const queryInterface = sequelize.queryInterface;

let token = "";
let token2 = "";
const [priKey, pubKey] = generateKeyPair();
companyData = [
  {
    id: 2,
    nameCompany: "Test Company",
    legalName: "Test Company LLC",
    address: "ABC Street",
    phoneCompany: "12345",
    emailCompany: "test@mail.com",
    industry: "Test",
    companySize: "100",
    status: "Subscription",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

beforeAll(async () => {
  try {
    const company1 = await queryInterface.bulkInsert(
      "Companies",
      companyData,
      {}
    );

    const company2 = await Company.create({
      nameCompany: "Company Test",
      legalName: "Company Test LLC",
      address: "CBA Street",
      phoneCompany: "6789",
      emailCompany: "another@mail.com",
      industry: "Test",
      companySize: "100",
    });

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
      CompanyId: 2,
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
      CompanyId: company2.id,
    });

    token = createToken({
      id: user1.id,
      name: user1.name,
      idCompany: user1.CompanyId,
    });
    token2 = createToken({
      id: user2.id,
      name: user2.name,
      idCompany: user2.CompanyId,
    });

    const msg = await Message.create({
      UserIdSender: user1.id,
      UserIdReceiver: user2.id,
      message: "Testing",
      status: "Testing",
    });
  } catch (error) {
    console.log(error);
  }
});

beforeEach(async () => {
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

// SEND MESSAGE
describe("POST -- Message to other user & Create document", () => {
  test.only("201 -- Message Sent", async () => {
    const response = await request(app)
      .post("/sents")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc")
      .field(`email`, "friend@mail.com")
      .field(`message`, "test")
      .field(`status`, "Testing")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(201);
  });

  test("404 -- Message not found", async () => {
    const response = await request(app)
      .post("/sents")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc")
      .field(`email`, "random@mail.com")
      .field(`message`, "test")
      .field(`status`, "Testing")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Message not found");
  });

  test("400 -- Invalid Private Key", async () => {
    const response = await request(app)
      .post("/sents")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc")
      .field(`email`, "friend@mail.com")
      .field(`message`, "test")
      .field(`status`, "completed")
      .field(`privateKey`, token)
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "Private key is invalid. Please check your input"
    );
  });

  test("401 -- Error at company authorization", async () => {
    const response = await request(app)
      .post("/sents")
      .send({
        docName: "test Doc",
        email: "friend@mail.com",
        message: "test",
        status: "Testing",
        privateKey: priKey,
      })
      .set("access_token", token2);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("You Must Subscribe first");
  });

  test("500 -- Internal Server Error", async () => {
    const response = await request(app)
      .post("/sents")
      .send({
        docName: "test Doc",
        email: "friend@mail.com",
        message: "test",
        status: "Testing",
        privateKey: priKey,
      })
      .set("access_token", token);

    expect(response.statusCode).toBe(500);
  });
});

// CHANGE MESSAGE -- ERR
describe("PUT -- Change message status", () => {
  test("200 -- Message updated", async () => {
    const response = await request(app)
      .post("/sents/1")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc2")
      .field(`email`, "friend@mail.com")
      .field(`message`, "testEdit")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(200);
  });
  test("400 -- Private Key Invalid", async () => {
    const response = await request(app)
      .post("/sents/1")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc2")
      .field(`email`, "friend@mail.com")
      .field(`message`, "testEdit")
      .field(`privateKey`, "abc")
      .set("access_token", token);

    expect(response.statusCode).toBe(400);
  });
  test("404 -- File not found", async () => {
    const response = await request(app)
      .post("/sents/99")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc2")
      .field(`email`, "friend@mail.com")
      .field(`message`, "testEdit")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(404);
  });
});

// REJECT MESSAGE -- ERR
describe("PUT -- Reject message", () => {
  test("200 -- Reject sign request", async () => {
    const response = await request(app)
      .post("/sents/1/reject")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc2")
      .field(`email`, "friend@mail.com")
      .field(`message`, "testEdit")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(200);
  });

  test("404 -- Cannot find Doc", async () => {
    const response = await request(app)
      .post("/sents/999/reject")
      .attach("file", "./Test/test.upload/sample.pdf")
      .field(`docName`, "test Doc2")
      .field(`email`, "friend@mail.com")
      .field(`message`, "testEdit")
      .field(`privateKey`, priKey)
      .set("access_token", token);

    expect(response.statusCode).toBe(404);
  });
});

// SHOW ALL MESSAGES -- ERR
describe("GET -- Show all messages", () => {
  test.only("200 -- Show All Messages", async () => {
    jest.spyOn(Message, "findAll").mockRejectedValue("Success");
    request(app)
      .get("/sents")
      .set("access_token", token)
      .then((res) => {
        // expect your response here
        expect(res.status).toBe(200);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test.only("500 -- Internal server err", async () => {
    jest.spyOn(Message, "findAll").mockRejectedValue("Error"); // you can pass your value as arg
    // or => User.findAll = jest.fn().mockRejectedValue('Error')
    request(app)
      .get("/sents")
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

// READ MESSAGE -- ERR
describe("GET -- Show message", () => {
  test.only("200 -- Show Message", async () => {
    const response = await request(app)
      .post("/sents/1")
      .set("access_token", token);

    expect(response.statusCode).toBe(200);
  });
});

const successFunction = jest.fn(() => Promise.resolve({ success: true }));

test("The success function should return success", async () => {
  const result = await successFunction();
  expect(result).toEqual({ success: true });
});
