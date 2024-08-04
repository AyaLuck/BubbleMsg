# bubbleMsg.js

## 简介
bubbleMsg是针对通过`<iframe>`嵌套的多个窗口间进行通信的vue插件。当前端项目中存在多层`<iframe>`嵌套，为方便进行层间通信，可以使用此插件。


当需要进行层间通信时，可选单向（向上/向下）或双向进行信息发送，信息会沿此方向冒泡传递，当信息被某层系统捕获并使用，或信息发送至尽头，则停止冒泡传递。

插件的使用有以下模式：
- **发送-接收模式：**
  在发送层发送信息，在接收层捕获并使用。
  
- **请求-响应模式：**
  在请求层发送信息并异步等待回复，在响应层捕获信息处理并回复，当请求层收到回复后异步完成。如信息未被响应层捕获，则请求层抛出等待超时的异常。

## 适配环境
- vue2
- vue3
可搭配ts使用

## 注意事项
1、系统均通过`<iframe>`嵌套
2、相关嵌套系统均需要使用该插件bubbleMsg

## vue2安装及使用
### 安装
```bash
npm i --save bubble-msg
```
//在main.js中引用插件

```js
import bubbleMsg from 'bubble-msg'
Vue.use(bubbleMsg)
```

### 接口
key：信息的唯一标识符
data：信息内容
```js
$bub.msg(key,data)                      //双向发送信息
$bub.msgUp(key,data)                    //向上发送信息
$bub.msgDown(key,data)                  //双下发送信息
$bub.onMsg(key,(data)=>{})              //捕获消息
$bub.offMsg(key)                        //停止捕获"key"的消息
$bub.offMsg(key,fn)                     //"key"的消息不再使用fn处理
$bub.reqMsg(key,data)                   //请求消息
$bub.reqMsg(key,data,timeout)           //请求消息,设置超时时间，默认10*1000
$bub.onReqMsg(key,(data)=>{return res}) //响应请求消息
```
### 使用

#### 发送-接收：
- 发信息
```js
let data={
  id: 1,
  obj:{a:1,b:2}
}
this.$bub.msg('key', data)      //双向发送
// this.$bub.msgUp('key',data)  //向上发送
// this.$bub.msgDown('key',data)//向下发送
```

- 接收信息
> 推荐在mounted生命周期调用
```js
mounted() {
  this.$bub.onMsg('key', data => {
    console.log('测试监听获得参数:', data)//打印：测试监听获得参数: { id: 1, obj: { a: 1, b: 2 } }
  })
},

```
#### 请求-响应：
- 请求获取信息(异步)
```js
//默认timeOut为10*1000
//回调写法
this.$bub.reqMsg('reqMsgKey', { name: 'bub' }).then(res => {
  console.log('测试监听返回数据:', res)
}).catch(err=>{})

//await写法
let res=await this.$bub.reqMsg('reqMsgKey', { name: 'bub' })
console.log('测试监听返回数据:', res)
```


- 响应请求，处理并返回信息
```js
this.$bub.onReqMsg('reqMsgKey').then(data => {
  console.log('测试监听请求携带数据:', data)
  return {msg:"hello " + data.name}
})
```


#### 停止信息接收:
> 推荐在destroyed/onUnmounted生命周期中调用
```js
this.$bub.offMsg('key')//停止接收"key"的消息
```

## vue3安装及使用
### 安装
```bash
npm i --save bubble-msg
```
在main.js中引用插件
```js
import bubbleMsg from 'bubble-msg'
const app = createApp(App)
app.use(bubbleMsg)
```
具体使用页面引用方法
```js
import { bub } from 'bubble-msg'
```

### 接口
key：信息的唯一标识符
data：信息内容
```js
bub.msg(key,data)                      //双向发送信息
bub.msgUp(key,data)                    //向上发送信息
bub.msgDown(key,data)                  //双下发送信息
bub.onMsg(key,(data)=>{})              //捕获消息
bub.offMsg(key)                        //停止捕获"key"的消息
bub.offMsg(key,fn)                     //"key"的消息不再使用fn处理
bub.reqMsg(key,data)                   //请求消息
bub.reqMsg(key,data,timeout)           //请求消息,设置超时时间，默认60*1000
bub.onReqMsg(key,(data)=>{return res}) //响应请求消息
```
### 使用

#### 发送-接收：
- 发信息
```js
let data={
  id: 1,
  obj:{a:1,b:2}
}
bub.msg('key', data)      //双向发送
// bub.msgUp('key',data)  //向上发送
// bub.msgDown('key',data)//向下发送
```

- 接收信息
> 推荐在onMounted生命周期调用
```js
onMounted(()=> {
  bub.onMsg('key', data => {
    console.log('测试监听获得参数:', data)//打印：测试监听获得参数: { id: 1, obj: { a: 1, b: 2 } }
  })
}),

```
#### 请求-响应：
- 请求获取信息(异步)
```js
//默认timeOut为60*1000
//回调写法
bub.reqMsg('reqMsgKey', { name: 'bub' }).then(res => {
  console.log('测试监听返回数据:', res)
}).catch(err=>{})

//await写法
let res = await bub.reqMsg('reqMsgKey', { name: 'bub' })
console.log('测试监听返回数据:', res)
```


- 响应请求，处理并返回信息
```js
bub.onReqMsg('reqMsgKey').then(data => {
  console.log('测试监听请求携带数据:', data)
  return {msg:"hello " + data.name}
})
```


#### 停止信息接收:
> 推荐在onUnmounted生命周期中调用
```js
bub.offMsg('key')//停止接收"key"的消息
```
