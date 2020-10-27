<template>
  <div>
    <Header></Header>
    <div class="mblog">
      <div style="display: flex;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <h2> {{ blog.title }}</h2>
          <p style="font-size: 13px;margin-left: 20px">来自：{{blog.userName}}</p>
        </div>

        <div>
          <p style="font-size: 13px">{{blog.created}}</p>
          <p style="font-size: 12px;margin-top: 20px">{{blog.likeNum}}人觉得很赞</p>
        </div>

      </div>
      <el-divider></el-divider>
      <h4 style="font-family: '仿宋'">{{blog.description}}</h4>
      <el-divider></el-divider>
      <div class="markdown-body" v-html="blog.content"></div>
    </div>
    <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%; padding: 20px 15px;">
      <div class="top">
        <a href="javascript:;" :class="{on: on}" @click="tolike"><i style="font-size: 30px"
                                                                    class="el-icon-star-on"></i></a>
        <p style="font-size: 14px">点赞{{blog.likeNum}}</p>
        <i style="font-size: 25px;margin-left: 30px" class="el-icon-chat-dot-square"></i>
        <p style="font-size: 14px;">评论 <span v-if="discuss">{{discuss.length}}</span><span v-if="!discuss">0</span></p>
      </div>
      <el-card class="box-card" style="margin-top: 20px">
        <div style="display: flex;justify-content: space-between">
          <el-avatar size="medium" :src="circleUrl"></el-avatar>
          <el-input placeholder="请输入内容" v-model="pinlun" style="width: 90%;margin-left: 20px">
          </el-input>
          <el-button type="info" style="margin-left: 20px" @click="discussBlog()">评论</el-button>
        </div>
        <el-divider></el-divider>
        <div v-for="(cuss,id) in discuss" :key="id">
          <div style="display: flex;align-items: center">
            <el-avatar size="small" :src="cuss.logo"></el-avatar>
            <p style="font-size: 14px;margin-left: 10px">{{cuss.username}}：</p>
            <p style="font-size: 14px;margin-left: 20px">{{cuss.content}}</p>
            <a v-if="cuss.userId!=myUid" href="javascript:;" style="font-size: 14px;color: #409eff;margin-left: 20px"
               @click="disuser(cuss.id,cuss.userId,cuss.username)">回复</a>
          </div>
          <div v-if="up&&huifu&&bid==cuss.id" style="display: flex;justify-content: space-between;margin-top: 30px">
            <el-avatar size="medium" :src="circleUrl"></el-avatar>
            <el-input :placeholder="pre" v-model="hui" style="width: 90%;margin-left: 20px">
            </el-input>
            <el-button type="info" style="margin-left: 20px" @click="tohuifu(cuss.userId,cuss.username)">回复
            </el-button>
          </div>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
    import 'github-markdown-css'
    import Header from "../components/Header";
    import {getbloginfo} from "../api";
    import {getlike} from "../api";
    import {like} from "../api";
    import {unlike} from "../api";
    import {getDiscuss} from "../api";
    import {sendDiscuss} from "../api";

    export default {
        name: "BlogDetail.vue",
        components: {Header},
        data() {
            return {
                blog: {
                    content: ""
                },
                myUid: '',
                on: false,
                circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                pinlun: '',
                discuss: [],
                huifu: false,
                bid: '',
                hui: '',
                pre: '',
                up: false
            }
        },

        methods: {

            getData() {
                var bid = this.$route.query.bid
                getbloginfo({
                    'bid': bid
                }).then(res => {
                    if (res.code === 0) {
                        this.blog = res.data
                        var MardownIt = require("markdown-it")
                        var md = new MardownIt()
                        this.blog.content = md.render(res.data.content)
                        getlike({
                            "likedBlogId": bid
                        }).then(res => {
                            if (res.code === 0) {
                                this.on = res.data
                            }
                        })
                    }
                })
            },

            getDiscuss() {
                getDiscuss({
                    "bid": this.$route.query.bid
                }).then(res => {
                    console.log("discuss", res)
                    if (res.code === 0) {
                        this.discuss = res.data
                    }
                })
            },

            tolike() {
                if (this.on == false) {
                    // 点赞
                    var vo = {}
                    vo.likedBlogId = this.$route.query.bid
                    like(vo).then(res => {
                        if (res.code === 0) {
                            this.on = true
                        }
                    })
                } else {
                    // 取消点赞
                    var vo = {}
                    vo.likedBlogId = this.$route.query.bid
                    unlike(vo).then(res => {
                        if (res.code === 0) {
                            this.on = false
                        }
                    })
                }
            },
            disuser(bid, uid, uname) {
                this.huifu = true
                this.bid = bid
                this.pre = `回复：${uname}`
                this.up = true
            },
            tohuifu(uid, uname) {
                var vo = {}
                vo.jid = this.$route.query.bid
                vo.content = `@${uname+' '}`+this.hui
                sendDiscuss(vo).then(res=>{
                    if (res.code === 0) {
                        this.getDiscuss()
                        this.hui = ''
                        this.up = false
                    }
                })
            },
            discussBlog() {
                var vo = {}
                vo.jid = this.$route.query.bid
                vo.content = this.pinlun
                sendDiscuss(vo).then(res=>{
                    if (res.code === 0) {
                        this.getDiscuss()
                        this.pinlun = ''
                    }
                })
            }

        },

        created() {
            this.getData()
            if (this.$store.getters.getUser) {
                this.myUid = this.$store.getters.getUser.uid
                if (this.$store.getters.getUser.logo != null) {
                    this.circleUrl = this.$store.getters.getUser.logo
                }
            }
            this.getDiscuss()
        }
    }
</script>

<style scoped>
  .mblog {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
  }

  .on {
    color: red;
  }

  .top {
    width: 100%;
    height: 45px;
    background-color: #B3C0D1;
    display: flex;
    align-items: center
  }

</style>
