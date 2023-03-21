<template>
  <div style="margin-top:150px">
    <p style="text-align:center;color:aquamarine;font-size:2em">注册</p>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户昵称" prop="username">
        <el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="account">
        <el-input type="account" v-model="ruleForm.account" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <router-link to="/login" style="margin-top:15px;margin-bottom: 15px;color:aqua">已有账号？去登录</router-link>
      <el-form-item style="margin-top:15px">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/user.js'

export default {
  name: 'Register',
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
      setTimeout(() => {
        if (value.length < 3) {
          callback(new Error('请输入正确的用户名,长度大于三位'))
        }
      }, 1000)
    }
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('账号不能为空'))
      }
      setTimeout(() => {
        if (Number.isInteger(value)) {
          callback(new Error('请输入电话号码'))
        } else {
          if (value.length != 11) {
            callback(new Error('请输入正确的电话号码'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        account: '',
        password: '',
        checkPass: ''
      },
      rules: {
        username: [{ validator: checkUsername, trigger: 'blur' }],
        account: [{ validator: checkAccount, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      register(this.ruleForm)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log('进入方法')
          const resp = await register(this.ruleForm)
          alert('注册成功!' + resp)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  top: -15px;
  margin-left: 35%;
}

.el-input {
  width: 35%;
}
</style>
