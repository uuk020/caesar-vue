<style lang="scss" scoped>
#app {
    font-family: Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header {
    padding: 10px 0;
    box-shadow: 0 0 1px rgb(0 0 0 / 25%);
    background-color: #fff;
    transition: background-color 0.3s ease-in-out;

    .logo-container {
        a {
            width: 50px;
            height: 50px;

            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;

                &:hover {
                    transform: scaleX(-1);
                }
            }

        }
    }

    .header-nav {
        display: flex;
        justify-content: center;
        align-items: center;

        .header-btn {
            margin: 0 10px;
            a {
                color: #000000;
                text-decoration: none;
                cursor: pointer;
            }
        }
    }
}

.footer {
    padding: 20px 20px;
    background-color: #475050;
    color: #f0f4f8;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1,
    h2,
    h3 {
        color: #f0f4f8;
        padding: 0;
        margin: 0;
    }

    .links {
        display: flex;
        font-family: "Open Sans";

        p {
            display: inline-block;
            padding: 0 10px;
            font-size: 18px;
            border-right: 1px solid #9fb3c8;
            cursor: pointer;
            a {
                text-decoration: none;
                color: #f0f4f8;
            }

            &:last-child {
                border-right: none;
            }
        }
    }

    .version {
        font-family: "Open Sans";
        padding: 0 10px;
        color: #f0f4f8;
        font-size: 12px;
        margin-top: 5px;
    }
}
</style>

<template>
    <div id="app">
        <header class="header">
            <el-row type="flex" justify="center">
                <el-col :span="6">
                    <div class="logo-container">
                        <router-link to="/">
                            <img src="./assets/images/caesar.png" alt="logo">
                        </router-link>
                    </div>
                </el-col>
                <el-col :span="3"></el-col>
                <el-col :span="9">
                    <div v-if="isLogin" class="header-nav">
                        <el-button type="primary" plain @click="getMe" class="header-btn">我的</el-button>
                        <el-dialog title="个人资料" :visible.sync="dialogFormVisible">
                            <el-form :model="form">
                                <el-form-item label="邮箱" :label-width="formLabelWidth">
                                    <el-input v-model="form.email" autocomplete="off" type="email"></el-input>
                                </el-form-item>
                                <el-form-item label="手机" :label-width="formLabelWidth">
                                    <el-input v-model="form.phone" autocomplete="off" type="text"></el-input>
                                </el-form-item>
                                <el-form-item label="真实姓名" :label-width="formLabelWidth">
                                    <el-input v-model="form.real_name" autocomplete="off" type="text"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="updateMe">确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-button type="danger" plain @click="dialogVisible = true" class="header-btn">退出</el-button>
                        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                            <span>真的要登录账号?</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogVisible = false">取 消</el-button>
                                <el-button type="primary" @click="logout">确 定</el-button>
                            </span><span solt="footer"></span>
                        </el-dialog>
                    </div>
                    <div v-else class="header-nav">
                        <el-button type="primary" plain class="header-btn">
                            <router-link to="/login">登录</router-link>
                        </el-button>
                        <el-button type="success" plain class="header-btn">
                            <router-link to="/register">注册</router-link>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </header>
        <main>
            <router-view v-if="isRouterAlive" />
        </main>
        <footer class="footer">
            <div class="links">
                <p><a href="https://github.com/uuk020" target="_blank">Github</a></p>
                <p><a href="https://weibo.com/u/1865159810" target="_blank">新浪微博</a></p>
                <p>
                    <el-popover placement="top-start" width="300" trigger="hover">
                        <el-row type="flex">
                            <el-col :span="12">
                                <img src="./assets/images/wechat.png" alt="wechat"
                                    style="width:140px;height:150px;margin-right:10px">
                            </el-col>
                            <el-col :span="12">
                                <img src="./assets/images/alipay.png" alt="alipay" style="width:150px;height:150px">
                            </el-col>
                        </el-row>
                        <span slot="reference">打赏作者</span>
                    </el-popover>
                </p>
            </div>
            <div class="version">
                <p>遵循 Apache-2.0 开源协议</p>
                版权所有© {{ currentYear }}
            </div>
        </footer>
    </div>
</template>

<script>
import localStorage from './utils/storage'
import request from './utils/request'
import { Message } from 'element-ui'
function fetchMe() {
    return request({
        url: '/auth/me',
        method: 'get',
    })
}
function fetchUpdateMe(params) {
    return request({
        url: '/auth/me',
        method: 'put',
        data: params
    })
}
export default {
    data() {
        return {
            isRouterAlive: true,
            currentYear: new Date().getFullYear(),
            isLogin: localStorage.get('token') ? true : false,
            dialogFormVisible: false,
            form: {
                email: '',
                phone: '',
                real_name: ''
            },
            formLabelWidth: '120px',
            dialogVisible: false
        };
    },
    provide() {
        return {
            reload: this.reload,
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        },
        getMe() {
            fetchMe().then(res => {
                this.dialogFormVisible = true
                this.form.email = res.email
                this.form.phone = res.phone
                this.form.real_name = res.real_name
            })
        },
        updateMe() {
            fetchUpdateMe({
                email: this.form.email,
                phone: this.form.phone,
                real_name: this.form.real_name
            }).then(res => {
                this.dialogFormVisible = false
                Message.success(res.message)
            })
        },
        logout() {
            localStorage.remove('token')
            this.dialogVisible = false
            this.$router.push('/login')
        }
    },
}
</script>