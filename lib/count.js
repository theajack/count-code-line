
const config = require('./config');
const {traverse} = require('./traverse');
const {pick} = require('./util');
const {buildPathRules} = require('./file-path-rule');

function count () {
    const path = process.cwd();
    try {
        const userConfig = require(path + '/count.config.js');
        pick({
            target: config,
            data: userConfig,
            deep: true,
            ignoreUndf: true,
            traverseArray: false,
        });
    } catch (e) {
    }
    shapeConfig(config);
    traverse({base: path, filePath: '', config});
};

function shapeConfig (config) {
    config.excludesRegs = buildPathRules(config.excludes);
    config.includesRegs = buildPathRules(config.includes);
    config.defaultExcludesRegs = buildPathRules(config.defaultExcludes);
    if (config.output[0] !== '/') {
        config.output = '/' + config.output;
    }
}

module.exports = count;