<style lang="scss" scoped>
.home {
    height: 800px;

    .card-container {
        margin: 20px 20px 0;
        padding: 20px;
    }
}
</style>
<template>
    <section class="home">
        <!-- 查询条件 -->
        <el-card class="card-container">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" :model="searchTable">
                        <el-form-item label="平台">
                            <el-input v-model="searchTable.platform" placeholder="请输入平台"></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="searchTable.createDate" value-format="yyyy-MM-dd" type="daterange"
                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button type="success" plain @click="dialogForm = true">新建平台账号</el-button>
                        </el-form-item>
                    </el-form>
                    <el-dialog title="新建平台账号" :visible.sync="dialogForm">
                        <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                            <el-form-item label="平台" prop="platform">
                                <el-input v-model="form.platform"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item label="账号" prop="name">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="form.password" type="password" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="主密码" prop="main_password">
                                <el-input v-model="form.main_password" type="password" show-password></el-input>
                            </el-form-item>
                            <el-form-item label="链接" prop="url">
                                <el-input v-model="form.url"></el-input>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogForm = false">取 消</el-button>
                            <el-button type="primary" @click="createAccount">确 定</el-button>
                        </span>
                    </el-dialog>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="tableData" border stripe style="width: 100%;height: 600px;" max-height="600px">
                <el-table-column prop="id" label="ID"></el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="name" label="账号"></el-table-column>
                <el-table-column prop="password" label="密码"></el-table-column>
                <el-table-column prop="url" label="平台链接"></el-table-column>
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column prop="updated_at" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleRead(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                        <el-button type="text" size="small" @click="handleLog(scope.row)">日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="page_size"
                layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="查看" :visible.sync="dialogRead">
            <el-form :model="detail" ref="detail" label-width="80px">
                <el-form-item label="ID">
                    <el-input v-model="detail.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="平台">
                    <el-input v-model="detail.platform" disabled></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <el-input v-model="detail.url" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="detail.email"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="name">
                    <el-input v-model="detail.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="detail.password" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="主密码" prop="main_password" v-if="isEdit">
                    <el-input v-model="detail.main_password" type="password" show-password></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRead = false">取 消</el-button>
                <el-button @click="updateAccount" v-if="isEdit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="日志" :visible.sync="dialogLog">
            <el-table :data="logData" border strpie>
                 <el-table-column property="id" label="ID"></el-table-column>
                 <el-table-column property="type" label="操作类型"></el-table-column>
                 <el-table-column property="created_at" label="操作时间"></el-table-column>
            </el-table>
            <el-pagination @current-change="handleLogCurrentChange" :current-page="logPage" :page-size="logPageSize"
                layout="total, prev, pager, next, jumper" :total="logTotal">
            </el-pagination>
        </el-dialog>
    </section>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import request from '../utils/request'
function fechtAccountList(params) {
    return request({
        url: '/auth/account',
        method: 'get',
        params
    })
}
function formatTableData(data) {
    let tableData = []
    data.forEach(item => {
        tableData.push({
            id: item.id,
            platform: item.platform,
            email: item.email,
            name: item.name,
            password: item.password,
            url: item.url,
            created_at: new Date(item.created_at * 1000).toLocaleString(),
            updated_at: new Date(item.updated_at * 1000).toLocaleString()
        })
    })
    return tableData
}
export default {
    data() {
        return {
            // 新建平台账号
            labelPosition: 'left',
            dialogForm: false,
            rules: {
                platform: [
                    { required: true, message: '请输入平台', trigger: 'blur' },
                    { min: 3, message: '长度最少 3 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, message: '长度最少 3 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, message: '长度最少 3 个字符', trigger: 'blur' }
                ],
                main_password: [
                    { required: true, message: '请输入主密码', trigger: 'blur' },
                    { min: 6, message: '长度最少 6 个字符', trigger: 'blur' }
                ],
                url: [
                    { required: false, message: '请输入链接', trigger: 'blur' },
                    { type: "url", message: '链接错误', trigger: 'blur' }
                ]
            },
            form: {
                platform: '',
                name: '',
                email: '',
                password: '',
                main_password: '',
                url: ''
            },
            // 查询条件和表格数据
            page: 1,
            page_size: 2,
            total: 0,
            searchTable: {
                platform: '',
                createDate: []
            },
            tableData: [],
            // 查看
            dialogRead: false,
            detail: {
                id: 0,
                platform: '',
                email: '',
                name: '',
                password: '',
                url: '',
                main_password: ''
            },
            // 编辑
            isEdit: false,
            // 日志
            dialogLog: false,
            logData: [],
            logPage: 1,
            logPageSize: 10,
            logTotal: 0,
            accountId: 0,
        }
    },
    created() {
        this.initTableData()
    },
    inject: ['reload'],
    methods: {
        initTableData() {
            fechtAccountList({
                page: this.page,
                page_size: this.page_size
            }).then(res => {
                this.tableData = formatTableData(res.data)
                this.total = res.count
                this.page = res.page
                this.page_size = res.page_size
            })
        },
        createAccount() {
            request({
                url: '/auth/account',
                method: 'post',
                data: this.form
            }).then(res => {
                Message.success(res)
                this.dialogForm = false
                this.reload()
            })
        },
        search() {
            let params = {
                page: this.page,
                page_size: this.page_size
            }
            if (this.searchTable.platform) {
                params.platform = this.searchTable.platform
            }
            if (this.searchTable.createDate && this.searchTable.createDate.length > 0) {
                params.date_start = this.searchTable.createDate[0]
                params.date_end = this.searchTable.createDate[1]
            }

            fechtAccountList(params).then(res => {
                this.tableData = formatTableData(res.data)
                this.total = res.count
                this.page = res.page
                this.page_size = res.page_size
            })
        },
        handleCurrentChange(val) {
            let params = {
                page: val,
                page_size: this.page_size
            }
            if (this.searchTable.platform) {
                params.platform = this.searchTable.platform
            }
            if (this.searchTable.createDate.length > 0) {
                params.date_start = this.searchTable.createDate[0]
                params.date_end = this.searchTable.createDate[1]
            }
            fechtAccountList(params).then(res => {
                this.tableData = formatTableData(res.data)
                this.total = res.count
                this.page = res.page
                this.page_size = res.page_size
            })
        },
        handleRead(row) {
            MessageBox.prompt('请输入主密码', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: (val) => {
                    if (val.length < 6) {
                        return false
                    }
                    return true
                },
                inputErrorMessage: '主密码长度必须大于 6 个字符',
                inputType: 'password',
                center: true,
            }).then(({ value }) => {
                request({
                    url: '/auth/account/' + row.id,
                    method: 'post',
                    data: {
                        main_password: value
                    }
                }).then(res => {
                    this.dialogRead = true
                    this.detail = {
                        id: row.id,
                        platform: row.platform,
                        name: res.name,
                        email: res.email,
                        password: res.password,
                        main_password: '',
                        url: row.url
                    }
                })
            }).catch(() => {
                Message.info({
                    message: '取消操作'
                })
            })
        },
        handleEdit(row) {
            this.isEdit = true
            this.handleRead(row)
        },
        updateAccount() {
            this.dialogRead = false
            request({
                url: '/auth/account/' + this.detail.id,
                method: 'put',
                data: {
                    name: this.detail.name,
                    email: this.detail.email,
                    password: this.detail.password,
                    main_password: this.detail.main_password
                }
            }).then(res => {
                Message.success('修改成功')
                this.reload()
            })
        },
        handleDelete(row) {
            MessageBox.prompt('此操作将永久删除该账号信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                inputValidator: (val) => {
                    if (val.length < 6) {
                        return false
                    }
                    return true
                },
                inputErrorMessage: '主密码长度必须大于 6 个字符',
                inputType: 'password',
                center: true,
            }).then(({ value }) => {
                request({
                    url: '/auth/account/' + row.id,
                    method: 'delete',
                    data: {
                        main_password: value
                    }
                }).then(res => {
                    Message.success(res)
                    this.reload()
                })
            }).catch(() => {
                Message.info({
                    message: '已取消删除'
                })
            })
        },
        getLogData(id) {
            request({
                url: '/auth/account/' + id + '/log',
                method: 'get',
                params: {
                    page: this.logPage,
                    page_size: this.logPageSize
                }
            }).then(res => {
                let formatData = []

                res.data.forEach(item => {
                    if (item.type === 0) {
                        item.type = '新增平台信息'
                    } else if (item.type === 1) {
                        item.type = '查看平台信息'
                    } else if (item.type === 2) {
                        item.type = '编辑平台信息'
                    }
                    item.created_at = new Date(item.created_at * 1000).toLocaleString()
                    formatData.push({
                        id: item.id,
                        type: item.type,
                        created_at: item.created_at
                    })
                })
                this.logData = formatData
                this.logTotal = res.count
                this.logPage = res.page
                this.logPageSize = res.page_size
            })
        },
        handleLog(row) {
            this.dialogLog = true
            this.accountId = row.id
            this.getLogData(row.id)
        },
        handleLogCurrentChange(val) {
            this.logPage = val
            if (!!this.accountId) {
                this.getLogData(this.accountId)
            }
        },
    }
}
</script>