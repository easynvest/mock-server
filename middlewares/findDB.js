const debug = require("debug")("mock-server:middleware:findDB");
const url = require("url");
const { getConfig } = require("../config");

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("findDB");
  const { uriApi: URI_API } = getConfig();
  const parsedUrl = url.parse(req.originalUrl.replace(/^\/proxy/, ""));
  const method = req.method;
  const uri = `http://${URI_API}${parsedUrl.path}`;
  let mockRequest = services.onRequests.getTo({ method, url: uri });

  req.mockRequest = mockRequest;

  next();
};
