import './pre-start'; // Must be the first import
import { DataTypes, Sequelize } from 'sequelize';
import app from '@server';
import logger from '@shared/logger';

const sequelize = new Sequelize("restaurants", "root", "12345", {
    dialect: "mysql",
    host: "localhost",
    port: Number(process.env.DB_PORT),
    define: {
        timestamps: false
    },
});

// Start the server
const port = Number(process.env.PORT || 3001);

sequelize.authenticate().then(() => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
}).catch(err => console.log(err))

