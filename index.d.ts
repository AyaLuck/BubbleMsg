import { App } from 'vue-demi';
export declare type MsgHandler<T> = (msg: T) => void;
export declare type ReqHandler<T,R> = (msg: T) => R;
export interface BubbleMsg{
  // 向上发送消息
  msgUp (key:string, mess:any) 
  // 向下发送消息
  msgDown (key:string, mess:any) 
  // 向上下双向系统发送消息
  msg (key:string, mess:any) 

  // 接收信息
  onMsg<T=unknown>(key:string, func:MsgHandler<T>)

  // 删除信息
  offMsg<T=unknown>(key:string, func:MsgHandler<T>) 
  // 请求获取信息
  // 异步请求数据，向某个key发送消息，并等待回复消息，默认60秒超时
  reqMsg<R=unknown>(key:string, parme:any, timeOut:number = 60 * 1000):Promise<R>
  // 接收请求，处理并返回信息
  // 注册服务
  onReqMsg<T=unknown,R=unknown>(key:string, func:ReqHandler<T,R>)
}


export declare const bub: BubbleMsg;

declare function install(app: App):void;

export default install;