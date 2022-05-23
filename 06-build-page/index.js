const fs = require('fs');
const path = require('path');

const { mkdir } = require('fs');

const { readdir } = require('fs/promises');
const { copyFile } = require('fs/promises');
const { writeFile } = require('fs/promises');
const { readFile } = require('fs/promises');
const { rm } = require('fs/promises');

const fsPromises = fs.promises;

const bundleFolderPath = path.join(__dirname, 'project-dist');
const bundleCSSPath = path.join(__dirname, 'project-dist', 'style.css');
const bundleHTMLPath = path.join(__dirname, 'project-dist', 'index.html');

const componentsHTMLPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(__dirname, 'project-dist', 'assets');

async function createBundle() {
    await deleteBundleDirectory();
    createFolder();
    await createAssetsFolder();
    createCSSFile();
    await getWholeCSS();
    await createHTMLbundle();
    await copyWholeDirectory();
}
createBundle();


function createFolder() {
    mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });
}

async function createAssetsFolder() {
    mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });
}

async function createCSSFile() {
    await writeFile(bundleCSSPath, '', (err) => {
        if (err) {
            throw err;
        }
    });
}

async function getWholeCSS() {
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
                fs.appendFile(bundleCSSPath, `${data}`, (err) => {
                    if (err) throw err;
                });
            });
        }
    }
    return;
}

async function createHTMLFile(data) {
    await writeFile(bundleHTMLPath, data, (err) => {
        if (err) {
            throw err;
        }
    });
}

async function createHTMLbundle() {
    const files = await readdir(componentsHTMLPath);
    const HTMLcomponents = [];
    for (const file of files) {
        const currentPathToFile = path.join(__dirname, 'components', file);
        const fileStats = await fsPromises.stat(currentPathToFile);
        const [fileName, extension] = file.split('.');
        if (fileStats.isFile() && extension == 'html') {
            const data = await readFile(currentPathToFile, 'utf-8', (err) => {
                if (err) {
                    throw err;
                }
            });
            HTMLcomponents.push({ name: fileName, data: data });
        }
    }

    let templateInnerText = await readFile(
        path.join(__dirname, 'template.html'),
        'utf-8',
        (err) => {
            if (err) {
                throw err;
            }
        }
    );

    HTMLcomponents.forEach((tag) => {
        templateInnerText = templateInnerText.replace(`{{${tag.name}}}`, tag.data);
    });

    await createHTMLFile(templateInnerText);
    return;
}

async function copyFolder(pathToFolder) {
    mkdir(
        path.join(__dirname, 'project-dist', 'assets', pathToFolder), { recursive: true },
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
}

async function copyWholeDirectory(
    pathToFolder = assetsPath,
    pathToCopy = distAssetsPath
) {
    const files = await readdir(pathToFolder);

    for (const file of files) {
        const currentPathToFile = path.join(pathToFolder, file);
        const fileStats = await fsPromises.stat(currentPathToFile);
        if (fileStats.isFile()) {
            await copyFile(currentPathToFile, path.join(pathToCopy, file));
        } else if (fileStats.isDirectory()) {
            const pathToFolderNew = path.join(pathToFolder, file);
            const pathToCopyNew = path.join(pathToCopy, file);
            let tryFolder = path.relative(assetsPath, pathToFolderNew);
            await copyFolder(tryFolder);
            await copyWholeDirectory(pathToFolderNew, pathToCopyNew);
        }
    }
    return;
}


async function deleteBundleDirectory() {
    await rm(bundleFolderPath, { recursive: true, force: true });
    return;
}