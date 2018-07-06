const delay = require("./delay");
const findDB = require("./findDB");
const cached = require("./cached");
const request = require("./request");
const save = require("./save");
const response = require("./response");

module.exports = ({ server, services }) => {
  server.use("/proxy", findDB({ server, services }));
  server.use("/proxy", delay({ server, services }));
  server.use("/proxy", cached({ server, services }));
  server.use("/proxy", request({ server, services }));
  server.use("/proxy", save({ server, services }));
  server.use("/proxy", response({ server, services }));
};
