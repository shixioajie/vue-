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