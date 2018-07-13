const fs = require("fs");
const path = require("path");
const mockServer = require("../app");
const localPath = process.cwd();
const { cacheOnly = false, mockServerConfigName = "mock-server.conf.js" } = process.env;

const configFile = path.join(localPath, mockServerConfigName);

if (!fs.existsSync(configFile)) {
  console.error(`Não foi possivel encontrar o arquivo de configuração:\nArquivo: "${configFile}"`);
  return;
}

const config = require(configFile);
const app = mockServer(config, cacheOnly);
const port = config.port || 3001;

app.set("port", port);
app.listen(port, function(err) {
  if (err) console.log(err);
  console.log("\n> Server Start\n");
});
