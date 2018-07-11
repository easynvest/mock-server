#!/usr/bin/env node

const program = require("commander");
const { prompt } = require("inquirer");
const fs = require("fs");
const path = require("path");
const mockServer = require("../app");

const localPath = process.cwd();

const questions = [
  {
    type: "confirm",
    name: "mockPath",
    message: "Deseja criar uma pasta para o mock-server..."
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
    validate: input => {
      const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
      return !!input.trim() && regex.test(input);
    },
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
    prompt(questions).then(responses => {
      if (responses.mockPath) {
        const mockPath = path.join(localPath, "./mock-server");
        const resourcesPath = path.join(localPath, responses.resourcesPath);

        if (!fs.existsSync(mockPath)) {
          fs.mkdirSync(mockPath);
        }

        if (!fs.existsSync(resourcesPath)) {
          fs.mkdirSync(resourcesPath);
        }

        const mockConfigFile = fs.createWriteStream(path.join(localPath, "./mock-server.conf.js"), {
          flags: "w",
          encoding: "utf-8"
        });
        const rewriteRoutesFile = fs.createWriteStream(path.join(mockPath, "./rewriteRoutes.js"), {
          flags: "w",
          encoding: "utf-8"
        });

        mockConfigFile.end(
          `module.exports = {\n  port: '${responses.port}',\n  uriApi: '${
            responses.api
          }',\n  rewriteRoutes: '${responses.mockPath}/rewriteRoutes.js',\n  resourcesPath: '${
            responses.resourcesPath
          }'\n}\n`
        );
        rewriteRoutesFile.end(`module.exports = {\n  '/api/*': '/$1'\n}\n`);
      }
    });
  });

program
  .command("start")
  .alias("s")
  .description("Start mock-server")
  .action(mockServerConfigName => {
    const cacheOnly = program.cacheOnly || false;

    if (typeof mockServerConfigName === "object") {
      mockServerConfigName = "mock-server.conf.js";
    }

    const configFile = path.join(localPath, mockServerConfigName);

    if (!fs.existsSync(configFile)) {
      console.error(
        `Não foi possivel encontrar o arquivo de configuração:\nArquivo: "${configFile}"`
      );
      return;
    }

    const config = require(configFile);
    const app = mockServer(config, cacheOnly);
    const port = config.port || 3001;

    app.set("port", port);
    app.listen(port, function(err) {
      if (err) console.log(err);
      console.log(`JSON Server is running: http://localhost:${port}/ point to => ${config.uriApi}`);
    });
  })
  .on("cache", () => console.log("OLA MUNDO CACHE"));

program
  .version("0.1.0")
  .option("--cache-only", "Start mock-server without proxy")
  .parse(process.argv);
