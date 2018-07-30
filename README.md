# Mock Server
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
> Caso tenha a necessidade de fazer mock de api com a possibilidade de criar diversos cenários

O Mock Server pode ser usado para mockar qualquer sistema que você integre via HTTP ou HTTPS (ou seja, serviços, sites, etc).

Quando o Mock Server recebe um pedido, ele corresponde ao pedido em relação às expectativas ativas que foram configuradas.

O proxy do Mock Server pode ser usado para registrar de forma transparente todas as solicitações enviadas por um sistema (por exemplo, um aplicativo ou conjunto de aplicativos).

O Mock Server permite que você mexa com qualquer servidor ou serviço ao qual você se conecta por meio de HTTP ou HTTPS, como um serviço REST ou RPC.

## Desenvolvido

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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/7875365?v=4" width="100px;"/><br /><sub><b>Lucas de Castro</b></sub>](https://github.com/LucasdeCastro)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=LucasdeCastro "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=LucasdeCastro "Documentation") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!