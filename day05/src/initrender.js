JGVue.prototype.mount = function () {
    // 需要提供一个 render 方法：生成虚拟DOM
    this.render = this.createRenderFn(); // 带有缓存 （Vue 本身可以带有 render成员 ）
    this.mountComponent();
}

JGVue.prototype.mountComponent = function () {
    // 执行 mountComponent() 函数
    let mount = () => {
        this.update(this.render())
    }
    mount.call(this);// 本质应该交给 watcher 来调用。
}

// 这里是生成 render 函数，目的是缓存抽象语法树（使用 虚拟DOM模拟）
JGVue.prototype.createRenderFn = function () {
    let ast = getVNode(this._template);
    return function render() {
        let _tmp = combine(ast, this._data);
        return _tmp;
    }
}

// 将虚拟 DOM 渲染到页面中：diff 算法就在这里
JGVue.prototype.update = function (vnode) {
    let realDOM = parseVNode(vnode);
    this._parent.replaceChild(realDOM, document.querySelector("#root"));
}
