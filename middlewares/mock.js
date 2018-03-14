const https = require("https");
const fetch = require("node-fetch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getConfig } = require("../config");

const saveRequest = dbService => (mockRequest = {}, newRequest) => {
  const _ = dbService.onRequests._;
  const attrsCompare = ["method", "url", "status"];
  if (
    _.isEqual(
      _.pick(mockRequest, attrsCompare),
      _.pick(newRequest, attrsCompare)
    )
  ) {
    return;
  }

  if (!_.isEmpty(mockRequest)) {
    newRequest.type = "custom";
  }

  dbService.onRequests.create(newRequest);
};

module.exports = ({ server, dbService }) => async (req, res, next) => {
  const saveRequestDb = saveRequest(dbService);
  const { uriApi: URI_API } = getConfig();
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ""));
  const method = req.method;
  const uri = `http://${URI_API}${parsedUrl.path}`;
  let mockRequest = dbService.onRequests.getTo({ method, url: uri });

  if (!server.locals.requestApi) {
    res.append("x-request-mock", "true");

    res.status(mockRequest.status);
    res.send(mockRequest.response);
    return;
  }

  const { authorization, "content-type": contentType = "" } = req.headers;

  try {
    let reqBody = req.body;
    if (contentType.includes("json")) {
      reqBody = JSON.stringify(reqBody);
    }

    if (contentType.includes("x-www-form-urlencoded")) {
      const form = new url.URLSearchParams();
      Object.keys(req.body).forEach(key => {
        form.append(key, req.body[key]);
      });

      reqBody = form;
    }

    const config = {
      method,
      body: reqBody,
      headers: {
        authorization,
        "content-type": contentType
      }
    };

    const request = await fetch(uri, config);

    if ([200, 400, 204].indexOf(request.status) === -1) {
      res.append("x-request-mock", "true");

      res.status(mockRequest.status);
      res.send(mockRequest.response);
      return;
    }

    res.set("Content-Type", "application/json");

    const json = await request.json();

    saveRequestDb(mockRequest, {
      type: "default",
      method,
      url: uri,
      status: request.status,
      response: json
    });

    res.status(request.status);
    res.send(json);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 1 });
  }
};
