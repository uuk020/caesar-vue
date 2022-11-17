<style lang="scss" scoped>
.register {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 800px;

    .register-card {
        width: 550px;
    }
}

.register-button {
    width: 100%;
    margin-top: 20px;
}

.register-form {
    padding: 20px 20px 20px 0;
}

.captcha-container {
    width: 100px;
    height: 38px;

    img {
        width: 100%;
        height: 100%;
    }

    i {
        display: none;
    }
}

.register-footer {
    margin-left: 23%;

    .register-footer-content {
        display: inline-block;
        margin: 10px;

        a {
            color: #000000;
            font-size: 12px;
            text-decoration: none;
        }
    }
}
</style>
<template>
    <div class="register">
        <el-row type="flex">
            <el-card class="register-card">
                <el-col :span="24">
                    <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px"
                        class="register-form">
                        <el-form-item label="账号" prop="user_name">
                            <el-input type="text" v-model="form.user_name" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="姓名" prop="real_name">
                            <el-input type="text" v-model="form.real_name" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input type="text" v-model="form.email" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="form.password" autocomplete="off" show-password />
                        </el-form-item>
                        <el-form-item label="重复密码" prop="re_password">
                            <el-input type="password" v-model="form.re_password" autocomplete="off" show-password />
                        </el-form-item>
                        <el-form-item label="主密码" prop="main_password">
                            <el-input type="password" v-model="form.main_password" autocomplete="off" show-password />
                        </el-form-item>
                        <el-form-item label="手机" prop="phone">
                            <el-input type="text" v-model="form.phone" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="验证码" prop="captcha">
                            <el-input type="text" v-model="form.captcha" autocomplete="off" maxlength=5>
                                <template slot="append">
                                    <div class="captcha-container">
                                        <img :src="captchaImage" alt="captcha_image" @click="loadCaptchaCode">
                                        <i>{{ captchaId }}</i>
                                    </div>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="register-button" @click="registerForm">注册
                            </el-button>
                        </el-form-item>
                        <div class="register-footer">
                            <div class="register-footer-content">
                                <router-link to="/login">登录账号</router-link>
                            </div>
                            <div class="register-footer-content">
                                <el-button type="text" @click="dialogVisible = true">激活账号</el-button>
                                <el-dialog title="激活账号" :visible.sync="dialogVisible">
                                    <el-form :model="xForms" :rules="xRules">
                                        <el-form-item label="邮箱" prop="name">
                                            <el-input v-model="xForms.name" autocomplete="off"
                                                placeholder="请输入邮箱"></el-input>
                                        </el-form-item>
                                        <el-form-item label="验证码" prop="code">
                                            <el-input v-model="xForms.code" autocomplete="off"
                                                placeholder="请输入验证码, 区分大小写">
                                                <el-button slot="append" icon="el-icon-message" @click="sendEmail">
                                                </el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="dialogVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="activateForm">确 定</el-button>
                                    </div>
                                </el-dialog>
                            </div>
                        </div>
                    </el-form>
                </el-col>
            </el-card>
        </el-row>
    </div>
</template>

<script>
import { Message } from 'element-ui'
import request from '../utils/request'
function getCode(params) {
    return request({
        url: '/captcha',
        method: 'get',
        params: params
    })
}

export default {
    data() {
        return {
            form: {
                user_name: '',
                real_name: '',
                email: '',
                password: '',
                re_password: '',
                main_password: '',
                phone: '',
                captcha: ''
            },
            rules: {
                user_name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
                ],
                real_name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                re_password: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                main_password: [
                    { required: true, message: '请输入主密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { min: 11, message: '长度为 11 个字符', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
                ]
            },
            captchaImage: '',
            captchaId: '',
            dialogVisible: false,
            xForms: {
                name: '',
                code: ''
            },
            xRules: {
                name: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.loadCaptchaCode()
    },
    methods: {
        loadCaptchaCode() {
            // 发送请求
            getCode().then(res => {
                this.captchaImage = res.image
                this.captchaId = res.id
            })
        },
        registerForm() {
            if (this.form.password !== this.form.re_password) {
                Message.error('两次输入的密码不一致')
                return
            }
            request({
                url: '/register',
                method: 'post',
                data: {
                    user_name: this.form.user_name,
                    real_name: this.form.real_name,
                    email: this.form.email,
                    password: this.form.password,
                    re_password: this.form.re_password,
                    main_password: this.form.main_password,
                    phone: this.form.phone,
                    captcha: this.form.captcha,
                    captcha_id: this.captchaId
                }
            }).then(res => {
                Message.success('注册成功, 需要激活账号才能登录')
                this.form = {
                    user_name: '',
                    real_name: '',
                    email: '',
                    password: '',
                    re_password: '',
                    main_password: '',
                    phone: '',
                    captcha: ''
                }
                return
            }).catch(err => {
                this.loadCaptchaCode()
                this.form = {
                    user_name: '',
                    real_name: '',
                    email: '',
                    password: '',
                    re_password: '',
                    main_password: '',
                    phone: '',
                    captcha: ''
                }
                return
            })
        },
        sendEmail() {
            if (!this.xForms.name) {
                Message({
                    message: '请输入邮箱',
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            request({
                url: '/email',
                method: 'put',
                data: {
                    email: this.xForms.name,
                    type: 'activation'
                }
            }).then(res => {
                Message.success(res)
            }).catch(err => {
                Message.error('发送失败')
            })
        },
        activateForm() {
            request({
                url: '/activation',
                method: 'post',
                data: {
                    email: this.xForms.name,
                    code: this.xForms.code
                }
            }).then(res => {
                Message.success(res)
                this.dialogVisible = false
            }).catch(err => {
                return
            })
        },
    }
}
</script>