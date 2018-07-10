const debug = require("debug")("mock-server:middleware:cached");
const https = require("https");
const fetch = require("node-fetch");
const url = require("url");
const fs = require("fs");
const path = require("path");
const URL = require("url");
const { getConfig } = require("../config");

const getLikeURL = (acc, char) => {
  const list = acc.list.filter(({ url }) => url.startsWith(acc.str));
  if (list.length === 0) return acc;
  return { list, str: acc.str + char };
};

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("cached");
  const { mockRequest } = req;

  if (!server.locals.requestApi) {
    if (mockRequest) {
      res.append("x-request-mock", "true");
      res.status(mockRequest.status);
      res.send(mockRequest.response);
      return;
    }

    const { pathname } = URL.parse(req.url);
    const barsNumber = pathname.split("/").length + 1;
    const cached = services.onRequests.requests
      .value()
      .filter(
        request => request.method === req.method && request.url.split("/").length === barsNumber
      );

    const like = Array.prototype.reduce.call(pathname, getLikeURL, { list: cached, str: "" });
    const likeSorted = like.list.sort((a, b) => {
      if (a.url > b.url) return 1;
      if (a.url === b.url) return 0;
      return -1;
    });

    if (likeSorted.length > 0) {
      res.append("x-request-mock", "true");
      res.status(likeSorted[0].status);
      res.send(likeSorted[0].response);
      return;
    }

    res.append("x-request-mock", "true");
    res.append("x-request-mock-status", 404);
    res.status(200);
    res.send();
    return;
  }

  next();
};
