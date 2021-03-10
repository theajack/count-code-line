# count-code-line

计算项目代码行数和字符串的工具

## 0. 特性

1. 支持计算代码行数和代码字符数
2. 丰富的配置文件，支持匹配任意规则的文件或文件夹
3. 支持生成计算结果的json
4. 支持全局安装命令行使用

## 1. 安装

### 1.1 全局安装

```
npm i count-code-line -g
```

### 1.2 本地安装

```
npm i count-code-line -D
```

## 2. 使用

### 2.1 全局安装使用

在任意项目内打开命令行工具，运行一下命令即可

```
count-code-line
```

运行成功会在根目录下输出 `count.output.json` 文件

### 2.2 本地安装使用

在 package.json 文件中 的scripts属性中加入如下配置

```
    ...
    "scripts": {
        ...
        "count": "count-code-line"
    },
    ...
```

然后在根目录下运行

```
npm run count
```

运行成功会在根目录下输出 `count.output.json` 文件

### 2.3 nodejs 引用

```js
const count = require('count-code-line');
count();
// or
count({
    // ...configs in  3.1
});
```

## 3. 配置文件

### 3.1 默认配置文件及配置项

count-code-line 支持自定义配置文件，以下是默认配置

```js
module.exports = {
    includes: [], // 需要包含的目录及文件 默认全部包含
    excludes: [], // 需要排除的目录及文件 默认全部移除
    defaultExcludes: [ // 默认排除的目录及文件
        '.git',
        '.vscode',
        'node_modules',
        'package.json',
        'package-lock.json',
        'yarn-lock.json',
        'count.output.json',
    ],
    defaultExcludesFileType: [ // 默认排除的文件类型
        '.zip', '.rar', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.mp3', '.wma', '.wav', '.mp4', '.flv', '.mov', '.avi', '.wmv', '.rmvb ', '.ogg', '.avi', '.ppt', '.pptx', '.doc','.docx','.xls','.xlsx','.psd','.ttf','.fon','.exe','.msi',
    ],
    output: 'count.output.json', // 默认的输出结果文件
    outputTrace: '', // 配置输出 trace 结果的文件，默认不输出
    encodings: [ // 支持的文件编码，对于不支持的文件将忽略
        'ascii',
        'utf8',
        'utf-8',
        'unicode'
    ],
    ignoreEmptyLine: false,
};
```

### 3.2 自定义配置文件

在项目根目录下新建 `count.config.js` 文件 写入上述配置覆盖默认配置即可

对于为空的配置项，将使用默认配置

### 3.3 目录匹配规则

includes excludes 等配置项均支持模糊匹配，匹配规则如下

'a' 将匹配 根目录下 a 文件夹内的所有文件及文件夹；正则： new RegExp(`^/a/.*`)

'a/a.js' 仅匹配指定文件

'a/*' 仅匹配 a 文件夹内的所有子文件； 正则： new RegExp(`^/a/([^/])*$`)

'a/**/*.js' 匹配 a 文件夹内的所有以 .js 为后缀的文件； 正则： new RegExp(`^/a/([^/])*.js$`)

'a/*.js' 仅匹配 a 文件夹内的所有以 .js 为后缀的子文件； 正则： new RegExp(`^/a/([^/])*.js$`)