import fs from 'fs';
import { rootPath } from '../root-path';

export const deleteFileFromStorage = (previewLink: string) => (
    fs.unlink(`${rootPath}/assets/${previewLink}`, (err) => {
        if (err) {
            throw new Error(err.message)
        }
    })
)
