function buildPathRules (array) {
    return array.map((item, index) => {
        if (item[0] !== '/') {
            item = '/' + item;
            array[index] = item;
        }
        let reg = '';
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

module.exports = {buildPathRules};