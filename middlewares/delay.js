const debug = require("debug")("mock-server:middleware:delay");
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("delay");
  const { mockRequest } = req;

  if (mockRequest && mockRequest.delay) {
    await sleep(delay);
  }

  next();
};
