<template>
    <div class="bar">
      <p></p>
      <h3>欢迎来到博客系统</h3>
      <p style="padding-right: 20px"><router-link to="/">首页</router-link></p>
    </div>
</template>

<script>
    export default {
        name: "Bar"
    }
</script>

<style scoped>
    .bar{
      width: 100%;
      height: 40px;
      background-color: #B3C0D1;
      font-family: "楷体";
      line-height: 40px;
      display: flex;
      justify-content: space-between;
    }
</style>
