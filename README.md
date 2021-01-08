# count-code-line

Tool to count the number of lines and characters of project

[计算项目代码行数和字符串的工具] [中文](https://github.com/theajack/count-code-line/blob/master/README.cn.md)

## 0. Features

1. Support to calculate the number of code lines and code characters
2. Rich configuration files, supporting files or folders matching any rule
3. Support json that generates calculation results
4. Support global installation command line use

## 1. Installation

### 1.1 Global installation

```
npm i count-code-line -g
```

### 1.2 Local installation

```
npm i count-code-line -D
```

## 2. Use

### 2.1 Global installation and use

Open the command line tool in any project and run the command

```
count-code-line
```

Successful operation will output the `count.output.json` file in the root directory

### 2.2 Local installation and use

Add the following configuration to the scripts attribute in the package.json file

```
    ...
    "scripts": {
        ...
        "count": "count-code-line"
    },
    ...
```

Then run in the root directory

```
npm run count
```

Successful operation will output the `count.output.json` file in the root directory

### 2.3 nodejs reference

```js
const count = require('count-code-line');
count();
```

## 3. Configuration file

### 3.1 Default configuration files and configuration items

count-code-line supports custom configuration files, the following is the default configuration

```js
module.exports = {
    includes: [], // The directories and files that need to be included are all included by default
    excludes: [], // All directories and files to be excluded are removed by default
    defaultExcludes: [// Directory and files excluded by default
        '.git',
        '.vscode',
        'node_modules',
        'package.json',
        'package-lock.json',
        'yarn-lock.json',
        'count.output.json',
    ],
    defaultExcludesFileType: [// File types excluded by default
        '.zip','.rar','.png','.jpg','.jpeg','.gif','.bmp','.mp3','.wma','.wav', '.mp4','.flv','.mov','.avi','.wmv','.rmvb','.ogg','.avi','.ppt','.pptx', '.doc','.docx','.xls','.xlsx','.psd','.ttf','.fon','.exe','.msi',
    ],
    output:'count.output.json', // The default output result file
    outputTrace: '', // Configure the file for outputting trace results, not output by default
    encodings: [// Supported file encodings, will be ignored for unsupported files
        'ascii',
        'utf8',
        'utf-8',
        'unicode'
    ]
};
```

### 3.2 Custom configuration file

Create a new `count.config.js` file in the project root directory and write the above configuration to override the default configuration

For empty configuration items, the default configuration will be used

### 3.3 Directory matching rules

Configuration items such as includes excludes support fuzzy matching, and the matching rules are as follows

'a' will match all files and folders in the a folder under the root directory; regular: new RegExp(`^/a/.*`)

'a/a.js' only matches the specified file

'a/*' only matches all sub-files in folder a; regular: new RegExp(`^/a/([^/])*$`)

'a/**/*.js' matches all files in the folder a with a suffix of .js; regular: new RegExp(`^/a/([^/])*.js$`)

'a/*.js' only matches all sub-files with .js suffix in folder a; regular: new RegExp(`^/a/([^/])*.js$`)
