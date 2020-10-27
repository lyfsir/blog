<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <p>我的消息</p>
      <el-button type="danger" plain size="medium" @click="delall" v-if="mess && mess.length>0">清空消息</el-button>
    </div>
    <div  v-if="mess && mess.length>0">
      <el-timeline style="margin-top: 20px">
        <el-timeline-item :timestamp="message.created" placement="top" v-for="(message,id) in mess" :key="id"
                          v-if="message.type === 1">
          <el-card>
            <h3>
              {{message.fromUserName}}评论了您的帖子<a href="javascript:;" @click="goTo(message.postId)">“{{message.postTitle}}”</a>；
              内容为：{{message.content}}；
            </h3>
            <a href="javascript:;" @click="del(message.id)"><i style="margin-top: 20px"
                                                               class="el-icon-delete"></i>
            </a>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="message.created" placement="top" v-for="(message,id) in mess" :key="id"
                          v-if="message.type === 2">
          <el-card>
            <h3>
              有人@了您：来自{{message.fromUserName}}用户；
              内容为：{{message.content}}；
              相关帖子：<a href="javascript:;" @click="goTo(message.postId)">“{{message.postTitle}}”</a>
            </h3>
            <a href="javascript:;" @click="del(message.id)"><i style="margin-top: 20px"
                                                               class="el-icon-delete"></i>
            </a>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-pagination
        style="text-align: center;margin-top: 30px;margin-bottom: 20px"
        background
        :page-size="pageSize"
        :current-page="pageIndex"
        layout="pager"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <div v-if="mess.length === 0" style="width: 100%;height: 500px;line-height: 500px;text-align: center">
      <h2 style="font-family: '仿宋'">您还没有任何消息</h2>
    </div>


  </div>
</template>

<script>
    import {getUserMess} from "../api";
    import {delmess} from "../api";

    export default {
        name: "Messages",
        data() {
            return {
                mess: [],
                pageSize: 10,
                total: 0,
                pageIndex: 1
            }
        },
        methods: {
            goTo(id) {
                this.$router.push({
                    path: '/blogId',
                    query: {
                        bid: id
                    }
                })
            },
            getData() {
                const params = {}
                params.page = this.pageIndex
                params.limit = this.pageSize
                getUserMess({
                    "page": this.pageIndex,
                    "limit": this.pageSize
                }).then(res => {
                    if (res && res.code === 0) {
                        console.log("usermess", res)
                        this.mess = res.page.list
                        this.total = res.page.totalCount
                    } else {
                        this.mess = []
                        this.total = 0
                    }
                })
            },
            handleCurrentChange(c) {
                console.log("page", c)
                this.pageIndex = c
                this.getData()
            },
            del(mid) {
                this.$confirm(`确定对此消息进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delmess({
                        "id" : mid
                    }).then(res=>{
                        if (res.code === 0) {
                            this.$alert('删除成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.getData()
                                }
                            });
                        }
                    })
                })

            },
            delall() {
                this.$confirm(`确定清空您的全部消息?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delmess({
                        "all" : true
                    }).then(res=>{
                        if (res.code === 0) {
                            this.$alert('删除成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.getData()
                                }
                            });
                        }
                    })
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
  a:hover {
    color: red;
  }
</style>
