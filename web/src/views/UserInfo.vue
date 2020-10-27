<template>
  <div class="user">
    <el-container>
      <el-container>
        <el-aside width="130px">
          <ul class="left">
            <li>
              <img :src="logo" alt="img" width="100%" height="100%">
<!--              <el-avatar shape="square" :size="100" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"></el-avatar>-->
            </li>
            <a href="javascript:void(0);" :class="{on : '/user/mess'===$route.path}" @click="goTo('/user/mess')">
              <li>
                消息中心
              </li>
            </a>
            <a href="javascript:void(0);" :class="{on : '/user/blogs'===$route.path}" @click="goTo('/user/blogs')">
              <li>
                发布的贴子
              </li>
            </a>
            <a href="javascript:void(0);" :class="{on : '/user/set'===$route.path}" @click="goTo('/user/set')">
              <li>
                账户设置
              </li>
            </a>
          </ul>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>

</template>

<script>
    export default {
        name: "UserInfo",
        data(){
            return{
                logo: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
            }
        },
        methods: {
            goTo(path) {
                this.$router.push(path)
            }
        },
        created() {
            if (this.$store.getters.getUser.logo!=null) {
                this.logo = this.$store.getters.getUser.logo
            }
        }
    }
</script>

<style scoped>

  .user{
    padding-top: 40px;
  }
  .el-aside {
    background-color: #D3DCE6;
    position: fixed;
    height: 100%;

  }

  .el-main {
    margin-left: 130px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .left {
    display: flex;
    flex-direction: column;
  }

  li {
    height: 100px;
    text-align: center;
    line-height: 100px;
    border-bottom: 1px solid #d3dce6;
  }
  a:hover {
    background-color: #eeeeee;
  }

  .on {
    background-color: #eeeeee;
  }

</style>
