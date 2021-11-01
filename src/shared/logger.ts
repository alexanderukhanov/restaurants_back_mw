import { rootPath } from '../root-path';
import * as path from 'path';
import Logger, { LoggerModes } from 'jet-logger';

/**
 * Setup the jet-logger.
 *
 * Documentation: https://github.com/seanpmaxwell/jet-logger
 */

const logFilePath = path.join(rootPath, '/logger/errors.log')
process.env.JET_LOGGER_MODE = process.env.NODE_ENV === 'development'
    ? LoggerModes.Console
    : LoggerModes.File;
process.env.JET_LOGGER_FILEPATH = logFilePath;

const logger = new Logger();

export default logger;
