const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const customMiddlewares = require("./middlewares");
const { setConfig } = require("./config");

const configureApp = (config, cacheOnly) => {
  setConfig(config);
  const services = require("./services")();
  const app = express();

  app.locals.requestApi = !cacheOnly;

  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", index({ server: app, services }));

  customMiddlewares({ server: app, services });

  app.use(function(req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

  return app;
};

module.exports = configureApp;
