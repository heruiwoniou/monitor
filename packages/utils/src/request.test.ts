import { http, HttpResponse } from "msw";
import request from "@monitor/ui/request";
import { mockServer } from "test/setup-tests";

beforeAll(() => {
  return mockServer.start([
    http.get("http://localhost/reqeust", () => {
      return HttpResponse.json({
        status: 1,
        message: "message",
      });
    }),
    http.get("http://localhost/fail400", () => {
      return HttpResponse.json(
        {
          status: 0,
          message: "Not Found",
        },
        { status: 400 },
      );
    }),
  ]);
});

afterAll(() => {
  mockServer.close();
});

describe("Request", () => {
  test("Should equal expect success", async () => {
    const response = await request.get("/reqeust");
    expect(response).toMatchObject({
      data: {
        status: 1,
        message: "message",
      },
    });
    expect(response.response?.status).toEqual(200);
  });

  test("Should equal expect fail", async () => {
    const response = await request.get("/fail-undefined");
    expect(response).toMatchObject({
      error:
        "request to http://localhost/fail-undefined failed, reason: connect ECONNREFUSED 127.0.0.1:80",
      response: undefined,
    });
  });

  test("Should equal expect 400 fail", async () => {
    const response = await request.get("/fail400");
    expect(response).toMatchObject({
      error: "Not Found",
    });
    expect(response.response?.status).toEqual(400);
  });
});
