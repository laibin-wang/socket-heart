import { Heart } from './libs/heart'

export class Socket extends Heart {
  ws = null

  RECONNEC_TTIMER = null // 重连计时器
  RECONNECT_COUNT = 10 // 变量保存，防止丢失

  OPTIONS = {
    url: null, // 链接的通道的地址
    heartTime: 5000, // 心跳时间间隔
    heartMsg: 'ping', // 心跳信息,默认为'ping'
    isReconnect: true, // 是否自动重连
    isRestory: false, // 是否销毁
    reconnectTime: 5000, // 重连时间间隔
    reconnectCount: 5, // 重连次数 -1 则不限制
    openCb: null, // 连接成功的回调
    closeCb: null, // 关闭的回调
    messageCb: null, // 消息的回调
    errorCb: null // 错误的回调
  }
  constructor (ops) {
    super()
    Object.assign(this.OPTIONS, ops)
    this.create()
  }
  /**
   * 建立连接
   */
  create () {
    if (!('WebSocket' in window)) {
      /* eslint-disable no-new */
      new Error('当前浏览器不支持，无法使用')
      return
    }
    if (!this.OPTIONS.url) {
      new Error('地址不存在，无法建立通道')
      return
    }
    delete this.ws
    this.ws = new WebSocket(this.OPTIONS.url)
    this.onopen()
    this.onclose()
    this.onmessage()
  }
  /**
   * 自定义连接成功事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onopen (callback) {
    this.ws.onopen = (event) => {
      clearTimeout(this.RECONNEC_TTIMER) // 清除重连定时器
      this.OPTIONS.reconnectCount = this.RECONNECT_COUNT // 计数器重置
      // 建立心跳机制
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg)
      })
      if (typeof callback === 'function') {
        callback(event)
      } else {
        (typeof this.OPTIONS.openCb === 'function') && this.OPTIONS.openCb(event)
      }
    }
  }
  /**
   * 自定义关闭事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onclose (callback) {
    this.ws.onclose = (event) => {
      super.reset()
      !this.OPTIONS.isRestory && this.onreconnect()
      if (typeof callback === 'function') {
        callback(event)
      } else {
        (typeof this.OPTIONS.closeCb === 'function') && this.OPTIONS.closeCb(event)
      }
    }
  }
  /**
   * 自定义错误事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onerror (callback) {
    this.ws.onerror = (event) => {
      if (typeof callback === 'function') {
        callback(event)
      } else {
        (typeof this.OPTIONS.errorCb === 'function') && this.OPTIONS.errorCb(event)
      }
    }
  }
  /**
   * 自定义消息监听事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
   */
  onmessage (callback) {
    this.ws.onmessage = (event) => {
      // 收到任何消息，重新开始倒计时心跳检测
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg)
      })
      if (typeof callback === 'function') {
        callback(event.data)
      } else {
        (typeof this.OPTIONS.messageCb === 'function') && this.OPTIONS.messageCb(event.data)
      }
    }
  }
  /**
   * 自定义发送消息事件
   * @param {String} data 发送的文本
   */
  send (data) {
    if (this.ws.readyState !== this.ws.OPEN) {
      new Error('没有连接到服务器，无法推送')
      return
    }
    this.ws.send(data)
  }
  /**
   * 连接事件
   */
  onreconnect () {
    if (this.OPTIONS.reconnectCount > 0 || this.OPTIONS.reconnectCount === -1) {
      this.RECONNEC_TTIMER = setTimeout(() => {
        this.create()
        if (this.OPTIONS.reconnectCount !== -1) this.OPTIONS.reconnectCount--
      }, this.OPTIONS.reconnectTime)
    } else {
      clearTimeout(this.RECONNEC_TTIMER)
      this.OPTIONS.reconnectCount = this.RECONNECT_COUNT
    }
  }
  /**
   * 销毁
   */
  destroy () {
    super.reset()
    clearTimeout(this.RECONNEC_TTIMER) // 清除重连定时器
    this.OPTIONS.isRestory = true
    this.ws.close()
  }
}
