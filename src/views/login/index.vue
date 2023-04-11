<template>
  <div style="display: flex;height: 100%">
    <div class="friend-log">
      <div style="display: flex">
        <img src="@/assets/imgs/logo.png" alt="" width="40px" height="40px" />
        <div class="d1">
          找一个志同道合的朋友
        </div>
      </div>
      <div>
        <img src="@/assets/imgs/friends.svg" class="friend-style" />
        <div style="text-align:center;font-weight: bold;">
          欢迎来到找伙伴！
        </div>
        <div style="font-weight:normal;text-align:center;">
          希望你能在这里找到很多好伙伴
        </div>
      </div>
    </div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">
        <div class="title-container">
          <h3 class="title">登录账号</h3>
        </div>

        <el-form-item prop="userAccount">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="userAccount" v-model="loginForm.userAccount" placeholder="Username" name="username" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="userPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="userPassword" v-model="loginForm.userPassword" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div display:inline>
          <el-button :loading="loading" type="primary" style="width: 40%; margin-bottom: 30px"
            @click.native.prevent="handleLogin">登录账号</el-button>
          <el-button :loading="loading" type="primary" style="width: 40%; margin-bottom: 30px" @click="register">注册账号
          </el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { mapActions, mapState } from 'vuex'
import { md5 } from '@/utils/md5'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userAccount: '1962573324@qq.com',
        userPassword: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user', ['login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleLogin() {
      const resp = await this.login({
        username: this.loginForm.userAccount,
        password: md5(this.loginForm.userPassword)
      })
      this.$router.push({ path: '/dashboard' })
    },
    register() {
      this.$router.push('/register')
    }
  },
  computed: {
    ...mapState('user', ['token', 'name'])
  },
  mounted() { }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    height: 100%;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

.friend-style {
  widows: 600px;
  height: 600px;
  margin-right: 10px;
}

.friend-log {
  width: 50%;
  height: 100%;
  color: #283443;
}

.d1 {
  margin-top: 11px;
  margin-left: 15px;
  font-size: 1.5em;
  font-weight: bold;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
