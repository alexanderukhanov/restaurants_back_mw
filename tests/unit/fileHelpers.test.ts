import fs from "fs";

import { rootPath } from "../../src/root-path";
import { saveFileFromBase64 } from "../../src/helpers/saveFileFromBase64";
import { generatedJwtSecret, TEST_IMAGE_BASE64 } from "../../src/constants";
import { deleteFileFromStorage } from "../../src/helpers/deleteFileFromStorage";

describe('file helpers', () => {
    let savedFile: string | undefined;

    it('save file from base64', async () => {
        await saveFileFromBase64(TEST_IMAGE_BASE64, generatedJwtSecret);

        const files = fs.readdirSync(
            `${rootPath}/assets`
        );
        savedFile = files.find(f => f.match(generatedJwtSecret));

        expect(savedFile).not.toBeUndefined();
    });

    it('delete file', async () => {
        expect(savedFile).not.toBeUndefined();

        deleteFileFromStorage(savedFile as string);

        const files = fs.readdirSync(
            `${rootPath}/assets`
        );
        savedFile = files.find(f => f.match(generatedJwtSecret));

        expect(savedFile).toBeUndefined();
    });
});
