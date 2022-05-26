import { Request, Response } from 'express';
import { rootPath } from '../root-path';
import * as fs from 'fs';

export function getImage(req: Request, res: Response) {
    const { name } = req.params;

    const fileName = `${rootPath}/assets/${name}`;
    const readStream = fs.createReadStream(fileName);

    readStream.on('open', function () {
        readStream.pipe(res);
    });

    readStream.on('error', function (err) {
        res.end(err.message);
    });
}
