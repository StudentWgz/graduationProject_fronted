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
          <div style="display: inline">
            <div style="width: 150px height:150px">
              <el-row>
                <el-col :span="8" v-for="(o, index) in this.list" :key="index" margin-right="12px">
                  <el-card :body-style="{ padding: '0px' }" style="
                      width: 450px;
                      border-right-width: 5px;
                      padding-right: 5px;
                      margin-bottom: 20px;
                    ">
                    <div style="display: flex; margin-left: 5px; margin-right: 5px">
                      <img :src="o.avatarurl" class="image" alt="我坤哥" />
                      <div>
                        <div style="margin-bottom: 2px">
                          <el-tag type="warning"> {{ o.description }} </el-tag>
                        </div>
                        <el-tag type="warning">
                          队伍最大人数:{{ o.maxnum }}
                        </el-tag>
                      </div>
                    </div>
                    <div style="padding: 14px">
                      <span>{{ o.name }}</span>
                      <div class="bottom clearfix">
                        <span>过期时间:{{ o.expiretime }}</span>
                        <el-button type="text" class="button">查看队伍</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="block" height="1000px">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-sizes="[6, 9, 15, 21]" :page-size="6"
              layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getTeamList } from '@/api/team'
export default {
  name: 'SearchFriend',
  data() {
    return {
      name: 'SearchFriend',
      type: 1,
      currentDate: new Date(),
      pageSize: 5,
      total: 1,
      currentPage: 1,
      list: []
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
      const resp = await getTeamList({
        pageNum: this.currentPage,
        pageSize: val
      })
      this.pageSize = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async handleCurrentChange(val) {
      const resp = await getTeamList({
        pageNum: val,
        pageSize: this.pageSize
      })
      this.pageNum = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async initTeam() {
      const resp = await getTeamList({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      this.total = resp.data.total
      this.list = resp.data.list
      console.log(this.list)
    }
  },
  mounted() {
    this.initTeam()
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
}

.image {
  width: 50px;
  height: 50px;
  display: block;
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
</style>
