

const {TYPE} = require('./constant');

function isNumber (v) {
    return typeIs(v, TYPE.NUMBER);
}
function isNull (v) {
    return typeIs(v, TYPE.NULL);
}
function isBool (v) {
    return typeIs(v, TYPE.BOOLEAN);
}
function isString (v) {
    return typeIs(v, TYPE.STRING);
}
function typeIs (v, t) {
    if (t === TYPE.ARRAY) {
        return isArray(v);
    }
    if (t === TYPE.NULL) {
        return v === null;
    }
    return typeof v === t;
}
function isArray (v) {
    return v instanceof Array;
}
function isObject (v) {
    return typeIs(v, TYPE.OBJECT);
}
function isJson (v) {
    if (isObject(v) && !isNull(v) && isFunc(v.constructor)) {
        const name = v.constructor.name;
        if (isString(name) && name !== '') {
            return (name === 'Object');
        }
    }
    return isObject(v);
}
function isJsonOrArray (v) {
    return isArray(v) || isJson(v);
}
function isUndf (v) {
    return typeIs(v, TYPE.UNDEFINED);
}
function isFunc (v) {
    return typeIs(v, TYPE.FUNCTION);
}
// pick base
// target: 目标
// data: 源数据
// 需要pick的属性
// deep 是否深拷贝
function pick ({target, data, attr, deep = false, ignoreUndf = false, traverseArray = true}) {
    if (!isObject(target) || isNull(target)) {
        target = isArray(data) ? [] : {};
    }
    if (isUndf(attr)) {
        attr = keys(data);
    }
    attr.forEach(key => {
        let value, name = key;
        if (key.indexOf(':') !== -1) { // 新属性
            const arr = key.split(':');
            name = arr[0];
            value = arr[1]; // 旧属性或值
            if (isUndf(data[value])) {
                value = (value.indexOf('number.') !== -1) ? parseFloat(value.substr(7)) : value;
            } else {
                value = data[value];
            }
        } else {
            value = data[key];
        }

        if (isJsonOrArray(value) && !isNull(value) && deep === true && (traverseArray || !isArray(value))) {
            if (!isNull(target[name]) && isJsonOrArray(target[name])) {
                target[name] = pick({target: target[name], data: value, deep: true, ignoreUndf, traverseArray});
            } else {
                target[name] = pick({data: value, deep: true, ignoreUndf, traverseArray});
            }
        } else {
            if (!ignoreUndf || !isUndf(value)) {
                target[name] = value;
            }
        }
    });
    return target;
}
function keys (json) {
    if (isFunc(Object.keys)) {
        return Object.keys(json);
    }
    const arr = [];
    for (const key in json)
        arr.push(key);
    return arr;
}

module.exports = {
    pick,
    isNull,
    isNumber,
    isUndf,
    isFunc,
    isArray,
    isObject,
    isJsonOrArray,
    isBool,
    isJson,
};