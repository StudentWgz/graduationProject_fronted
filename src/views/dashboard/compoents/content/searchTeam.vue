<template>
    <div >
      <el-container>
        <el-aside style="width: 160px">
          <!-- 左边导航栏 -->
          <el-row class="tac" style="height: 200px">
            <el-col :span="17">
              <h5 style="margin-left: 51px">可否加入</h5>
              <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                @select="handleSelect">
                <el-menu-item index="0">
                  <i class="el-icon-menu"></i>
                  <span slot="title">公开</span>
                </el-menu-item>
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">私有</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-sunny"></i>
                  <span slot="title">加密</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main class="main">
          <el-input placeholder="搜索你感兴趣的队伍吧！" v-model="input" clearable style="width:25%;margin-bottom:2%">
          </el-input>
          <el-button style="margin-left: 20px" @click="initTeam" type="primary">主要按钮</el-button>
          <div v-for="(o, index) in this.list" :key="index" style="margin-bottom:15px">
            <el-card >
              <div class="card-header">
                <div style="line-height: 30px;">{{ o.name }}</div>
                <div style="display:flex;">
                  <div v-for="(url, index) in o.joinUrlList" :key="index">
                    <el-avatar :src="url"></el-avatar>
                  </div>
                </div>
                <div>
                  <el-tag type="warning" style="margin-top: 6px;position:absolute;right:120px">
                    队伍人数:{{ o.nowNum }}/{{ o.maxNum }}
                  </el-tag>
                </div>
              </div>
              <div class="card-content">
                <img :src="o.avatarUrl" class="image" alt="我坤哥" />
                <div style="margin-left: 10px;">
                  <div style="margin-bottom: 2px">
                    <el-tag type="success"> {{ o.description }} </el-tag>
                  </div>
                  <div style="display:inline-block;">
                    <div style="float:left">
                      <el-table height="40" style="width: 100%;">
                        <el-table-column prop="" label="队长" width="180" style="color: red;">
                        </el-table-column>
                        <el-table-column prop="" label="创建时间" width="180">
                        </el-table-column>
                        <el-table-column prop="" label="截止时间" width="180">
                        </el-table-column>
                      </el-table>
                      <el-table height="50" style="width: 100%">
                        <el-table-column prop="o.createname" :label="o.createName" width="180">
                        </el-table-column>
                        <el-table-column prop="" :label="o.createTime" width="180">
                        </el-table-column>
                        <el-table-column prop="" :label="o.expireTime" width="180">
                        </el-table-column>
                      </el-table>
                    </div>
                    <div style="padding: 20px;">
                      <div class=" ">
                        <el-button type="primary" class="button">查看队伍</el-button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </el-card>
          </div>
          <div class="block"
            height="100px
          zzzzzz                                                                                                                                                                                                                                                                                                                                                                                                                                              ">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-sizes="[6, 9, 15, 21]" :page-size="6"
              layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
    </div>
</template>

<script>
import { getTeamListByPage } from '@/api/team'
export default {
  name: 'SearchTeam',
  data() {
    return {
      name: 'SearchTeam',
      type: 1,
      currentDate: new Date(),
      pageSize: 5,
      total: 1,
      currentPage: 1,
      isPrivate: 0,
      list: [],
      input: ''
    }
  },
  methods: {
    async handleOpen(key, keyPath) {
      console.log(key, keyPath)
      this.isPrivate = key
      this.initTeam(key)
    },
    async handleClose(key, keyPath) {
      console.log(key, keyPath)
      this.isPrivate = key
      this.initTeam(key)
    },
    async handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.isPrivate = key
      this.initTeam(key)
    },
    async handleSizeChange(val) {
      const resp = await getTeamListByPage({
        pageNum: this.currentPage,
        pageSize: val,
        inputContent: input
      })
      this.pageSize = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async handleCurrentChange(val) {
      const resp = await getTeamListByPage({
        pageNum: val,
        pageSize: this.pageSize,
        inputContent: input
      })
      this.pageNum = val
      this.total = resp.data.total
      this.list = resp.data.list
    },
    async initTeam(isPrivate) {
      const resp = await getTeamListByPage({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        isPrivate: this.isPrivate,
        inputContent: this.input
      })
      this.total = resp.data.total
      this.list = resp.data.list
      console.log(this.list)
    }
  },
  mounted() {
    this.initTeam(0)
  }
}
</script>

<style scoped lang="scss">
.main {
  margin-left: 35px;
  margin-right: 35px;
  .card-header {
    display: flex;
    border-bottom: 1px solid rgb(216, 216, 216);
    align-items: start;
    padding-bottom: 10px;
    justify-content: space-between;
  }
  .card-content {
    padding-top: 20px;
    display: flex;
  }
}
.el-col-8 {
  width: 1500px;
}
.el-divider--horizontal {
  margin-top: 0px;
  margin-bottom: 0px;
}
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
  position: absolute;
  right: 120px
}
.image {
  margin-left: 5px;
  margin-top: 5px;
  margin-right: 5px;
  width: 120px;
  height: 120px;
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
</style>
