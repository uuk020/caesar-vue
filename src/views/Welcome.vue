<style lang="scss" scoped>
.section-container {
    margin: 30px 0;
}
.left {
    position: relative;
    width: 100%;
    height: 100%;

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 30%;
        width: 44%;
        margin: -15% 0 0 -20%;

        h1 {
            font-size: 30px;
            text-align: center;
            color: #c30016;
        }

        p {
            font-size: 20px;
            text-align: center;
        }

        .btn {
            margin: 0 10px;

            a {
                text-decoration: none;
                color: #000000;
            }
        }
    }
}

.right {
    width: 100%;
    height: 100%;
    img {

        border-radius: 10px;
        box-shadow: 0 0 10px #000000;
        border: 1px solid #cccccc;
    }
}

.hightlights {
    margin-top: 40px;
    padding: 50px 0 70px;
    .point {
        width: 55%;
        vertical-align: top;
        box-sizing: border-box;
        padding: 0 2em;
        h2 {
            color: #c30016;
            font-size: 1.5em;
            font-weight: 400;
            margin: 0;
            padding: 0.5em 0;
        }
        p {
            text-align: left;
            line-height: 30px;
        }
    }
}
</style>

<template>
    <section class="section-container">
        <el-row type="flex" justify="center">
            <el-col :span="8">
                <div class="left">
                    <div class="content">
                        <h1>凯撒密码网</h1>
                        <p>存储和使用您密码管理器</p>
                        <div v-if="isLogin">
                            <el-button type="primary" plain class="btn">
                                <router-link to="/home">进入</router-link>
                            </el-button>
                        </div>
                        <div v-else>
                            <el-button type="primary" plain class="btn">
                                <router-link to="/login">登录</router-link>
                            </el-button>
                            <el-button type="success" plain class="btn">
                                <router-link to="/register">注册</router-link>
                            </el-button>
                        </div>
                    </div>
                </div>

            </el-col>
            <el-col :span="8">
                <div class="right">
                    <img src="../assets/images/caesar-bg.png" alt="caesar background">
                </div>
            </el-col>
        </el-row>
        <el-row type="flex" class="hightlights" justify="center">
            <el-col :span="6">
                <div class="point">
                    <h2>安全</h2>
                    <p>保护您的隐私是我们的重中之重，确保您的数据始终安全。</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="point">
                    <h2>锁紧</h2>
                    <p>您的登录名和私人文档将安全地存储在您的密码保险库中</p>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="point">
                    <h2>隐私</h2>
                    <p>您的所有其他密码都受您的帐户密码所保护</p>
                </div>
            </el-col>
        </el-row> 
    </section>
</template>

<script>
import localStorage from '../utils/storage'
export default {
    data() {
        return {
            isLogin: localStorage.get('token') ? true : false,
        }
    },
}
</script>