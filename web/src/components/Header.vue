<template>
  <div class="m-content">

    <div class="block">
      <el-badge :value="messCount" class="item" :hidden="messCount===0">


        <a href="javascript:;" @click="goTo('/user')">
          <el-avatar :size="50" :src="user.avatar"></el-avatar>
        </a>
      </el-badge>
      <div><a href="javascript:;" @click="goTo('/user')">{{ user.username }}</a></div>
    </div>

    <div class="maction">
      <span><el-link :class="{on : '/blogs'===$route.path}" @click="goTo('/blogs')">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link :class="{on : '/blog/add'===$route.path}" @click="goTo('/blog/add')">发表博客</el-link></span>

      <el-divider direction="vertical"></el-divider>
      <span v-show="!hasLogin"><el-link href="/login">登录</el-link></span>

      <span v-show="hasLogin"><el-link @click="logout">退出</el-link></span>
    </div>

  </div>
</template>

<script>
    import {logout} from "../api";
    import PubSub from "pubsub-js";

    export default {
        name: "Header",
        data() {
            return {
                user: {
                    username: '请先登录',
                    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                },
                hasLogin: false,
                messCount: 0
            }
        },
        methods: {
            goTo(path) {
                this.$router.push(path)
            },
            logout() {
                logout().then(res => {
                    if (res.code === 0) {
                        this.$router.push('/login')
                        this.$store.commit("REMOVE_INFO")
                    }
                })
            }
        },
        created() {
            if (this.$store.getters.getUser) {
                this.user.username = this.$store.getters.getUser.username
                if (this.$store.getters.getUser.logo != null) {
                    this.user.avatar = this.$store.getters.getUser.logo
                }
                this.hasLogin = true
            }
        },
        mounted() {
            const _this = this;
            PubSub.subscribe("count", (msg, count) => {
                _this.messCount = count
            });
        },
    }
</script>

<style scoped>

  .m-content {
    padding-top: 20px;
    max-width: 960px;
    margin: 0 auto;
    text-align: center;
  }

  .maction {
    margin: 10px 0;
  }

  .on {
    font-weight: bold;
  }

</style>
