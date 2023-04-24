<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180">
    </el-table-column>
    <el-table-column prop="name" label="姓名" width="180">
    </el-table-column>
    <el-table-column prop="address" label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
import { userListByPage } from '@/api/user';

export default {
  name: 'MyFriendList',
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
    ...mapState({ userId: state => state.user.userId })
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const userListPageDTO={
        "pagNum":1,
        "pageSize":1,
      }
      const res=await userListByPage(suserListPageDTO)
      console.log(res);
    }
  }
}
</script>

<style scoped></style>
