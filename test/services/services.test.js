const Memory = require("lowdb/adapters/Memory");
const configDB = require("../../db");
const servicesConfig = require("../../services");

let services;
let db;

beforeAll(() => {
  db = configDB(new Memory(), { requests: [], scenarios: [] });
  services = servicesConfig(db);
});

describe("Service", () => {
  it("should verify create default data", () => {
    expect(services.onRequests.requests.value()).toEqual([]);
    expect(services.onScenarios.scenarios.value()).toEqual([]);
  });

  it("should create a request", () => {
    const url = "http://swapi.co/api/people/1";
    const response = { name: "Luke" };
    const requests = services.onRequests.create({
      url,
      response
    });

    const request = requests[0];

    expect(request.id).toEqual(expect.anything());
    expect(request.method).toBe("GET");
    expect(request.response).toEqual(response);
    expect(request.status).toBe(200);
    expect(request.type).toBe("custom");
    expect(request.url).toBe(url);
  });

  it.skip("should create a new request with default type", () => {});

  it.skip("should create a same request when exists method and url with custom type", () => {});
});
