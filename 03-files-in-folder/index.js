const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const fsPromises = fs.promises;

async function answer() {
    const files = await readdir(path.join(__dirname, 'secret-folder'));
    for (const file of files) {
        const fileStats = await fsPromises.stat(path.join(__dirname, 'secret-folder', file));
        if (fileStats.isFile()) {
            const [fileName, extension] = file.split('.');
            const fileSize = fileStats.size / 1024 + 'kb';
            console.log(`${fileName} - ${extension} - ${fileSize}`);
        }
    }
}

answer();