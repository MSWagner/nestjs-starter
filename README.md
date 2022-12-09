![Testing](https://github.com/MSWagner/nestjs-starter/workflows/Testing/badge.svg)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Start

Replace the string <b><i>'project-name'</i></b> in all files of the project with your own project name.
(For example with the search/replace function from visual studio code)

<b>Files to edit:</b>

-   docker-compose.yml
-   docker-compose.dev.yml
-   docker-compose.test.yml
-   docker-compose.prod.yml
-   prod.env
-   dev.env
-   test.env
-   test.docker.env

<b>Important to avoid docker container naming conflicts!</b>

## Create or edit your local .env file

Set up the environment variable [COMPOSE_FILE](https://docs.docker.com/compose/reference/envvars/#compose_file) to avoid the 'Found orphan containers' warning:

MacOS:

```
COMPOSE_FILE=docker-compose.prod.yml:docker-compose.dev.yml:docker-compose.test.yml
```

Windows:

```
COMPOSE_FILE=docker-compose.prod.yml;docker-compose.dev.yml;docker-compose.test.yml
```

## Installation

```bash
$ yarn
$ yarn build
```

# Development

## Starting the dev enviornment (Docker Container)

```bash
# create docker network for database connection
$ docker network create project-name-network-dev

# start the app and database in docker containers
$ docker-compose -f 'docker-compose.dev.yml' up

# start first migration to create the db tables
$ yarn db:migrate:dev
```

## Testing Local (without app docker container)

```bash
# start test database in docker container
$ docker-compose -f 'docker-compose.test.yml' up

# start first migration to create the db tables
$ yarn db:migrate:test

# unit tests
$ yarn test

# watch mode
$ yarn test:watch

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Testing in Docker Container

```bash
# start docker containers (app, dev + test)
$ yarn docker:up:hidden

# start first migration to create the db tables
$ yarn docker:db:migrate

# execute tests in the docker container
$ yarn docker:test
```

# Deployment

## First Start

-   To create a docker image + container with the app & database.

```bash
# create network to connect the app with the db
$ docker network create project-name-network

# set the env variables for the docker compose file (I used github secrets in the github actions pipeline)
# build the docker image, create & run the app/db container in detached mode (background) 
$ docker-compose -f 'docker-compose.prod.yml' up -d

# init tables with migration
$ docker-compose exec app yarn db:migrate:prod
```

## Docker App Update

-   To update the docker image and start the new docker container

```bash
$ docker build -t project-name .
$ docker-compose up -d
```

## Docker Migration

-   To run new migrations

```bash
# start migrations
$ docker-compose exec app yarn db:migrate:prod
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

-   Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
-   Website - [https://nestjs.com](https://nestjs.com/)
-   Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
