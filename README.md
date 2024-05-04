## Installation

```bash
$ npm install
```

## Required make a file .env

```
DB_URL=url
DB_NAME=dbname
DB_USERNAME=username
DB_PASSWORD=password

JWT_SECRET=secret
JWT_ACCESS_EXPIRESIN=expiresin
JWT_REFRESH_EXPIRESIN=expiresin

MAX_SIGNIN_DEVICES=quantity

MAIL_FROM=example<username@domain.com>
MAIL_HOST=smtp.example.com
MAIL_PORT=port
MAIL_SECURE=true|false
MAIL_AUTH_USER=username@domain.com
MAIL_AUTH_PASS=password

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
