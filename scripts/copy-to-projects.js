const fs = require('fs');
const path = require('path');
const cpx = require('cpx');
const glob = require('glob');

const srcMvPlugins = path.join(__dirname, '..', '_dist', 'Torigoya_*.js');

glob.sync(path.join(__dirname, '..', 'projects', '*')).forEach((projectDir) => {
    try {
        const projectType = fs.readFileSync(path.join(projectDir, 'Game.rpgproject'), 'utf-8');
        if (projectType.startsWith('RPGMV')) { // MV Project
            cpx.watch(srcMvPlugins, path.join(projectDir, 'js', 'plugins'));
        }
    } catch (_) {
    }
});
