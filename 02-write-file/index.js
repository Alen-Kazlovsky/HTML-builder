const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Enter some text...\n');

fs.access(path.join(__dirname, 'text.txt'), (err) => {
    if (err) {
        fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
            if (err) {
                throw err;
            } else {
                return;
            }
        });
    }
});

process.on('SIGINT', () => {
    stdout.write('Bye');
    process.exit();
});

stdin.on('data', (data) => {
    const dataCheck = data.toString().trim();
    if (dataCheck == 'exit') {
        stdout.write('Bye');
        process.exit();
    }

    fs.appendFile(path.join(__dirname, 'text.txt'), `${data} `, (err) => {
        if (err) throw err;
    });

    stdout.write('Txt file changed!\n');
});