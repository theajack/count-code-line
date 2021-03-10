const fs = require('fs');
const path = require('path');
const {singleLineLog, log, chalk} = require('./log');
const jschardet = require('jschardet');

const line = (process.platform === 'win32') ? '\r\n' : '\n';
const emptyHead = '[ \t]*';
const linebreakReg = new RegExp(line, 'g');
const multiEmptyLineReg = new RegExp(`(${emptyHead}${line})+`, 'g');
const headTailEmptyLineReg = new RegExp(`(^${emptyHead}${line})|(${emptyHead}${line}$)`, 'g');

let traceStr = '';

function traverse ({
    base,
    filePath,
    config
}) {
    log('Start counting...');
    const result = traverseBase({base, filePath, name: 'ROOT', config, deep: 0, headerStr: ''});
    fs.writeFileSync(
        path.join(base, config.output),
        JSON.stringify(result, null, 4),
        'utf-8'
    );
    if (config.outputTrace) {
        // console.log('config.outputTraceconfig.outputTrace', config.outputTrace);
        fs.writeFileSync(
            path.join(base, config.outputTrace),
            `Total File Number: ${result.fileNumber}\r\nTotal Lines: ${result.lines}\r\nTotal Characters: ${result.characters}\r\n\r\n` + traceStr,
            'utf-8'
        );
    }
    log(`\r\nTotal File Number: ${result.fileNumber}\r\nTotal Lines: ${result.lines}\r\nTotal Characters: ${result.characters}\r\n`);
    log(`Done. Open "${config.output}" ${config.outputTrace ? `and "${config.outputTrace}" ` : ''}to see details`);
}
function traverseBase ({base, filePath, name, config, headerStr}) {
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
            trverFiles.push({base, filePath: filePathName, name, config, headerStr});
        } else {
            pushIntoChildrens(traverseBase({base, filePath: filePathName, name, config, headerStr: headerStr + '  '}));
        }
        if (i === files.length - 1) {
            trverFiles.forEach(options => {
                pushIntoChildrens(handleFile(options));
            });
        }
    }
    let lines = 0;
    let characters = 0;
    let fileNumber = 0;
    childrens.forEach(item => {
        lines += item.lines;
        characters += item.characters;
        fileNumber += item.fileNumber || 1;
    });
    return {
        name,
        type: 'dir',
        fullPath: filePath,
        fileNumber,
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

function handleFile ({base, filePath, name, config, headerStr}) {
    if (!checkNeedTraverse({filePath, config})) {
        return null;
    }
    singleLineLog(`${filePath}...`);
    let content = fs.readFileSync(path.join(base, filePath), {encoding: 'utf-8'});
    if (config.ignoreEmptyLine) {
        // 去除中间的空行和首位空行
        content = content.replace(multiEmptyLineReg, line).replace(headTailEmptyLineReg, '');
    }
    const encoding = jschardet.detect(content).encoding;
    // 排除非文本文件
    const header = `${headerStr}${filePath}: `;
    if (config.encodings.indexOf(encoding) === -1 && content !== '') {
        logSingle(
            `${header}(ignored encoding=${encoding})\r\n`,
            `${header}${chalk.yellow(`(ignored encoding=${encoding})`)}`,
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
        `${header}[lines=${lines}] [characters=${characters}]\r\n`,
        `${header}${chalk.green(`[lines=${lines}]`)} ${chalk.blue(`[characters=${characters}]`)}`,
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