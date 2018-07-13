#!/usr/bin/env node

const program = require("commander");
const { prompt } = require("inquirer");
const forever = require("forever-monitor");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

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

function startServer(cache = false, silent = false, fileName) {
  return forever.start("server.js", {
    uid: "server",
    watch: false,
    silent,
    env: {
      cacheOnly: cache,
      mockServerConfigName: fileName
    },
    sourceDir: "./bin/"
  });
}

function infinitPrompt(props) {
  const state = { server: startServer(props.cacheOnly, props.configFile), ...props, silent: true };

  process.on("SIGINT", function() {
    state.server && state.server.stop();
    process.exit(2);
  });

  process.on("exit", function() {
    state.server && state.server.stop();
  });

  const startPrompt = () => {
    console.log(
      props.message,
      chalk.white.bold("\n> Cache-only: ") +
        chalk.yellow.bold(state.cacheOnly ? "active" : "disable"),
      chalk.white.bold("\n> Show log:   ") +
        chalk.yellow.bold(!state.silent ? "active" : "disable") +
        "\n"
    );

    const options = [
      {
        type: "list",
        name: "option",
        message: "Options",
        choices: [
          {
            value: "d",
            name: chalk.hex("#888b8d")(
              " Select to" + (state.cacheOnly ? " Disable " : " Enable ") + "cache-only"
            )
          },
          {
            value: "r",
            name: chalk.hex("#888b8d")(" Select to Restart mock-server")
          },
          {
            value: "s",
            name: chalk.hex("#888b8d")(
              " Select to" + (state.silent ? " Enable log" : " Disable log")
            )
          },
          {
            value: "c",
            name: chalk.hex("#888b8d")(" Select to close mock-server")
          }
        ]
      }
    ];

    prompt(options).then(response => {
      process.stdout.write("\033c");
      switch (response.option) {
        case "r":
          state.server.stop();
          state.server = startServer(state.cacheOnly, state.silent, state.configFile);
          break;
        case "d":
          state.cacheOnly = !state.cacheOnly;
          state.server.stop();
          state.server = startServer(state.cacheOnly, state.silent, state.configFile);
          break;
        case "s":
          state.silent = !state.silent;
          state.server.stop();
          state.server = startServer(state.cacheOnly, state.silent, state.configFile);
          break;
        case "c":
          state.server.stop();
          process.exit(2);
          process.stdout.write("\033c");
          return;
      }

      startPrompt();
    });

    if (!state.silent) console.log("\n");
  };
  startPrompt();
}

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
    const configFile =
      typeof mockServerConfigName === "object" ? "mock-server.conf.js" : mockServerConfigName;

    const configPath = path.join(localPath, configFile);
    const config = require(configPath);
    const message =
      chalk.green.bold("\n> Mock-Server is running: ") +
      chalk.white(`http://localhost:${config.port}/proxy point to => ${config.uriApi}`);

    infinitPrompt({ message, cacheOnly: program.cacheOnly, configFile });
  });

program
  .version("0.1.0")
  .option("--cache-only", "Start mock-server without proxy")
  .parse(process.argv);
