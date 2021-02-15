const { Client } = require('@calmdownval/mc-rcon');
const { spawn } = require('child_process');
const { copyFile, watch } = require('fs');
const { basename, join } = require('path');
const { promisify } = require('util');

const repositoryRoot     = join(__dirname, '../');
const sourceDirPath      = join(repositoryRoot, './lib/src/main');
const jarSourcePath      = join(repositoryRoot, './lib/build/libs/AreYouBlind-1.0.0.jar');
const jarDestinationPath = join('D:\\Dokumenty\\Spigot\\plugins', basename(jarSourcePath));

function exec(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            env: process.env,
            stdio: 'inherit',
            shell: true
        });

        child.on('error', reject);
        child.on('exit', resolve);
    })
}

async function rebuild() {
    const rcon = new Client();
    try {
        console.log('> re-building');
        const exitCode = await exec('gradle', [ 'build' ], repositoryRoot);
        if (exitCode !== 0) {
            throw new Error('Build failed...');
        }

        console.log('> copying binary');
        await promisify(copyFile)(jarSourcePath, jarDestinationPath);

        console.log('> issuing server reload');
        await rcon.connect('localhost');
        await rcon.login('sup3r-s3cr3t');
        await rcon.exec('plugman reload AreYouBlind');
    }
    catch (ex) {
        console.error(ex);
    }
    finally {
        await rcon.close();
    }
}

let debounceHandle = null;
let isBusy = false;

watch(sourceDirPath, { recursive: true }, () => {
    if (isBusy) {
        return;
    }

    if (debounceHandle !== null) {
        clearTimeout(debounceHandle);
    }

    debounceHandle = setTimeout(async () => {
        isBusy = true;
        await rebuild();
        debounceHandle = null;
        isBusy = false;
    }, 5000);
});
