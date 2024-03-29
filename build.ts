/**
 * Remove old files, copy.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';
import childProcess from 'child_process';

// Setup logger
const logger = new Logger();
logger.timestamp = false;




(async () => {
    try {
        // Remove current build
        await remove('./dist/');

        // Copy production env file
        await copy('./src/pre-start/env/production.env', './dist/pre-start/env/production.env');
        await copy('./src/logger/errors.log', './dist/logger/errors.log');
        // Copy back-end files
        await copy('./src/assets/.gitkeep', './dist/assets/.gitkeep');
        await exec('tsc --build tsconfig.prod.json', './');
    } catch (err) {
        logger.err(err);
    }
})();


function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, {cwd: loc}, (err, stdout, stderr) => {
            if (!!stdout) {
                logger.info(stdout);
            }
            if (!!stderr) {
                logger.warn(stderr);
            }
            return (!!err ? rej(err) : res());
        });
    });
}
