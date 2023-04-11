<template>
  <div class="header">
    <div style="width: 250px">
      <i class="el-icon-user-solid" style="margin-top: 20px">找伙伴,找一个志同相合的伙伴</i>
    </div>
    <div class="left-content">
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="searchFriend"><i class="el-icon-reading"></i>找伙伴</el-menu-item>
        <el-menu-item index="searchTeam"><i class="el-icon-connection"></i>找队伍</el-menu-item>
        <el-menu-item index="chat"><i class="el-icon-chat-line-round"></i>聊天室</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>
    <div class="right-content">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <div class="avatar-wrapper">
            <img :src="userAvatar" class="user-avatar" />
            <i class="el-icon-caret-bottom" />
          </div>
        </span>
        <span>{{ userName }}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">我的信息</el-dropdown-item>
          <el-dropdown-item command="b">好友列表</el-dropdown-item>
          <el-dropdown-item command="c">后台管理</el-dropdown-item>
          <el-dropdown-item command="d">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      src: 'https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1678381200&t=b9bee766d097f28eafb211a1814573ba'
    }
  },
  methods: {
    ...mapActions('user', ['logout']),
    showList() {
      console.log('点击')
    },
    async handleCommand(command) {
      if (command === 'a') {
        this.$router.push({ path: '/myinfomation' })
        this.$message('click on item ' + command)
      }
      if (command === 'b') {
        this.$router.push({ path: '/myfriendlist' })
        this.$message('click on item ' + command)
      }
      if (command === 'c') {
        this.$router.push({ path: '/example' })
        this.$message('click on item ' + command)
      }
      if (command === 'd') {
        await this.logout()
        this.$router.replace('/login')
      }
    },
    handleSelect(key, keyPath) {
      console.log(key)
      this.$emit('sendName', key)
    }
  },
  computed: {
    ...mapState('user', ['userName', 'userAvatar'])
  }
}
</script>

<style scoped lang="scss">
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.header {
  display: flex;
  justify-content: space-between;

  .right-content {
    display: flex;
  }

  .left-content {
    display: flex;
  }

  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
}
</style>
