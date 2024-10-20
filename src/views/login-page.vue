<template>
  <div class="bg"></div>
  <div class="wrap">
    <div class="title">登录</div>
    <el-form v-model="formModel" label-position="top">
      <el-form-item label="用户名">
        <el-input v-model="formModel.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="formModel.password"
          placeholder="请输入密码"
          type="password"
        />
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="onLogin" size="large">
        登录
      </el-button>
    </el-form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

let formModel = ref({
  username: "",
  password: "",
});

function onLogin() {
  const { username, password } = formModel.value;
  if (username === "admin" && password === "123456") {
    sessionStorage.setItem("login", 1);
    router.push("list");
  } else {
    ElMessage({
      type: "error",
      message: "用户名或密码错误",
    });
  }
}
</script>
<style scoped lang="less">
.wrap {
  width: 260px;
  margin: 0 auto;
  padding: 50px 100px 100px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.title {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 28px;
  color: #2f2f2f;
}
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(../assets/images/lg.jpg) no-repeat center center / cover;
}

.el-input {
  width: 230px;
  height: 40px;
  margin-bottom: 5px;
}

:deep(.el-form-item__label) {
  font-size: 16px;
  font-weight: bold;
  color: #2f2f2f;
}

.login-btn {
  width: 150px;
  margin-top: 20px;
  border-radius: 5px;
}
</style>