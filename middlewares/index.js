const mock = require("./mock");

module.exports = ({ server, services }) => {
  server.use("/proxy", mock({ server, services }));
};
