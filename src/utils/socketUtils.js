
export default class SocketService {

  static instance = null
  webSocket = null
  /**
   * 懒汉式
   * @returns {null}
   */
  static getInstance() {
    if(!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  /**
   * 连接服务器
   */
  connect() {
    if(!window.WebSocket){
      console.log('您的浏览器不支持WebSocket');
      return;
    }
    this.webSocket = new WebSocket('ws://localhost:9998')

    // 连接成功事件
    this.webSocket.onopen = () => {
      console.log('连接服务端成功...');
    }

    // 连接失败事件
    this.webSocket.onclose = () => {
      console.log('连接服务端失败...');
    }

    // 获取服务端发送过来的数据
    this.webSocket.onmessage = msg => {
      console.log('从服务端获取到数据: ' + msg.data);
    }
  }
}
