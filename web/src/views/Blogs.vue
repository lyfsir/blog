<template>
  <div class="mcontaner">
    <Header></Header>

    <div class="block">
      <div style="margin-top: 30px;width: 70%;margin: 0 auto">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchTo"></el-button>
        </el-input>
      </div>
      <el-timeline style="margin-top: 20px">
        <div style="display: flex;margin-bottom: 20px">
          <a href="javascript:void(0);" :class="{on : on}" @click="newsort" style="margin-right: 20px">最新</a>
          <a href="javascript:void(0);" :class="{on : on2}" @click="hot">最热</a>
        </div>
        <el-timeline-item :timestamp="blog.createTime" placement="top" v-for="(blog,id) in blogs.blog" :key="id">
          <el-card>
            <h3>
              <a href="javascript:;" v-html="blog.title" @click="goInfo(blog.id)">
              </a>
            </h3>
            <div style="display: flex;justify-content: space-between">
              <p style="margin-top: 20px;">{{blog.description}}</p>
              <p style="font-size: 12px">{{blog.zan}}人觉得很赞</p>
            </div>
          </el-card>
        </el-timeline-item>

      </el-timeline>

      <!--      <div style="height: 200px;text-align: center;line-height: 200px;font-size: 20px;color: #B3C0D1;font-weight: bold"-->
      <!--           v-if="blogs==null||blogs.blog.length===0">找不到相关数据-->
      <!--      </div>-->

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

  </div>
</template>

<script>
    import Header from "../components/Header";
    import {reqBlogs} from "../api";

    export default {
        name: "Blogs.vue",
        components: {Header},
        data() {
            return {
                on: false,
                on2: false,
                search: '',
                blogs: [],
                total: 0,
                pageIndex: 1
            }
        },
        methods: {
            getData() {
                const searchParam = {}
                if (this.on == true) {
                    searchParam.sort = "id"
                }
                if (this.on2 == true) {
                    searchParam.sort = "zan"
                }
                if (this.search.trim() != '') {
                    searchParam.keyword = this.search
                }
                searchParam.pageNum = this.pageIndex
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
            searchTo() {
                if (this.search.trim() === '') {
                    this.$message('请输入搜索条件');
                }
                this.pageIndex = 1
                this.getData()
            },
            newsort() {
                this.on = true
                this.on2 = false
                this.pageIndex = 1
                this.getData()
            },
            hot() {
                this.on2 = true
                this.on = false
                this.pageIndex = 1
                this.getData()
            },
            goInfo(bid) {
                this.$router.push({
                    path: '/blogId',
                    query: {
                        bid: bid
                    }
                })
            }
        },
        created() {
            this.on = true
            this.getData()
        }
    }
</script>

<style scoped>

  .mpage {
    margin: 0 auto;
    text-align: center;
  }

  a:hover {
    color: red;
  }

  .on {
    color: red;
  }

</style>
