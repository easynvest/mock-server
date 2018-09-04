# Mock Server
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)

O Mock Server é uma aplicação que te permite simular requisições servidas via HTTP ou HTTPS, bem como criar diferentes cenários de respostas destas requisições.

Além de outros casos, isto é bastante últil em situações onde você precisa utilizar uma API que não está completamente finalizada para dar continuidade ao seu trabalho. Nestas ocasiões, o Mock Server te ajudará a simular os endpoints desta API e não atrasar a sua entrega.

## Instalação

Via NPM:
```sh
$ npm install @easynvest/mock-server --save-dev
```

Via Yarn:
```sh
$ yarn add @easynvest/mock-server --dev
```

## Configuração
Configure o Mock Server executando o comando:
```sh
$ mock-server init
```
Inicie o servidor com:
```sh
$ mock-server start
```
Para mais informações sobre a CLI:
```sh
$ mock-server --help
```
## Funcionalidades

### Cache
Com esta funcionalidade habilitada, o Mock Server não disparará requisições para o enpoint configurado, ou seja, retornará imediatamente o último valor obtido para o enpoint solicitado. Em outras palavaras, o Mock Server estará em modo off-line.
### Cenários
//TODO
### Endpoints
> `GET      /	                `
* Retorna instruções de inicialização
> `GET      /request-api      `
* Retorna requests locais do db.json
> `GET      /requests         `
* Retorna as requests existentes no db.json
> `POST     /requests         `
* Adiciona nova request no db.json
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
* Retorna a request correspondente ao id
> `PUT      /requests/:id`
* Atualiza a request correspondente ao id
> `DELETE   /requests/:id`
* Remove a request correspondente ao id
> `GET      /scenarios`
* Retorna as cenários existentes no db.json

## Documentação
//TODO
## Exemplos de uso
//TODO
## Contribuindo
O principal objetivo desse repositório é evoluir o Mock Server para que ele possa contribuir cada vez mais com a agilidade e a praticidade no desenvolvimento de softwares no geral, desta forma toda contribuição é vem vinda. Se você tabém deseja participar desse propósito leia o nosso [Guia de Introdução](../contributing/GETTING_STARTED.pt-BR.md) para mais detalhes.
