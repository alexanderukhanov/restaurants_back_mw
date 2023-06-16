import "./pre-start"; // Must be the first import
import app from "./Server";
import logger from "./shared/logger";
import { sequelize } from "./db/models";

// Start the server
const port = Number(process.env.PORT || 3001);

sequelize.authenticate().then(() => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
}).catch(err => console.log(err));
