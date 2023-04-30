<template>
  <div>
    <div>
      <el-container>
        <el-aside style="width: 160px">
          <!-- 左边导航栏 -->
          <el-row class="tac" style="height: 200px">
            <el-col :span="17">
              <h5 style="margin-left: 51px">匹配方式</h5>
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                @select="handleSelect">
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">随机匹配</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-sunny"></i>
                  <span slot="title">智能匹配</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main class="main">
          <el-input placeholder="搜索感兴趣的人吧！" v-model="input" clearable style="width:25%;margin-bottom:2%">
          </el-input>
          <el-button style="margin-left: 20px" type="primary" @click="initUser">搜索</el-button>
          <div>
            <div style="display: flex; flex-wrap: wrap;">
              <div v-for="(o, index) in list" :key="index">
                <!-- v-if="o.id!==userId" -->
                <el-card class="card">
                  <div style="display: inline; margin-left: 5px; margin-right: 5px;">
                    <img :src="o.userAvatar
                      " class="image" alt="角色头像" />
                    <div style="height:100px">
                      <div style="margin-bottom: 2px;margin-left: 30%">
                        <p> {{ o.userName }} </p>
                      </div>
                      <div v-for="(tag, index) in o.tags" :key="index"
                        style="display:inline-flex ;margin-right:10px;margin-left:10px">
                        <el-tag type="primary">
                          {{ tag }}
                        </el-tag>
                      </div>

                    </div>
                  </div>
                  <div style="display: flex;flex-direction: column;justify-content: center; align-items: center;">
                    <div style="margin-bottom: 16px">{{ o.userName }}</div>
                    <div>
                      <div style="padding: 10px 0;">{{ o.profile }}11</div>
                      <div>
                        <el-button type="primary" @click="getUserInfoById(o.id)">查看信息</el-button>
                        <el-button type="primary" @click="addUserById(o.id)">添加好友</el-button>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
          <div class="block" height="1000px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="5"
              layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { userListByPage, addFriendShip ,showUserById} from '@/api/user'
import { mapState } from 'vuex'

export default {
  name: 'SearchFriend',
  props: ['showUserByIdEvent'],
  data() {
    return {
      name: 'SearchFriend',
      type: 1,
      currentDate: new Date(),
      pageSize: 5,
      total: 1,
      currentPage: 1,
      list: [],
      input: ''
    }
  },
  computed: {
    ...mapState({ userId: state => state.user.userId })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    async handleSizeChange(val) {
      const resp = await userListByPage({
        pageNum: this.currentPage,
        pageSize: val
      })
      this.pageSize = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async handleCurrentChange(val) {
      const resp = await userListByPage({
        pageNum: val,
        pageSize: this.pageSize
      })
      this.pageNum = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async initUser() {
      const resp = await userListByPage({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        inputContent: this.input
      })
      this.total = resp.data.total
      this.list = resp.data.list
    },
    addUserById(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: '添加好友',
        message: h('p', null, [
          h('span', null, '是否添加该用户为好友 '),
        ]),
        showCancelButton: true,
        showConfirmButton: id === 1 ? false : true,
        confirmButtonText: '添加',
        cancelButtonText: '返回',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            setTimeout(() => {
              done();
              addFriendShip(id)
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 2000);
          } else {
            done();
          }
        }
      })
    },
    async getUserInfoById(id){
      const res= await showUserById(id)
      const {userName,userAccount,userPhone,gender,profile,createTime,userRole,tagList}=res.data
      const h = this.$createElement;
      this.$msgbox({
        // title: '查看用户信息',
        message: h('div', { style: 'width:800px;height:350px' }, [
          h('h3', null, '用户基本信息： '),
          h('h5', null, `用户名：${userName}`),
          h('h5', null, `性别：${gender}`),
          h('h5', null, `手机号：${userPhone}`),
          h('h5', null, `邮箱号：${userAccount}`),
          h('h5', null, `介绍：${profile}`),
          h('h5', null, `角色：${userRole}`),
          h('h5', null, `创建时间：${createTime}`),
          // h('h5', null, `ta创建的队伍：${createTime}`),
          // h('h5', null, `ta加入的队伍：${createTime}`),
        ]),
        showCancelButton: true,
        showConfirmButton:   false,
        // confirmButtonText: '添加',
        cancelButtonText: '返回',
        beforeClose: (action, instance, done) => {
            done();
        }
      })
    }
  },

  mounted() {
    this.initUser()
  }
}
</script>

<style scoped lang="scss">

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  width: 120px;
  height: 38px;
  display: inline;
}

.image {
  width: 130px;
  height: 130px;
  display: block;
  margin-left: 26%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.main {
  width: 80vw !important;

  .card {
    width: 280px;
    margin-bottom: 20px;
    border-right-width: 5px;
    padding-right: 5px;
  }
}

.el-col-8 {
  width: 20%;
}
>>>.el-message-box{
  width: 600px;
  background-color: red;
}
::v-deep .el-message-box{
  width: 600px;
  background-color: red;
}
</style>
