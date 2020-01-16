## 介绍

> WebSocket是基于原生的基础上扩展的心跳和重连机制进行一次封装的，是基于ES6 class的方式,心跳机制单独抽离，可以引用。


## 适用场景

> 对数据的实时性要求比较强，客户端与服务频繁交互的场景, 比如：

- 通信
- 股票
- 直播
- 共享桌面
- 聊天室
- 实时共享
- 多人协作
....


## `WebSocket` 封装思想

1. 基于原有的API上扩展方法， 方法通过初始化，和参数一起传入，不用做任何操作，还有直接初始化，之后通过对象调用
2. 扩展心跳检测
3. 断线重连


## 基础知识

1. ES6的基础语法
2. ES6的class

##  安装

``` shell
$ npm install/i socket-heart
```

##  api

### 参数

> OPTIONS对象中有一下属性

-    url: null, // 链接的通道的地址
-    heartTime: 5000, // 心跳时间间隔
-    heartMsg: 'ping', // 心跳信息,默认为'ping'
-    isReconnect: true, // 是否自动重连
-    isRestory: false, // 是否销毁
-    reconnectTime: 5000, // 重连时间间隔
-    reconnectCount: 5, // 重连次数 -1 则不限制
-    openCb: null, // 连接成功的回调
-    closeCb: null, // 关闭的回调
-    messageCb: null, // 消息的回调
-    errorCb: null // 错误的回调

### 方法

- create()
> 建立连接

- onopen (callback)
> 自定义连接成功事件
> @param {Function} callback 回调函数:如果callback存在，调用callback，不存在调用OPTIONS中的回调

- onclose(callback)
> 自定义关闭事件
> @param {Function} callback 回调函数:如果callback存在，调用callback，不存在调用OPTIONS中的回调

- onerror(callback)
> 自定义错误事件
> @param {Function} callback 回调函数:如果callback存在，调用callback，不存在调用OPTIONS中的回调

- send(data)
> 自定义发送消息事件
> @param {String} data 发送的文本

- onreconnect()
> 连接事件

- destroy()
> 销毁


### 心跳[Heart]API

### 方法

- reset()
> 重置

- start(cb)
> 启动心跳
> @param {Function} cb 回调函数



## 用法


``` javascript
import { Socket } from 'socket-heart'
let options = {
  ....
}
this.wbSocket = new Socket(options)
this.wbSocket.onmessage((data) => {})
...

```

``` javascript
import { Socket } from 'socket-heart'
let options = {
  ....,
  onmessage: (data) =>{

  }
}
this.wbSocket = new Socket({ options })
...

```