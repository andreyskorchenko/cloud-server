## Installation

```bash
$ npm install
```

## Required make a file .env

```
DB_URL=url
DB_NAME=name
DB_USERNAME=user
DB_PASSWORD=password

JWT_ACCESS_SECRET=secret
JWT_ACCESS_EXPIRESIN=expiresin
JWT_REFRESH_SECRET=secret
JWT_REFRESH_EXPIRESIN=expiresin

MAX_SIGNIN_DEVICES=quantity
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
