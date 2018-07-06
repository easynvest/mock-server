class Requests {
  constructor(db, mockApplication) {
    this._ = db._;
    this.mockApplication = mockApplication;
    this.requests = db.get("requests");
  }

  all() {
    return this.requests
      .map(i => `${i.method} -> ${i.url}`)
      .sortBy("url")
      .uniq()
      .value();
  }

  getById(id) {
    return this.requests.getById(id);
  }

  getTo({ method, url }) {
    const nextRequestScenario = this.mockApplication.onScenarios.getNextRequest({ method, url });

    if (nextRequestScenario) {
      return nextRequestScenario;
    }

    const request = this.requests.find({ method, url, type: "default" });

    return request.value();
  }

  allResponses({ method, url }) {
    const request = this.requests.filter({ method, url });

    return request.value();
  }

  create({ type = "custom", method = "GET", url, status = 200, response }) {
    const request = this.requests
      .pushIfNotExists(
        {
          type,
          method: method.toUpperCase(),
          url,
          status,
          response
        },
        ["method", "url", "status", "response"]
      )
      .write();

    return request;
  }

  saveIfHasDiff(mockRequest = {}, newRequest) {
    const _ = this._;
    const attrsCompare = ["method", "url", "status"];

    if (_.isEqual(_.pick(mockRequest, attrsCompare), _.pick(newRequest, attrsCompare))) {
      return;
    }

    if (!_.isEmpty(mockRequest)) {
      newRequest.type = "custom";
    }

    this.create(newRequest);
  }

  defineDefaut(id) {
    const request = this.requests.getById(id);

    const { method, url } = request.value();

    this.requests
      .find({ type: "default", method, url })
      .assign({ type: "custom" })
      .write();

    request.assign({ type: "default" }).write();
  }
}

module.exports = Requests;
