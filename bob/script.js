const { Client } = require('@calmdownval/mc-rcon');
const { spawn } = require('child_process');
const { copyFile } = require('fs');
const { basename, join } = require('path');
const { promisify } = require('util');

function exec(command, args, cwd = process.cwd()) {
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

const repositoryRoot = join(__dirname, '../');
const jarSourcePath = join(repositoryRoot, './lib/build/libs/Plugins-1.0.0.jar');
const jarDestinationPath = join('D:\\Dokumenty\\Spigot\\plugins', basename(jarSourcePath));

(async () => {
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
        await rcon.exec('plugman reload Plugins');
    }
    catch (ex) {
        console.error(ex);
    }
    finally {
        await rcon.close();
    }
})();