## Description

Backend restaurants

## Installation (first setup)

Install dependencies
```bash
$ npm install
```

Run app (more info in the 'pakage.json' file, scripts section)
```bash
$ npm run start:dev
```

## Data Base
Example full cycle of migrations

```bash
$ npm run build => sequelize-mig migration:make -n add-users-table
=> npx sequelize-cli db:migrate
```

Create migrations using changes
(app has to be built with these changes before)
```bash
$ sequelize-mig migration:make -n <migration name>
```

Apply migrations

```bash
$ npx sequelize-cli db:migrate
```

Revert last migration

```bash
$ npx sequelize-cli db:migrate:undo
```

Docker create and start
```bash
$ docker build -t alexanderukhanov/back .
$ docker push alexanderukhanov/back
$ docker build -t alexanderukhanov/front .
$ docker push alexanderukhanov/front
$ docker-compose up
```
Wipe project from pc
```bash
$ docker-compose rm
$ docker volume rm back_db-data
$ docker rmi alexanderukhanov/back alexanderukhanov/front
$ docker rmi mysql node
```
