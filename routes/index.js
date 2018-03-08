var express = require("express");
var router = express.Router();

const configureRoutes = ({ server, dbService }) => {
  /* GET home page. */
  router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
  });

  router.get("/request-api", (req, res) => {
    server.locals.requestApi = !server.locals.requestApi;
    res.status(200).json(server.locals.requestApi);
  });

  router.get("/requests", (req, res) => {
    res.status(200).json(dbService.onRequests.requests.value());
  });

  router.get("/scenarios", (req, res) => {
    res.status(200).json(dbService.onScenarios.scenarios.value());
  });

  return router;
};

module.exports = configureRoutes;
