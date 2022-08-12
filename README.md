<h1 style="text-align:center; color:#00A9FF">O'Paradis's API (still working on it)<h1>

[![license](https://img.shields.io/github/license/nhn/tui.editor.svg)](https://github.com/MrSnakeDoc/oparadis/blob/dev/licence)
[![NPM version](https://img.shields.io/badge/NodeJS-16.16.0-blue)](https://nodejs.org/en/)
[![NestJS](https://img.shields.io/badge/NestJS-9.0.6-blue)](https://nestjs.com/)
[![PostgreSQL Version](https://img.shields.io/badge/PostgreSQL-14-orange)](https://www.postgresql.org/)
[![Redis Version](https://img.shields.io/badge/Redis-6.2.6-orange)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-4.0.0-brightgreen)](https://www.prisma.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-6.7.7-brightgreen)](https://nodemailer.com/about/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-1.30.0-brightgreen)](https://cloudinary.com/)
[![Passport](https://img.shields.io/badge/passport-0.6.0-brightgreen)](https://www.npmjs.com/package/passport)
[![Passport-jwt](https://img.shields.io/badge/passport--jwt-4.0.0-brightgreen)](https://www.npmjs.com/package/passport-jwt)
[![Argon2](https://img.shields.io/badge/argon2-0.28.5-brightgreen)](https://argon2.online)

<img src="https://res.cloudinary.com/oparadis/image/upload/c_scale,w_1200/v1660048371/github/Nestjs.jpg" style="width:700px;"/>

## 🚩 Table of Contents

- [🚩 Table of Contents](#-table-of-contents)
- [Packages](#packages)
  - [DATABASES](#databases)
  - [PACKAGES](#packages-1)
- [Why did we develop this API ?](#why-did-we-develop-this-api-)
  - [What services are we proposing](#what-services-are-we-proposing)
    - [Main features](#main-features)
- [Setup](#setup)

## Packages

### DATABASES

| Name                                        | Description                              |
| ------------------------------------------- | ---------------------------------------- |
| [`PostgreSQL`](https://www.postgresql.org/) | Relational Database                      |
| [`RedisDB`](https://redis.io/)              | Distributed in-memory key–value database |

### PACKAGES

[![Nodemailer](https://img.shields.io/badge/Nodemailer-6.7.7-brightgreen)](https://nodemailer.com/about/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-1.30.0-brightgreen)](https://cloudinary.com/)
[![Passport](https://img.shields.io/badge/passport-0.6.0-brightgreen)](https://www.npmjs.com/package/passport)
[![Passport-jwt](https://img.shields.io/badge/passport--jwt-4.0.0-brightgreen)](https://www.npmjs.com/package/passport-jwt)
[![Argon2](https://img.shields.io/badge/argon2-0.28.5-brightgreen)](https://argon2.online)

| Name                                                                                 | Description                                                                                                           |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [NestJS](http://nestjs.com/)                                                         | Fast, unopinionated, minimalist web framework for Node.js                                                             |
| [Prisma](https://www.prisma.io/)                                                     | Non-blocking PostgreSQL client for Node.js                                                                            |
| [cache-manager](https://www.npmjs.com/package/cache-manager)                         | A cache module for nodejs that allows easy wrapping of functions in cache, tiered caches, and a consistent interface. |
| [cache-manager-redis-store](https://www.npmjs.com/package/cache-manager-redis-store) | Redis cache store for node-cache-manager                                                                              |
| [Argon2](https://argon2.online)                                                      | A library to help you hash passwords.                                                                                 |
| [Passport](https://www.npmjs.com/package/passport)                                   | Simple, unobtrusive authentication for Node.js.                                                                       |
| [Passport-jwt](https://www.npmjs.com/package/passport-jwt)                           | Passport authentication strategy using JSON Web Tokens                                                                |
| [Nodemailer](https://nodemailer.com/about/)                                          | Send emails from Node.js                                                                                              |
| [cors](https://www.npmjs.com/package/cors)                                           | Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options       |
| [dotenv](https://www.npmjs.com/package/dotenv)                                       | Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env                 |
| [cloudinary](https://www.npmjs.com/package/cloudinary)                               | Cloud service that offers a solution to a web application's entire image management pipeline                          |

## Why did we develop this API ?

This API was the pinacle of our bootcamp. We were asked to develop a full app with frontend and backend as a end of study project. The frontend was developed separately from the backend.
The goal of this project was to provide a way for people to experience the home-sitting.
As a matter of fact, all similar websites are only oriented to retired people. We wanted to open this type of experience to a larger group and let responsible young people to be able to enjoy this type of holidays.

### What services are we proposing

#### Main features

- **User creation and edit** : Create your profile and edit it as you want.
- **Add a house profile with photos**: Create your house profile, and find a home-sitter to keep your house.
- **Add animals and plants** : Create a profile to your animals or plants that you want home-sitter to take care of.
- **Add your absences** : Add your absences to let home-sitter know when they can apply to come to your house.

## Setup

Clone the repository to your local computer. Install node modules, install databases, create cloudinary account.

With https:

```bash
git clone https://github.com/MrSnakeDoc/oparadis.git
cd oparadis
yarn
```

With ssh:

```bash
git clone git@github.com:MrSnakeDoc/oparadis.git
cd oparadis
yarn
```

First you need to have two database local or remote.

For local with docker:

```bash
yarn db:dev:restart
yarn redis:dev:create
```

Then you need to fill your .env file with environment variables.

```bash
cp .env.example .env
```

You will need to create an account on [Cloudinary](https://cloudinary.com/) and take the cloud_name, api_key, and api_secret and add it to the .env file.

Then you can :

```bash
yarn start:dev
```
