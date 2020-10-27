<template>
  <div v-if="blogs.blog">
    <div v-if="blogs.blog.length>0">
      <el-timeline style="margin-top: 20px">
        <el-timeline-item :timestamp="blog.createTime" placement="top" v-for="(blog,id) in blogs.blog" :key="id">
          <el-card>
            <h3>
              <a href="javascript:;" v-html="blog.title" @click="goTo(blog.id)">
              </a>
            </h3>
            <div style="display: flex;justify-content: space-between">
              <p style="margin-top: 20px;">{{blog.description}}</p>
              <p style="font-size: 12px">{{blog.zan}}人觉得很赞</p>
            </div>
            <a href="javascript:;" @click="del(blog.id,blog.title)"><i style="margin-top: 20px"
                                                                       class="el-icon-delete"></i>
            </a>

          </el-card>
        </el-timeline-item>
      </el-timeline>
      <el-pagination
        style="text-align: center;margin-top: 30px;margin-bottom: 20px"

        background
        :page-size="12"
        :current-page="pageIndex"
        layout="pager"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <div v-if="blogs.blog.length===0">
      <p>你还未发布任何帖子</p>
    </div>
  </div>

</template>

<script>
    import {reqBlogs} from "../api";
    import {delbolg} from "../api";

    export default {
        name: "UserBlogs",
        data() {
            return {
                blogs: [],
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
                const searchParam = {}
                searchParam.pageNum = this.pageIndex
                searchParam.sort = 'id'
                searchParam.uid = this.$store.getters.getUser.uid
                const _this = this
                reqBlogs(searchParam).then((res) => {
                    if (res.code === 0) {
                        console.log("res", res)
                        _this.blogs = res.data
                        _this.total = res.data.total
                    }
                })
            },
            handleCurrentChange(c) {
                console.log("page", c)
                this.pageIndex = c
                this.getData()
            },
            del(bid, title) {
                this.$confirm(`确定对[帖子: ${title}]进行删除操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delbolg({
                        "id": bid
                    }).then(res => {
                        if (res.code === 0) {
                            this.$alert('删除成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.getData()
                                }
                            });
                        }
                    })
                }).catch(() => {
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
