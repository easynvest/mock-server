const debug = require("debug")("mock-server:middleware:delay");
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

module.exports = ({ server, services }) => async (req, res, next) => {
  debug("delay");
  const { mockRequest } = req;
  let delay = 0;

  if (mockRequest) {
    delay = mockRequest.delay || 0;
  }

  if (delay === 0) {
    next();
    return;
  }

  await sleep(delay);
  next();
};
