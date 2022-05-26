const path = require("path");
require("dotenv").config({
  path: path.join(process.cwd(), 'src/pre-start/env/development.env'),
});

module.exports = {
  "development": {
    "port": Number(process.env.DB_PORT),
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "test": {
    "port": Number(process.env.DB_PORT),
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  "production": {
    "port": Number(process.env.DB_PORT),
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  }
}

