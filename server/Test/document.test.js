const request = require("supertest");
const app = require("../app");

describe("GET /document/:id", () => {
  it("returns a file for the given id", async () => {
    const id = "some-id";
    const data = { documentPath: "path/to/file" };

    // mock the Document.findByPk method to return the data
    Document.findByPk = jest.fn().mockResolvedValue(data);

    const res = await request(app)
      .get(`/document/${id}`)
      .expect("Content-Type", "application/octet-stream")
      .expect(200);

    // assert that the Document.findByPk method was called with the id
    expect(Document.findByPk).toHaveBeenCalledWith(id);
  });

  it("handles errors", async () => {
    const id = "some-id";
    const error = new Error("some error");

    // mock the Document.findByPk method to throw the error
    Document.findByPk = jest.fn().mockRejectedValue(error);

    const res = await request(app).get(`/document/${id}`).expect(500);

    // assert that the error was logged
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
