#!/usr/bin/env node

const program = require("commander");
const { prompt } = require("inquirer");
const fs = require("fs");
const path = require("path");
const debug = require("debug")("easynvest.mock-server:server");
const http = require("http");
const mockServer = require("../app");

const localPath = process.cwd();

const questions = [
  {
    type: "input",
    name: "mockPath",
    message: "Deseja criar uma pasta para o mock-server...",
    default: "./mock-server"
  },
  {
    type: "input",
    name: "port",
    message: "Informe a porta que deseja utiliar o mock...",
    default: "3001"
  },
  {
    type: "input",
    name: "api",
    message: "Informe a url da api..."
  },
  {
    type: "input",
    name: "resourcesPath",
    message: "Informa o local onde deseja armazenar os resources...",
    default: "./mock-server/resources"
  }
];

program
  .command("init")
  .alias("i")
  .description("Generate a mock config")
  .action(() => {
    prompt(questions).then(respostas => {
      const mockPath = path.join(localPath, respostas.mockPath);
      const resourcesPath = path.join(localPath, respostas.resourcesPath);

      if (!fs.existsSync(mockPath)) {
        fs.mkdirSync(mockPath);
      }

      if (!fs.existsSync(resourcesPath)) {
        fs.mkdirSync(resourcesPath);
      }

      const mockConfigFile = fs.createWriteStream(
        path.join(localPath, "./mock-server.conf.js"),
        { flags: "w", encoding: "utf-8" }
      );
      const rewriteRoutesFile = fs.createWriteStream(
        path.join(mockPath, "./rewriteRoutes.js"),
        { flags: "w", encoding: "utf-8" }
      );

      mockConfigFile.end(
        `module.exports = {\n  port: '${respostas.port}',\n  uriApi: '${
          respostas.api
        }',\n  rewriteRoutes: '${
          respostas.mockPath
        }/rewriteRoutes.js',\n  resourcesPath: '${
          respostas.resourcesPath
        }'\n}\n`
      );
      rewriteRoutesFile.end(`module.exports = {\n  '/api/*': '/$1'\n}\n`);
    });
  });

program
  .command("start")
  .alias("s")
  .description("Inicia mock-server")
  .action(mockServerConfigName => {
    const cacheOnly = program.cacheOnly || false;

    if (typeof mockServerConfigName === "object") {
      mockServerConfigName = "mock-server.conf.js";
    }

    let configFile = path.join(process.cwd(), mockServerConfigName);

    if (!fs.existsSync(configFile)) {
      console.error(
        `Não foi possivel encontrar o arquivo de configuração:\nArquivo: "${configFile}"`
      );
      return;
    }

    const config = require(configFile);
    const app = mockServer(config, cacheOnly);
    const port = normalizePort(config.port);
    app.set("port", port);

    const server = http.createServer(app);

    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== "listen") {
        throw error;
      }

      var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case "EACCES":
          console.error(bind + " requires elevated privileges");
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(bind + " is already in use");
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = server.address();
      var bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
      debug("Listening on " + bind);
    }
  });

program
  .version("0.1.0")
  .option("--cache-only", "Inicia mock sem fazer proxy para api")
  .parse(process.argv);
