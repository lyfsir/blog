/*
包含n个接口请求函数的模块
函数的返回值: promise对象
 */

import {del, get, post, put} from '../axios'

export const reqBlogs = p => get('/api/get/blogs', p);
export const login = p => post('/api/login', p);
export const logout = p => post('/api/logout', p);
export const register = p => post('/api/register', p);
export const saveBlog = p => post('/api/save/blog', p);
export const getoss = p => get('/api/oss/doget', p);
export const updateUser = p => put('/api/upUser', p);
export const getMessCount = p => get('/api/message/count', p);
export const getUserMess = p => get('/api/user/message', p);
export const delbolg = p => del('/api/del/blogs', p);
export const delmess = p => del('/api/del/message', p);
export const getbloginfo = p => get('/api/get/blogsInfo', p);
export const getlike = p => get('/api/like/status', p);
export const like = p => post('/api/like', p);
export const unlike = p => post('/api/unlike', p);
export const getDiscuss = p => get('/api/discuss', p);
export const sendDiscuss = p => post('/api/post/reply/', p);




