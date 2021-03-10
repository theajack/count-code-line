#!/usr/bin/env node
const count = require('../lib/count');
const {program} = require('commander');

function main () {

    program
        .version(require('../package').version)
        .usage('<command> [options]')
        .option('-o, --output <value>', 'Output calculation results. (Incoming file directory, default is "count.output.json")')
        .option('-ot, --output-trace <value>', 'Output calculation results in text form. (Incoming file directory)')
        .option('-iel, --ignore-empty-line', 'Ignore Empty Line, default is 0')
        .option('-i, --includes <value,...>', 'Need to include directories and folders, divided by ",".')
        .option('-e, --excludes <value,...>', 'Directories and folders that do not need to be included, divided by ",".')
        .parse(process.argv);
    
    let config = {};

    const options = program.opts();

    if (options.output) {
        config.output = options.output;
    }
    if (options.outputTrace) {
        config.outputTrace = options.outputTrace;
    }
    if (options.ignoreEmptyLine) {
        config.ignoreEmptyLine = true;
    }
    if (options.includes) {
        config.includes = options.includes.split(',');
    }
    if (options.excludes) {
        config.excludes = options.excludes.split(',');
    }
    if (Object.keys(config).length === 0) {
        config = null;
    }
    count(config);
}
main();