module.exports = {
    includes: [],
    excludes: [],
    defaultExcludes: [
        '.git',
        '.vscode',
        'node_modules',
        'package.json',
        'package-lock.json',
        'yarn-lock.json',
        'count.output.json',
    ],
    defaultExcludesFileType: [
        '.zip',
        '.rar',
        
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.bmp',

        '.mp3',
        '.wma',
        '.wav',

        '.mp4',
        '.flv',
        '.mov',
        '.avi',
        '.wmv',
        '.rmvb ',

        '.ogg',
        '.avi',
        '.ppt',
        '.pptx',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.psd',

        '.ttf',
        '.fon',
        '.exe',
        '.msi',
    ],
    output: 'count.output.json',
    encodings: [
        'ascii',
        'utf8',
        'utf-8',
        'unicode'
    ],
    detail: {
        total: true,
        eachFile: true,
        line: true,
        character: true,
        ignoreEmptyLine: false,
    }
};

/*
优先级
includes > excludes > defaultExcludesRegs > defaultExcludesFileType
*/


// dir
// a 忽略所有 = a/**/* /^\/a\/.*/ new RegExp(`^/a/.*`)
// + /**/*

// a/* 忽略当前目录下所有 /^\/a\/([^\/])*$/ new RegExp(`^/a/([^/])*$`)
// /* => /([^/])*

// a/*.js 忽略当前目录下所有匹配项 /^\/a\/([^\/])*\.js$/ new RegExp(`^/a/([^/])*.js$`)
// /*=> /([^/])*

// a/**/*.js 忽略当前目录内所有匹配项 /^\/a\/.*\.js$/ new RegExp(`^/a/.*.js$`)
// /**/*=> /.*

// file
// *. => .*\\

/*
返回
[
    {
        lines: 100,
        characters: 1000,
    }
    {
        name: 'lib',
        type: 'dir',
        fullPath: '/lib',
        lines: 20,
        characters: 100,
        childrens: [
            {
                name: 'a.js'
                type: 'file',
                fullPath: '/lib/a.js',
                lines: 20,
                characters: 100,
            }
        ]
    }

]

*/