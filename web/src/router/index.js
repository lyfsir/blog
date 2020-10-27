import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Blogs from '../views/Blogs.vue'
import BlogEdit from '../views/BlogEdit.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Register from "../views/Register";
import UserInfo from "../views/UserInfo";
import Messages from "../views/Messages";
import UserBlogs from "../views/UserBlogs";
import UserSetting from "../views/UserSetting";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "Blogs"}
  },
  {
    path: '/user',
    name: 'mess',
    redirect: {name: "Messages"}
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/user',
    name: 'UserInfo',
    component: UserInfo,
    children: [{
      path: 'mess',
      name: 'Messages',
      component: Messages
    },
      {
        path: 'blogs',
        name: 'UserBlogs',
        component: UserBlogs
      },
      {
        path: 'set',
        name: 'UserSetting',
        component: UserSetting
      },],
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
