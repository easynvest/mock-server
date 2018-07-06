const debug = require("debug")("mock-server:middleware:request");
const https = require("https");
const fetch = require("node-fetch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getConfig } = require("../config");

const transformResponse = async request => {
  let contentType = request.headers._headers["content-type"][0];
  if (contentType.includes("text/plain")) {
    return request.text();
  } else {
    return request.json();
  }
};

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("request");
  const { uriApi: URI_API } = getConfig();
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ""));
  const method = req.method;
  const uri = `http://${URI_API}${parsedUrl.path}`;
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

    let response;
    try {
      response = await transformResponse(request);

      req.requestHttp = { request, response };
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
  next();
};
