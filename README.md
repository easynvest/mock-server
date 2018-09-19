# Mock Server
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors)

Mock Server is an application that allows the mocking of requests served over HTTP or HTTPS, it also enables the creation of different response scenarios for those requests.

In addition to other cases, this is quite useful in situations where in order to get you work done you need to use an API that is not completely finished. On these occasions, Mock Server will help you simulate this API's endpoints and finish your work without delays.

## Installation

With NPM:
```sh
$ npm install @easynvest/mock-server --save-dev
```

With Yarn:
```sh
$ yarn add @easynvest/mock-server --dev
```

## Configuration
Configure Mock Server with the command bellow:
```sh
$ mock-server init
```
Start the server:
```sh
$ mock-server start
```
For more information about the CLI:
```sh
$ mock-server --help
```
## Features

### Cache
When this feature is enabled, Mock Server will not dispatch requests to the configured endpoint, tha is, it will immediately return the last retrieved value from the requested endpoint. In other words, Mock Server will be in offline mode.
### Scenarios
//TODO
### Endpoints
> `GET      /	                `
* Returns the configuration setup
> `GET      /request-api      `
* Toggle the cache feature
> `GET      /requests         `
* Returns all the mocked requests
> `POST     /requests         `
* Adds a new request
```
{
    "type": custom | default ,
    "method": [POST, GET, PUT, DELETE, PATCH, HEAD],
    "url": Path,
    "status": HTTP status,
    "response": Resposta da requisição,
    "query": Parâmetros de URL
  }
```
> `GET      /requests/:id`
* Returns the mocked request metada with the specified ID
> `PUT      /requests/:id`
* Updates the mocked request metada with the specified ID
> `DELETE   /requests/:id`
* Remove the mocked request metada with the specified ID
> `GET      /scenarios`
* Returns the existing scenarios

## Documentação
//TODO
## Exemplos de uso
//TODO
## Contribuindo
The main goal of this repository is evolve Mock Server so it can increasingly contribute with the agility and praticity in the software development, therefore any kind of contribution is welcome. If you wish join this purpose read our [Getting Started Guide](../contributing/GETTING_STARTED.md) to learn more.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars0.githubusercontent.com/u/806519?s=400&v=4" width="100px;"/><br /><sub><b>Guilherme Mangabeira Gregio</b></sub>](https://github.com/guilhermegregio)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=guilhermegregio "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=guilhermegregio "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=guilhermegregio "Tests") [🐛](https://github.com/guilhermegregio/mock-sever/issues?q=author%3Aguilhermegregio "Bug reports") [💡](#example-guilhermegregio "Examples") [🔧](#tool-guilhermegregio "Tools") | [<img src="https://avatars1.githubusercontent.com/u/7875365?v=4" width="100px;"/><br /><sub><b>Lucas de Castro</b></sub>](https://github.com/LucasdeCastro)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=LucasdeCastro "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=LucasdeCastro "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=LucasdeCastro "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3528126?v=4" width="100px;"/><br /><sub><b>Marcelo Silva</b></sub>](https://github.com/iamtchelo)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=iamtchelo "Code") | [<img src="https://avatars3.githubusercontent.com/u/11283132?v=4" width="100px;"/><br /><sub><b>Bruno Braga Chagas</b></sub>](https://github.com/brunobc182)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=brunobc182 "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=brunobc182 "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=brunobc182 "Tests") | [<img src="https://avatars3.githubusercontent.com/u/2213926?v=4" width="100px;"/><br /><sub><b>Rafael Lucio</b></sub>](https://github.com/rafaellucio)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=rafaellucio "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=rafaellucio "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=rafaellucio "Tests") [🐛](https://github.com/guilhermegregio/mock-sever/issues?q=author%3Arafaellucio "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/25637978?v=4" width="100px;"/><br /><sub><b>sampaiojulio</b></sub>](https://github.com/sampaiojulio)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=sampaiojulio "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=sampaiojulio "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=sampaiojulio "Tests") | [<img src="https://avatars2.githubusercontent.com/u/3047016?v=4" width="100px;"/><br /><sub><b>Wellyngton Amaral Leitão</b></sub>](http://www.wellyngton.com/)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=wellyal "Code") [📖](https://github.com/guilhermegregio/mock-sever/commits?author=wellyal "Documentation") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=wellyal "Tests") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars0.githubusercontent.com/u/8808895?v=4" width="100px;"/><br /><sub><b>Celso Henrique</b></sub>](https://github.com/celso-henrique)<br />[💻](https://github.com/guilhermegregio/mock-sever/commits?author=celso-henrique "Code") [⚠️](https://github.com/guilhermegregio/mock-sever/commits?author=celso-henrique "Tests") |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!