import fs from 'fs';
import { rootPath } from '../root-path';

export const deleteFileFromStorage = (previewLink: string) => {
    try {
        fs.unlinkSync(`${rootPath}/assets/${previewLink}`);
    } catch (e) {
        throw Error(e.message);
    }
}
