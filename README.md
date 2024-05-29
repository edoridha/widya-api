# API - TEST

## Project Setup

```sh
npm install
```
```sh
go to directory /config/config.json
adjust development configuration for database
create file .env and follow file .envExampple
```

```sh
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

```
npm run dev
```