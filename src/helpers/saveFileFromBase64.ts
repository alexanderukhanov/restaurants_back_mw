import fs from 'fs';
import { rootPath } from '../root-path';

export const saveFileFromBase64 = async (base64: string, entityName: string) => {
    const base64Image = base64.split(';base64,');
    const fileExtension = base64Image[0].split('/')[1] || 'jpeg';
    const fileName = `${Date.now()}-${entityName}.${fileExtension}`;

    await fs.promises.writeFile(
        `${rootPath}/assets/${fileName}`,
        base64Image[1], { encoding: 'base64' }
    ).catch((e) => {
        throw Error(e.message);
    })

    return fileName;
}
