# Mock Server
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

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
