const fs = require('fs');
const path = require('path');
const {singleLineLog, log, chalk} = require('./log');
const jschardet = require('jschardet');

const linebreakReg = new RegExp(((process.platform === 'win32') ? '\r\n' : '\n'), 'g');

let traceStr = '';

function traverse ({
    base,
    filePath,
    config
}) {
    log('Start counting...');
    const result = traverseBase({base, filePath, name: 'ROOT', config});
    fs.writeFileSync(
        path.join(base, config.output),
        JSON.stringify(result, null, 4),
        'utf-8'
    );
    if (config.outputTrace) {
        console.log('config.outputTraceconfig.outputTrace', config.outputTrace);
        fs.writeFileSync(
            path.join(base, config.outputTrace),
            `Total Lines: ${result.lines}\r\nTotal Characters: ${result.characters}\r\n` + traceStr,
            'utf-8'
        );
    }
    log(`Done. Open '${config.output}' to see details`);

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

function logSingle (str, logStr, config) {
    singleLineLog(logStr);
    if (config.outputTrace) {
        traceStr += str;
    }
    log();
}

function handleFile ({base, filePath, name, config}) {
    if (!checkNeedTraverse({filePath, config})) {
        return null;
    }
    singleLineLog(`${filePath}...`);
    const content = fs.readFileSync(path.join(base, filePath), {encoding: 'utf-8'});
    const encoding = jschardet.detect(content).encoding;
    // 排除非文本文件
    if (config.encodings.indexOf(encoding) === -1 && content !== '') {
        logSingle(
            `${filePath}: (ignored encoding=${encoding})\r\n`,
            filePath + ': ' + chalk.yellow(`(ignored encoding=${encoding})`),
            config
        );
        return null;
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
    logSingle(
        `${filePath}: [lines=${lines}] [characters=${characters}]\r\n`,
        filePath + ': ' + chalk.green(`[lines=${lines}]`) + ' ' + chalk.blue(`[characters=${characters}]`),
        config
    );
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
    } else if (checkRegs(filePath, config.defaultExcludesFileTypeRegs)) {
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