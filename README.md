
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
对象可以递归处理，但是数组我们也需要处理比图push进了一个item这个新来的就为被响应式处理。

- push
- pop
- shift
- unshift
- reverse
- sort
- splice

1. 在改变数组的数据的时候，要发出通知
    - vue 2 中的缺陷，数组发生变化，设置length（如：arr.length = 0 ） 没法通知（Vue 3 中使用 Proxy 语法 ES6 的语法解决了这个问题）
2. 加入新的元素应该具备响应式。

注意点：如果一个函数已经定义了，但是我们需要扩展其功能，我们一般的处理方法：
1. 使用一个临时的函数名存储函数
2. 重新定义原来的函数
3. 定义扩展的功能
4. 调用临时的那个函数


扩展数组的方法 push 和 pop 怎么处理？？

- 直接修改 prototype **不行**。
- 修改要进行响应式化的数组原型(__proto__)

现在有个问题：对象已经是改成响应式的了，但是直接给对象赋值为另一个对象，那么就不是响应式的了。

# 发布订阅模式

- 解决重新赋值数据就不再是响应式的问题。
- 代理方法 (app.name,app._data.name)
- 事件模型 (node:event 模块)
- vue 中 Observer 与 watcher 和 Dep

代理方法，就是要将 app._data 中的成员 给映射到app上

由于需要在更新数据的时候，更新页面的内容
所以 app._data 访问的成员 与 app 访问的成员应该是同一成员。

由于 app._data 已经是响应式的对象了，所以只需要让app访问的成员去访问 app._data 的对应成员就可以了。

列如：
```js
app.name 转换为 app._data.name
app.xxx 转换为 app._data.xxx
```

引入了一个函数 proxy(target,src,prop),将 target 的操作 映射到 src.prop 上这里是因为当时没有 `Proxy` 语法 (ES6)

之前处理的 reactive 方法已经不行了，我们需要一个新的方法。

提供一个 Observer 方法（Vue 中就有这个方法，观察者。），在方法中对属性进行处理
可以将这个方法封装到 initData 方法中。



## 解释 proxy

```js
app._data.name
// vue 设计，不希望访问 _ 开头的数据
// vue 中的潜在规则：
// - _ 开头的的数据是私有数据
// - $ 开头的是只读数据
app.name
// 将 对 _data.xxx 的访问交给了实例
// 重点：访问 app 的 xxx 就是在访问 app._data.xxx
Object.defineProperty(o2,'name',{
    get(){
        return o1.name;
    }
})

```

# 发布订阅模式

目标：解耦，让各个模块之间没有紧密的联系。
现在的处理方法是：属性在更新的时候调用 [mountComponent] 方法。
问题：mountComponet 更新的是什么？？？ (现在) 全部的页面 -> 当前虚拟 DOM 对应的页面 DOM 。
在 Vue 中，整个的更新是按照组件为单位进行 **判断**,已节点为单位进行更新。

- 如果代码中没有自定义组件，那么在比较算法的时候，我们会将全部的模板对应的虚拟 DOM 进行比较。
- 如果代码中含有自定义的组件，那么在比较算法的时候，就会判断更新的是哪一些组件中的属性，只会判断更新数据的组件，其它组件不会更新。

复杂的页面是由很多组件构成的，每一个属性要跟新的时候都要调用更新的方法？

**[目标:]如果修改了什么属性，就尽可能只更新这些属性对应的页面 DOM**

'这样就不能将更新代码写死了'
例子：预售可能一个东西没有现货，告诉老板，如果到了就直接通知我。

这里的'老板'就是发布者。
要买的'客户'就是订阅者。




