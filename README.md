## Description

Backend restaurants

## Installation (first setup)

Install dependencies
```bash
$ npm install
```

Create DB to use with app

Run migrations 
```bash
$ yarn run typeorm migration:run
```

Apply seeds
```bash
$ yarn run seed
```

Run app (more info in the 'pakage.json' file, scripts section)
```bash
$ yarn run start
```

## Data Base
```bash
$ npm run build => sequelize-mig migration:make -n add-users-table
=> npx sequelize-cli db:migrate
```
Apply migrations

```bash
$ npx sequelize-cli db:migrate
```

Revert last migration

```bash
$ npx sequelize-cli db:migrate:undo
```

Apply seed
```bash
$ yarn run seed
```

Drop tables in DB, just clear all data in tables
```bash
$ yarn run drop-tables
```

Create migrations using changes in TypeORM entities
(app has to be built with these changes before)
```bash
$ sequelize-mig migration:make -n <migration name>

```

## Running the app 

Development
```bash
$ yarn run start
```
Watch mode
```bash
$ yarn run start:dev
```
Production mode
```bash
$ yarn run start:prod
```

## Learn More
This project was created with <a href="http://nestjs.com/" target="blank">NestJS</a> framework.<br>
For work with DB (MySQL) - <a href="https://typeorm.io/" target="blank">TypeORM</a>.
