<style lang="scss" scoped>
.login {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 800px;
}

.avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    transform: translate(10%, 30%);

    img {
        height: 100%;
        width: 100%;
        border-radius: 50%;

        &:hover {
            transform: scaleX(-1);
        }

    }
}

.login-button {
    width: 100%;
    margin-top: 20px;
}

.login-form {
    width: 290px;
}

.captcha-container {
    width: 190px;
    height: 50px;
    margin-left: 100px;

    img {
        width: 100%;
        height: 100%;
    }

    i {
        display: none;
    }
}

.login-footer {
    margin-left: 35%;

    .login-footer-content {
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
    <div class="login">
        <el-row type="flex">
            <el-card>
                <el-col :span="6">
                    <div class="avatar-box">
                        <img src="../assets/images/caesar.png" alt="logo">
                        <p>Veni! Vidi! Vici!</p>
                    </div>
                </el-col>
                <el-col :span="18">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                        class="login-form">
                        <el-form-item label="账号" prop="name">
                            <el-input type="text" v-model="ruleForm.name" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password />
                        </el-form-item>
                        <el-form-item label="验证码" prop="captcha">
                            <el-input type="text" v-model="ruleForm.captcha" autocomplete="off" maxlength=5 />
                        </el-form-item>
                        <div class="captcha-container">
                            <img :src="captchaImage" alt="captcha_image" @click="loadCaptchaCode">
                            <i>{{ captchaId }}</i>
                        </div>
                        <el-form-item>
                            <el-button type="primary" class="login-button" @click="submitForm('ruleForm')">登录
                            </el-button>
                        </el-form-item>
                        <div class="login-footer">
                            <div class="login-footer-content">
                                <router-link to="/register">注册账号</router-link>
                            </div>
                            <div class="login-footer-content">
                                <el-button type="text" @click="dialogForgetPassword = true">忘记密码</el-button>
                                <el-dialog title="忘记密码" :visible.sync="dialogForgetPassword">
                                    <el-form :model="passwordForm" :rules="passwordRules">
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="passwordForm.email" autocomplete="off"
                                                placeholder="请输入邮箱"></el-input>
                                        </el-form-item>
                                        <el-form-item label="验证码" prop="code">
                                            <el-input v-model="passwordForm.code" autocomplete="off"
                                                placeholder="请输入验证码, 区分大小写">
                                                <el-button slot="append" icon="el-icon-message" @click="sendEmail">
                                                </el-button>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="新密码" prop="password">
                                            <el-input v-model="passwordForm.password" autocomplete="off" show-password
                                                placeholder="请输入密码"></el-input>
                                        </el-form-item>
                                        <el-form-item label="确认密码" prop="confirmPassword">
                                            <el-input v-model="passwordForm.confirmPassword" autocomplete="off"
                                                show-password placeholder=重复密码></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="dialogForgetPassword = false">取 消</el-button>
                                        <el-button type="primary" @click="resetPassword">确 定</el-button>
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
function login(params) {
    return request({
        url: '/login',
        method: 'post',
        data: params
    })
}
export default {
    data() {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名或邮箱'))
            } else if (value.length < 3) {
                callback(new Error('用户名或邮箱字数错误'))
            } else {
                callback()
            }
        }

        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback()
            }
        }

        var validateCaptchaCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'))
            } else if (value.length !== 5) {
                callback(new Error('验证码必须为5位'))
            } else {
                callback()
            }
        }

        return {
            ruleForm: {
                name: '',
                pass: '',
                checkPass: '',
                captcha: ''
            },
            captchaImage: '',
            captchaId: '',
            rules: {
                pass: [
                    { validator: validatePass, trigger: 'blur' },
                ],
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                captcha: [
                    { validator: validateCaptchaCode, trigger: 'blur' }
                ],

            },
            dialogForgetPassword: false,
            passwordForm: {
                email: '',
                code: '',
                password: '',
                confirmPassword: ''
            },
            passwordRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 6, max: 6, message: '验证码必须为6位', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
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
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 登录
                    login({
                        user_name: this.ruleForm.name,
                        password: this.ruleForm.pass,
                        captcha_id: this.captchaId,
                        captcha: this.ruleForm.captcha
                    }).then(res => {
                        Message.success('登录成功')
                        localStorage.setItem('token', res.token)
                        this.$router.go('/home')
                        return
                    }).catch(err => {
                        this.loadCaptchaCode()
                        return
                    })
                } else {
                    Message({
                        message: '请检查输入内容',
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return false;
                }
            })
        },
        sendEmail() {
            if (!this.passwordForm.email) {
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
                    email: this.passwordForm.email,
                    type: 'password'
                }
            }).then(res => {
                Message.success(res)
            }).catch(err => {
                Message.error('发送失败')
            })
        },
        resetPassword() {
            request({
                url: '/password',
                method: 'post',
                data: {
                    email: this.passwordForm.email,
                    code: this.passwordForm.code,
                    password: this.passwordForm.password,
                    re_password: this.passwordForm.confirmPassword
                }
            }).then(res => {
                Message.success(res)
                this.dialogForgetPassword = false
            }).catch(err => {
                Message.error('重置失败')
            })
        },
    }
}
</script>