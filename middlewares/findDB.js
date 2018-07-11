const debug = require("debug")("mock-server:middleware:findDB");
const url = require("url");
const { getConfig } = require("../config");

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("findDB");
  const { uriApi: URI_API } = getConfig();
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ""));
  const method = req.method;
  req.mockRequest = services.onRequests.getTo({ method, url: parsedUrl.pathname });
  next();
};
