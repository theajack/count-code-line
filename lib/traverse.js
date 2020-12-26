const fs = require('fs');
const path = require('path');
const {singleLineLog, log} = require('./log');

const linebreakReg = new RegExp(((process.platform === 'win32') ? '\r\n' : '\n'), 'g');

function traverse ({
    base,
    filePath,
    config
}) {
    const result = traverseBase({base, filePath, name: 'ROOT', config});
    console.log();
    fs.writeFileSync(path.join(base, config.output), JSON.stringify(result, null, 4), 'utf-8');
    singleLineLog('done');
}
function traverseBase ({base, filePath, name, config}) {
    if (!checkNeedTraverse({filePath, config})) {
        return null;
    }
    const childrens = [];
    const files = fs.readdirSync(base + filePath);
    const trverFiles = [];
    const pushIntoChildrens = (result) => {
        if (result) {
            childrens.push(result);
        }
    };

    for (var i = 0; i < files.length; i++) {
        const name = files[i];
        const filePathName = `${filePath}/${files[i]}`;
        const data = fs.statSync(path.join(base + filePath, name));
        
        if (data.isFile()) {
            trverFiles.push({base, filePath: filePathName, name, config});
        } else {
            pushIntoChildrens(traverseBase({base, filePath: filePathName, name, config}));
        }
        if (i === files.length - 1) {
            trverFiles.forEach(options => {
                pushIntoChildrens(handleFile(options));
            });
        }
    }
    let lines = 0;
    let characters = 0;
    childrens.forEach(item => {
        lines += item.lines;
        characters += item.characters;
    });
    return {
        name,
        type: 'dir',
        fullPath: filePath,
        lines,
        characters,
        childrens,
    };
}
var jschardet = require('jschardet');
function handleFile ({base, filePath, name, config}) {
    if (!checkNeedTraverse({filePath, config})) {
        return null;
    }
    const content = fs.readFileSync(path.join(base, filePath), {encoding: 'utf-8'});
    if (name === 'a.js' || name === 'close.png' || name === '2.m4a' || name === '1.mp4') {

        console.log(name);
        // const buffer = fs.readFileSync(path.join(base, filePath));
        // console.log(jschardet.detect(content));
    }
    const characters = content.length;
    let lines = 0;
    if (characters !== 0) {
        const res = content.match(linebreakReg);
        if (res) {
            lines = res.length + 1; ;
        } else {
            lines = 1;
        }
    }
    return {
        name,
        type: 'file',
        fullPath: filePath,
        lines,
        characters,
    };
}

function checkNeedTraverse ({
    filePath,
    config
}) {
    if (checkRegs(filePath, config.includesRegs)) {
        return true;
    } else if (checkRegs(filePath, config.excludesRegs)) {
        return false;
    } else if (checkRegs(filePath, config.defaultExcludesRegs)) {
        return false;
    }
    return true;
}

function checkRegs (filePath, regs) {
    for (let i = 0; i < regs.length; i++) {
        if (regs[i].test(filePath)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    traverse
};