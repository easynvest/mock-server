const debug = require("debug")("mock-server:middleware:cached");
const https = require("https");
const fetch = require("node-fetch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { getConfig } = require("../config");

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("cached");
  const { mockRequest } = req;

  if (!server.locals.requestApi && mockRequest) {
    res.append("x-request-mock", "true");

    res.status(mockRequest.status);
    res.send(mockRequest.response);
    return;
  }

  next();
};
