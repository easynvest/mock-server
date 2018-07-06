const debug = require("debug")("mock-server:middleware:response");

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("response");
  const {
    requestHttp: { request, response }
  } = req;
  const { status } = request;

  res.status(status).send(response);
};
