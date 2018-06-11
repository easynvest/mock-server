# Mock Server
> Caso tenha a necessidade de fazer mock de api com a possibilidade de criar diversos cenários

## Desenvolvendo

Este projeto foi construído com Node, Express, Lowdb e mais algumas bibliotecas segue a lista abaixo:

 * body-parser
 * chalk
 * commander
 * cookie-parser
 * debug
 * express
 * form-data
 * fs-extra
 * inquirer
 * lodash-id
 * lowdb
 * morgan
 * node-fetch
 * serve-favicon
 * url

### Pré requisitos

 * Instalação de Nodejs
 * Instalar o pacote no seu projeto conforme abaixo:

```bash
$ npm install @easynvest/mock-server
```

### Configuração

 * Para inicializar as configurações do mock-server é recomendado executar os seguintes comandos abaixo:

```bash
$ mock-server init
```

```bash
# Run
$ mock-server start
```

### CLI - Help

 * Para mais informações sobre as opções de comando ou parâmetros, digite o comando abaixo:

```bash
mock-server --help
```

Exemplo de output:

```
  Usage: mock-server [options] [command]


  Options:

    -V, --version  output the version number
    --cache-only   Inicia mock sem fazer proxy para api
    -h, --help     output usage information


  Commands:

    init|i   Generate a mock config
    start|s  Inicia mock-server
```


## Versionamento

 * [SemVer](http://semver.org/) para versionamento.

## Referências de API

> `GET      /	                `

* Retorna instruções de inicialização

> `GET      /request-api      `

* Retorna requests locais do db.json

> `GET      /requests         `

* Retorna as requests existentes no db.json

> `GET      /scenarios        `

* Retorna as cenários existentes no db.json
