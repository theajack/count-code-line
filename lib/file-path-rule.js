function buildPathRules (array) {
    return array.map((item, index) => {
        if (item[0] !== '/') {
            item = '/' + item;
            array[index] = item;
        }
        let reg = '';
        console.log(item);
        if (item.indexOf('/**/*') !== -1) {
            reg = item.replace('/**/*', '/.*');
        } else if (item.indexOf('/*') !== -1) {
            reg = item.replace('/*', '/([^/])*');
        } else {
            reg = `^${item}/.*|^${item}$`;
            return new RegExp(reg);
        }
        return new RegExp(`^${reg}$`);
    });
}

// function buildFileRules (array) {
//     return array.map((item) => {
//         const str = item.replace(/\*\./g, '.*\\.');
//         return new RegExp(str);
//     });
// }

module.exports = {buildPathRules};