<template>
  <div id="app">
    <Bar class="bar"></Bar>
    <router-view class="main"/>
  </div>
</template>

<script>
    import Bar from "./components/Bar";
    import {getMessCount} from "./api";

    import SockJS from 'sockjs-client';

    import Stomp from 'stompjs';
    import PubSub from "pubsub-js";

    export default {
        components: {
            Bar
        },
        data() {
            return {
                uid: '',
                timeout: 30000, //30s发一次心跳
                timeoutObj: null,
                tryTimes: 0, // 重连次数
                serverTimeoutObj: null,
                stompClient: null
            }
        },
        methods: {
            ws(uid) {
                if (this.$store.getters.getUser && this.$store.getters.getUser.uid) {
                    const _this = this;

                    let socket = new SockJS('/api/websocket');

                    _this.stompClient = Stomp.over(socket);

                    var stompClient = _this.stompClient

                    stompClient.connect({}, function (frame) {
                            _this.heartCheck() // 开始心跳检测
                            _this.tryTimes = 0; //重置重连次数

                            //订阅(该路由专门用于心跳检测）
                           /* stompClient.subscribe('/user/', function (result) {
                                _this.heartCheck; //心跳检测重置
                                console.log("res",result.body)
                            });*/

                            stompClient.subscribe(`/user/${uid}/messCount`, function (message) {
                                PubSub.publish("count", message.body);
                                _this.$notify({
                                    title: '消息提示',
                                    message: `您有${message.body}条未读消息`,
                                    position: 'top-left',
                                    offset: 40
                                });
                            });

                        },

                        function (errorCallback) {
                            //连接失败的操作...（该方法非必须）
                            console.log(errorCallback)
                            _this.reconnect();
                        });

                }

            },

            // 检测心跳重连
            heartCheck() {
                this.reset()
                this.start()
            },

            //手动关闭连接
            disconnect() {
                if (this.stompClient !== null) {
                    this.stompClient.disconnect();
                }
                //断开连接成功之后的操作...
            },

            reconnect() {
                const _this = this;
                if (this.tryTimes > 10) {
                    alert("重连次数以达上限 连接失败")
                    return;
                }
                setTimeout(function () { //没连接上会一直重连，设置延迟避免请求过多
                    if (_this.$store.getters.getUser && _this.$store.getters.getUser.uid) {
                        _this.ws();
                    }
                }, 3000);
            },

            // 重置心跳
            reset() {
                var that = this;
                clearTimeout(that.timeoutObj);
                clearTimeout(that.serverTimeoutObj);
                // 重启心跳
                that.start()
            },

            // 开启心跳
            start() {
                const self = this;
                self.timeoutObj && clearTimeout(self.timeoutObj);
                self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
                this.timeoutObj = setTimeout(function () {
                    //这里发送一个心跳到后端指定路由，后端该路径收到将再发一条消息到前端指定路由，从而完成一次交互（消息content可以为空 只要能到达路由就可以）
                    self.stompClient.send("/api/v3/check", " ");
                    console.log("ping!")

                    //如果超过一定时间还没重置才会执行到这，说明后端主动断开了
                    self.serverTimeoutObj = setTimeout(function () {
                        self.disconnect();
                        self.uid = self.$store.getters.getUser.uid
                        self.ws(this.uid)
                    }, self.timeout)
                }, this.timeout)
            }
        },

        created() {
            if (this.$store.getters.getUser) {
                this.uid = this.$store.getters.getUser.uid
                console.log(this.uid)
                this.ws(this.uid)
                getMessCount().then(res => {
                    if (res.code === 0) {
                        if (res.count != 0) {
                            PubSub.publish("count", res.count);
                            this.$notify({
                                title: '消息提示',
                                message: `您有${res.count}条未读消息`,
                                position: 'top-left',
                                offset: 40
                            });
                        }
                    }
                })
            }
        }
    }
</script>

<style>
  .main {
    max-width: 960px;
    padding-top: 40px;
    margin: 0 auto;
  }

  .user {
    max-width: 100%;
  }

  * {
    margin: 0;
    padding: 0;

  }

  a {
    text-decoration: none;
    color: black;
  }

  .bar {
    position: fixed;
    z-index: 9999;
  }
</style>
