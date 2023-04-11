<template>
  <div style="height: 1000px">
    <div style="height: 600px">

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
          <div style="display: inline">
            <div style="width: 150px height:250px">
              <el-row>
                <el-col :span="8" v-for="(o, index) in this.list" :key="index" margin-right="12px">
                  <el-card :body-style="{ padding: '0px' }" style="
                                                          width: 280px;
                                                          border-right-width: 5px;
                                                          padding-right: 5px;
                                                          margin-bottom: 20px;
                                                        ">
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
                    <div style="padding: 14px;margin-left: 60px">
                      <span style="margin-bottom: 16px">{{ o.name }}</span>
                      <div style="display:inline-grid">
                        <span>{{ o.profile }}</span>
                        <el-button type="primary" class="button" @click="getUserInfoById(o.id)">查看用户信息</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
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
import { userListByPage } from '@/api/user'

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
      console.log(this.list)
    },
    getUserInfoById(id) {
      console.log('userId', id);
      this.showUserByIdEvent(id)
    }
  },
  mounted() {
    this.initUser()
  }
}
</script>

<style scoped>
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
  margin-left: 35px;
  margin-right: 35px;
}

.el-col-8 {
  width: 20%;
}
</style>
