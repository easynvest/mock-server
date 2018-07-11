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

const getRequestBody = ({ body, contentType }) => {
  if (contentType.includes("json")) {
    return JSON.stringify(body);
  }

  if (contentType.includes("x-www-form-urlencoded")) {
    const form = new url.URLSearchParams();
    Object.keys(body).forEach(key => {
      form.append(key, req.body[key]);
    });

    return form;
  }
};

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("request");
  const { uriApi: URI_API } = getConfig();
  const {
    body,
    method,
    originalUrl,
    headers: { authorization, "content-type": contentType = "" }
  } = req;

  const parsedUrl = url.parse(originalUrl.replace(/^\/proxy/, ""));
  const uri = URI_API.includes("http")
    ? `${URI_API}${parsedUrl.path}`
    : `http://${URI_API}${parsedUrl.path}`;

  try {
    const config = {
      method,
      body: getRequestBody({ body, contentType }),
      headers: {
        authorization,
        "content-type": contentType
      }
    };

    const request = await fetch(uri, config);
    const response = await transformResponse(request);
    req.requestHttp = { request, response };
  } catch (e) {
    console.log(e);
  }
  next();
};
