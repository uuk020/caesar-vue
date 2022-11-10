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
                                <router-link to="/email">忘记密码</router-link>
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
                        user_name : this.ruleForm.name,
                        password : this.ruleForm.pass,
                        captcha_id : this.captchaId,
                        captcha : this.ruleForm.captcha
                    }).then(res => {
                        Message.success('登录成功')
                        localStorage.setItem('token', res.token)
                        this.$router.push('/home')
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
        }
    }
}
</script>