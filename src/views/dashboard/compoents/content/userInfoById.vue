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
                    </div>
                    <div>
                        <div class="base-info">
                            性别： {{ userInfo.gender }}
                        </div>
                        <div class="base-info">
                            简介： {{ userInfo.profile }}
                        </div>
                        <div class="base-info">
                            电话号码：{{ userInfo.gender }}
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
import { showUserById } from "@/api/user";

export default {
    name: 'UserInfoById',
    props: {
        toUserId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            userInfo: {
                userName: '',
                userAccount: '',
                userAvatar: '',
                gender: '',
                profile: '',
                tagList: [],
                userRole: '',
                createTime: '',
                userTeamListByMe: ['s'],
                userTeamListByOther: [],
            },
        }
    },
    methods: {
        async showUserById(userId) {
            console.log('进入查询', userId);
            const resp = await showUserById(userId)
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
        }
    },
    mounted() {

    },
    watch: {
        toUserId: function () {
            this.showUserById(this.toUserId)
        }
    }
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
    margin-bottom: 3%;
}
</style>