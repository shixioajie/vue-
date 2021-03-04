
// 响应式化的部分
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice',
]
// 继承关系：arr - > Array.prorotype -> Object.prototype -> ...
let array_methods = Object.create(Array.prototype);
// 给这个对象设置拦截方法
ARRAY_METHOD.forEach(method => {
    array_methods[method] = function () {
        // 将数据进行响应式化
        for (let i = 0; i < arguments.length; i++) {
            observer(arguments[i]);// 还是不能传递第二个参数，引入 watcher 后解决。
        }
        console.log(`${method} 方法被拦截。`)
        // 连接调用的方法
        let result = Array.prototype[method].apply(this, arguments);
        return result;
    }
})

// 简化响应式
function defineReactive(target, key, value, enumerable) {

    let that = this;
    // 函数内部就是一个局部作用域，这个 value 就只在函数内部使用的变量（闭包）
    if (typeof value === 'object' && value != null) {
        //  非数组的引用类型
        observer(value);// 递归
    }
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: !!enumerable,
        get() {
            console.log(`读取 o 的${key}属性`)
            return value;
        },
        set(newValue) {
            console.log(`设置了 o  的${key}属性为${newValue}`)
            // 目的
            // 将重新赋值的数据变成响应式的，因此如果传入的是对象类型的，那么就需要使用 observer 将其转换为响应式的
            if (typeof newValue == 'object' && newValue != null) {
                observer(newValue);
            }
            value = newValue;

            // 模板刷新
            typeof that.mountComponent === "function" && that.mountComponent();
        }
    })
}

// 将某一个对象的属性访问，映射到对象的某一个属性成员上 。
function proxy(target, prop, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return target[prop][key];
        },
        set(newValue) {
            target[prop][key] = newValue;
        }
    })
}

/* 将对象 o 变成响应式的,vm 就是 vue 实例，为了在调用的时候处理上下文。 */
function observer(obj, vm) {
    // 之前没有对 obj（数据） 本身进行处理，这一次直接对 obj 进行判断
    if (Array.isArray(obj)) {
        // 是数组就对其每个元素进行处理
        obj.__proto__ = array_methods;
        for (let i = 0; i < obj.length; i++) {
            observer(obj[i], vm);// 递归处理每一个数组元素
            // 如果想要这么处理，就在这里继续调用 defineRective 
            // defineReactive.call(vm, obj, i, obj[i], true);
        }
    } else {
        // 不是数组就对其每个成员进行处理
        let keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            let prop = keys[i];// 属性名
            defineReactive.call(vm, obj, prop, obj[prop], true);
        }
    }
}

JGVue.prototype.initData = function () {
    //   遍历 this._data 的成员，将属性转换为响应式（上），将直接属性，代理到实例上。
    let keys = Object.keys(this._data);
    // 响应式化
    observer(this._data, this);
    // 代理
    for (let i = 0; i < keys.length; i++) {
        proxy(this, '_data', keys[i]);
    }
}