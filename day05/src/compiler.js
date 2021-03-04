// 由 HTML DOM 转换成虚拟 DOM 
function getVNode(node) {
    let nodeType = node.nodeType;
    let _vnode = null;

    if (nodeType === 1) {
        // 元素
        let nodeName = node.nodeName;
        let attrs = node.attributes;
        let _attrObj = {};
        for (let i = 0; i < attrs.length; i++) {// attrs[i] 属性节点（nodeType == 2 ）
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

        // 考虑 node 的子元素
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            _vnode.appendChild(getVNode(childNodes[i]));
        }

    } else if (nodeType === 3) {
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
    }
    return _vnode;
}

// 转化成真实DOM
function parseVNode(vnode) {
    // 创建真实的DOM
    let type = vnode.type;
    let _node = null;
    if (type == 3) {
        return document.createTextNode(vnode.value); // 创建文本节点
    } else if (type === 1) {
        _node = document.createElement(vnode.tag); // 创建元素
        // 属性
        let data = vnode.data;// data 是键值对
        Object.keys(data).forEach(key => {
            let attrName = key;
            let attrValue = data[key];
            _node.setAttribute(attrName, attrValue);
        })
        // 处理子元素
        let children = vnode.children;
        children.forEach(subVnode => {
            _node.appendChild(parseVNode(subVnode));
        })
        return _node;
    }
}


let rkuohao = /\{\{(.+?)\}\}/g;
// 根据路径获取对象成员数据
function getValueByPath(object, path) {
    let paths = path.split('.');
    let result = object;
    let prop;
    while (prop = paths.shift()) {
        result = result[prop];
    }
    return result;
}

// 将未填数据的 Vnode 与 数据 data 结合，得到填写了数据的 Vnode：模拟 AST -> Vnode
function combine(vnode, data) {
    let _type = vnode.type;
    let _data = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag;
    let _children = vnode.children;
    let _vnode = null;

    if (_type === 3) { // 文本节点
        // 对文本进行处理
        _value = _value.replace(rkuohao, function (_, g) {
            return getValueByPath(data, g.trim());
        })
        _vnode = new VNode(_tag, _data, _value, _type);
    } else if (_type === 1) { // 元素节点
        _vnode = new VNode(_tag, _data, _value, _type);
        _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)));
    }
    return _vnode;
}