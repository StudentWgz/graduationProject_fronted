<template>
    <div class="box-card">
        <div>
            <el-card>
                <div slot="header" class="clearfix" style="display:flex">
                    <img :src="userInfo.userAvatar" width="80px" style="border-radius: 100%" height="80px" class="image">
                    <div style="padding: 14px;">
                        <span style="font-weight:bold;">{{ userInfo.userName }}</span>
                        <div style="display:flex">
                            <div style="margin-right:4px" v-for="(tag, index) in userInfo.tagList" :key="index">
                                <el-tag type="success">{{ tag }}</el-tag>
                            </div>
                        </div>
                        <span style="font-style:italic;color:aqua">
                            {{ userInfo.profile }}
                        </span>

                    </div>
                </div>
                <div style="display:flex;width:100%;justify-content: space-between">
                    <div>
                        账号: <span style="text-decoration:underline">
                            {{ userInfo.userAccount }}
                        </span>
                    </div>
                    <div>
                        性别: <span style="text-decoration:underline">
                            {{ userInfo.gender }}
                        </span>
                    </div>
                    <div>
                        角色: <span style="text-decoration:underline">
                            {{ userInfo.userRole }}
                        </span>
                    </div>
                    <div>
                        创建日期: <span style="text-decoration:underline">
                            {{ userInfo.createTime }}
                        </span>
                    </div>
                </div>
            </el-card>
        </div>
        <div style="display:flex">
            <div class="box-card-outer">
                <el-card style="height: 318%">
                    <div slot="header" class="clearfix">
                        <span style="font-weight:bold;">基本信息</span>
                        <!-- Form -->
                        <el-button style="margin-left:80%" type="text" @click="changeUserInfo">修改个人信息</el-button>
                    </div>
                    <div>
                        <div class="base-info">
                            性别： {{ userInfo.gender }}
                        </div>
                        <div class="base-info">
                            简介： {{ userInfo.profile }}
                        </div>
                        <div class="base-info">
                            电话号码：{{ userInfo.userPhone }}
                        </div>
                        <div class="base-info">
                            联系方式：{{ userInfo.userAccount }}
                        </div>
                        <div class="base-info" style="display:flex">
                            标签：
                            <div style="margin-right:4px" v-for="(tag, index) in userInfo.tagList" :key="index">
                                <el-tag type="success">{{ tag }}</el-tag>
                            </div>
                        </div>
                        <div class="base-info">
                            角色：{{ userInfo.userRole }}
                        </div>
                    </div>
                    <el-dialog title="编辑个人信息" :visible.sync="dialogFormVisible">
                        <el-form :model="form">
                            <el-form-item label="名称" :label-width="formLabelWidth">
                                <el-input v-model="form.userName" autocomplete="off">{{ form.userName }}</el-input>
                            </el-form-item>
                            <el-form-item label="性别" :label-width="formLabelWidth">
                                <el-select v-model="form.gender" placeholder="请选择性别">
                                    <el-option label="男" value="男"></el-option>
                                    <el-option label="女" value="女"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="电话号码" :label-width="formLabelWidth">
                                <el-input v-model="form.userPhone" autocomplete="off">{{ form.userPhone }}</el-input>
                            </el-form-item>
                            <el-form-item label="个人介绍" :label-width="formLabelWidth">
                                <el-input v-model="form.profile" autocomplete="off">{{ form.profile }}</el-input>
                            </el-form-item>
                            <el-form-item label="标签" :label-width="formLabelWidth">
                                <el-input v-model="form.tagList" autocomplete="off">{{ form.tagList
                                }}</el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="editUserInfoById">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-card>
            </div>
            <div class="box-card-inner">
                <div>
                    <el-card style="height:240px">
                        <div slot="header" class="clearfix">
                            <span>ta加入的队伍</span>
                        </div>
                        <div style="margin-right:4px;display:flex" v-for="(userTeam, index) in userInfo.userTeamListByOther"
                            :key="index">
                            <img :src="userTeam.avatarurl" width="25px" style="border-radius: 100%" height="25px"
                                class="image" />
                            <div style="margin-left:3px">
                                {{ userTeam.name }}
                            </div>
                        </div>
                    </el-card>
                </div>
                <div>
                    <el-card style="height:240px">
                        <div slot="header" class="clearfix">
                            <span>ta创建的队伍</span>
                        </div>
                        <div style="margin-right:4px;display:flex" v-for="(userTeam, index) in userInfo.userTeamListByMe"
                            :key="index">
                            <img :src="userTeam.avatarurl" width="25px" style="border-radius: 100%" height="25px"
                                class="image" />
                            <div style="margin-left:3px">
                                {{ userTeam.name }}
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import { showUserById } from "@/api/user";
import { editUser } from "@/api/user";


export default {
    name: 'MyInfomation',
    data() {
        return {
            userInfo: {
                userName: '',
                userAccount: '',
                userAvatar: '',
                userPhone: '',
                gender: '',
                profile: '',
                tagList: [],
                userRole: '',
                createTime: '',
                userTeamListByMe: ['s'],
                userTeamListByOther: [],
            },
            dialogFormVisible: false,
            form: {
                userName: '',
                userAccount: '',
                userAvatar: '',
                userPhone: '',
                gender: '',
                profile: '',
                tagList: ''
            },
            formLabelWidth: '120px'
        }
    },
    methods: {
        async showUserById() {
            const resp = await showUserById(this.userId)
            this.userInfo = resp.data
            resp.data.teamList.forEach(element => {
                // console.log(element);
                const userTeamListByMe = []
                const userTeamListByOther = []
                if (element.userid === this.userId) {
                    console.log('与我相关');
                    // console.log(this.userInfo.userTeamListByMe);
                    userTeamListByMe.push(element)
                } else {
                    console.log('与我无关');
                    userTeamListByOther.push(element)
                }
                this.userInfo.userTeamListByMe = userTeamListByMe
                this.userInfo.userTeamListByOther = userTeamListByOther
            });
            console.log(this.userInfo);
        },
        changeUserInfo() {
            this.dialogFormVisible = true,
                this.form = Object.assign({}, this.userInfo);
            this.form.tagList = this.userInfo.tagList.toString()
            console.log('修改个人信息');
        },
        onSubmit() {
            console.log('submit!');
        },
        async editUserInfoById() {
            this.dialogFormVisible = false
            const resp = await editUser({
                id: this.userId,
                userName: this.form.userName,
                userPhone: this.form.userPhone,
                profile: this.form.profile,
                tags: this.form.tagList
            })
            console.log('调用修改用户', resp);
            this.showUserById()
        }

    },
    mounted() {
        this.showUserById()
    },
    computed: {
        ...mapState('user', ['userId'])
    },
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    margin: 2%;

    .box-card-outer {
        margin-top: 2%;
        margin-right: 2%;
        margin-bottom: 2%;
        height: 150px;
        width: 90%;
    }

    .box-card-inner {
        margin-top: 2%;
    }
}

.base-info {
    margin-bottom: 5%;
}

.el-descriptions-item {
    margin-bottom: 5%;
}
</style>