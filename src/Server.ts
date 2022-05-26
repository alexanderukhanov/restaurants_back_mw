import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';
const cors = require('cors');
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '../src/shared/logger';
import { cookieProps } from './types';

const app = express();
const { BAD_REQUEST } = StatusCodes;

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

app.use(cors({credentials: true, origin: true}));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
