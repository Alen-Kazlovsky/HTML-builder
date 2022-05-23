const fs = require('fs');
const path = require('path');
const { writeFile } = require('fs');
const { readdir } = require('fs/promises');
const fsPromises = fs.promises;
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function createBundleCss() {
    writeFile(bundlePath, '', (err) => {
        if (err) {
            throw err;
        }
    });
}
createBundleCss();

async function getInnerText() {
    const files = await readdir(path.join(__dirname, 'styles'));
    for (const file of files) {
        const currentPathToFile = path.join(__dirname, 'styles', file);
        const fileStats = await fsPromises.stat(currentPathToFile);
        const extension = file.split('.')[1];
        if (fileStats.isFile() && extension == 'css') {
            fs.readFile(currentPathToFile, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                fs.appendFile(bundlePath, `${data}`, (err) => {
                    if (err) throw err;
                });
            });
        }
    }
    return;
}
getInnerText();