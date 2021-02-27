
# # install dependencies
npm install 

数据驱动

# Vue 与模板
使用步骤
1. 编写 页面 模板
    1.直接在HTML 标签中写标签
    2.使用template
    3.使用 单文件（<template/>）
2. 创建 Vue 的实例
    1.在vue的构造函数中提供：data，methods，computed，watcher，props，...
3. 将vue挂载到 页面中（mount）

# 数据驱动模型
Vue 的执行流程
1. 获得模板：模板中有“要渲染的位置”。
2. 利用 Vue 构造函数中所提供的数据来“渲染”，得到可以在页面中显示的“标签了”。
3. 将标签替换页面中原来有坑的标签。

Vue 利用我们提供的数据和页面中模板生成了一个新的 HTML 标签（node元素），替换到了页面中放置模板的位置。

# 简单的模板渲染

# 虚拟 DOM 

1. 怎么将真正得 DOM 转换为虚拟DOM
2. 怎么将虚拟DOM转换为真正的DOM

思路与深拷贝类似。

# 函数柯里化
参考资料：
- [函数式编程](https://llh911001.gitbook.io/mostly-adequate-guide-chinese/)
- [维基百科](https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5)

概念：
1. 柯里化:一个函数原本有多个参数，只传入 **一个参数** ，函数内返回一个新函数由新函数接收需要的参数来运行得到结果。
2. 偏函数:一个函数原本有多个参数，只传入 **一部分参数** ，函数内返回一个新函数由新函数接收需要的参数来运行得到结果。
3. 高阶函数:一个函数**参数是一个函数**，该函数对参数这个函数进行了加工，得到一个函数，这个加工用的函数就是高阶函数。
 
为什么要使用柯里化？为了提升性能，使用柯里化可以缓存一部分能力。
使用两个案例说明：
1. 判断元素。
2. 虚拟 DOM 的 render 方法。

1. 判断元素：
Vue 本质上是使用 HTML 的字符中作为模板的，将字符串的模板转换为 AST（抽象语法树），再转换为 VNode。
- 模板 -> AST 
- AST -> VNode
- VNode -> DOM
提示：最消耗性能的是字符串解析( 模板 -> AST ) 

例子：let s = ' 1 + 2 * ( 3 + 4 ) '
写一个程序，解析这个表达式，得到结果（一般化）
一般会将这个表达式转成 "波兰式" 表达式，然后使用栈结构来运算。

在Vue 中每一个标签可以是真正的 HTML 标签，也可以是自定义组件，如何区分???
在Vue 源码中其实将所有可以用的 HTML 标签已经存了起来。

假设这里是考虑几个标签：
```js
let tagList = 'div,p,img,ul,li'.split(',');
```

需要一个函数，判断一个标签名是否为内置的标签。
```js
function isHTMLTag(tagName){ 
    tagName = tagName.toLowerCase(); // 全部转成小写的。
    if(tagList.indexOf(tagName) > -1 ) return true;
    return false;
}
```

2. 虚拟 DOM render 方法
思考:vue 项目 **模板转换为抽象语法树** 需要执行几次???

- 页面一开始加载需要渲染
- 每一个属性(响应式)数据在发生变化的时候要渲染
- watch,computed 等等

day1的代码，每次需要渲染的时候，模板就会被解析一次（注意，这里我们简化了解析方法）
render 的作用是将虚拟DOM转换为真正的DOM加到页面中
- 虚拟DOM可以降级理解为AST。
- 一个项目在运行的时候模板没变，就是表示 AST 是不会变得

我们可以将代码进行优化，将虚拟DOM缓存起来，生成一个函数，函数只需要传入数据就可以得到真正得 DOM 。


# 问题
- 关于 mountComponent 这个函数里面的
- call
makeMap(['div','p']) 需要遍历这个数据 生成 键值对

```js
let set={
    div:true,
    p:true,
}
set['div'] // true
set['Navigator'] // undefind -> false
```
但是如果是使用的函数，每次都需要判断是不是数组中的

# 响应式原理

- 在我们在使用 Vue 的时候，赋值属性获得属性都是直接使用的Vue实例
- 我们在设置属性值的时候，页面的数据需要跟新。

```js
Object.defineProperty(对象,'设计什么属性名',{
configurable:'当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。',
enumerable:'当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。默认为 false。',

// 数据描述符还具有以下可选键值：
value:'该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。',
writable:'当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。默认为 false。',

//存取描述符还具有以下可选键值：
get:'属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。默认为 undefined。',
set:'属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。默认为 undefined。'
})
```

```js
  let o = {
            name: "jim",
            age: 19,
            gender: "men"
        }
        // 简化响应式
        function defineReactive(target, key, value, enumerable) {
            // 函数内部就是一个局部作用域，这个 value 就只在函数内部使用的变量（闭包） 
            Object.defineProperty(target, key, {
                configurable: true,
                enumerable: !!enumerable,
                get() {
                    console.log(`读取 o 的${key}属性`)
                    return value;
                },
                set(newValue) {
                    console.log(`设置了 o 的${key}属性为${newValue}`)
                    value = newValue;
                }
            })
        }
        // 将对象转换成响应式的
        let keys = Object.keys(o);
        for (let i = 0; i < keys.length; i++) {
            defineReactive(o, keys[i], o[keys[i]], true);
        }
```

**实际开发中对象一般是有多级**

```js
let o ={
    list:[{},...],
    obj:{item...},
}

```



# 发布订阅模式














