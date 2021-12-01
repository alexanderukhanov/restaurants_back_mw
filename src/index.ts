import './pre-start'; // Must be the first import
import { Sequelize } from 'sequelize';
import app from '@server';
import logger from '@shared/logger';

export const sequelize = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

// Start the server
const port = Number(process.env.PORT || 3001);

sequelize.authenticate().then(() => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
}).catch(err => console.log(err))

