class BubbleMsg {
  constructor () {
    this._funs = {}
    this.posturl = '*'
    let _this = this
    window.onload = function () {
      window.addEventListener('message', e => {
        let data = e.data
        if (!data._bubbleMsgKey || !data._bubbleMsgDir) return
        let funcArr = _this._funs[data._bubbleMsgKey]
        if (Array.isArray(funcArr)) {
          funcArr.forEach(func => {
            func.call(_this, data._bubbleMsgContent)
          })
        } else if (data._bubbleMsgDir === 'up') {
          if (window.parent !== window) {
            window.parent.postMessage(data, _this.posturl)
          }
        } else if (data._bubbleMsgDir === 'down') {
          Array.from(document.getElementsByTagName('iframe')).forEach(child => {
            child.contentWindow.postMessage(data, _this.posturl)
          })
        }
      })
    }
  }

  // 向上发送消息
  msgUp (key, mess) {
    if (!(typeof key === 'string' && key.length > 0)) {
      throw new Error('The key is invalid')
    }
    let message = {
      _bubbleMsgDir: 'up',
      _bubbleMsgKey: key,
      _bubbleMsgContent: mess
    }
    if (window.parent !== window) {
      window.parent.postMessage(message, this.posturl)
    }
  }

  // 向下发送消息
  msgDown (key, mess) {
    if (!(typeof key === 'string' && key.length > 0)) {
      throw new Error('The key is invalid')
    }
    let message = {
      _bubbleMsgDir: 'down',
      _bubbleMsgKey: key,
      _bubbleMsgContent: mess
    }
    Array.from(document.getElementsByTagName('iframe')).forEach(child => {
      child.contentWindow.postMessage(message, this.posturl)
    })
  }

  // 向上下双向系统发送消息
  msg (key, mess) {
    this.msgUp(key, mess)
    this.msgDown(key, mess)
  }

  // 接收信息
  onMsg (key, func) {
    if (this._funs[key] === undefined) {
      this._funs[key] = []
    }
    let funcArr = this._funs[key]
    if (Array.isArray(funcArr)) {
      if (funcArr.indexOf(func) === -1) {
        funcArr.push(func)
      }
    }
  }

  // 删除信息
  offMsg (key, func) {
    if (func) {
      let funcArr = this._funs[key]
      if (Array.isArray(funcArr)) {
        let index = funcArr.indexOf(func)
        if (index >= 0) {
          funcArr.splice(index)
        }
        if (funcArr.length <= 0) {
          delete this._funs[key]
        }
      }
    } else {
      delete this._funs[key]
    }
  }

  // 请求获取信息
  // 异步请求数据，向某个key发送消息，并等待回复消息，默认10秒超时
  reqMsg (key, parme, timeOut = 10 * 1000) {
    let _this = this
    return new Promise((resolve, reject) => {
      let recv, time
      recv = function (data) {
        recv && _this.offMsg(key, recv)
        time && clearTimeout(time)
        resolve(data)
      }

      _this.onMsg(key, recv)
      _this.msg(key, parme)

      time = setTimeout(function () {
        recv && _this.offMsg(key, recv)
        time && clearTimeout(time)
        reject(new Error('ReqMsg is time out'))
      }, timeOut)
    })
  }

  // 接收请求，处理并返回信息
  // 注册服务
  onReqMsg (key, func) {
    let _this = this
    this.onMsg(key, function (parme) {
      let res = func.call(_this, parme)
      this.msg(key, res)
    })
  }
}

export default BubbleMsg
