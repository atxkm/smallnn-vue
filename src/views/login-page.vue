<template>
  <div class="wrap">
    <div class="title">登录</div>
    <el-form v-model="formModel">
      <el-form-item>
        <el-input v-model="formModel.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formModel.password"
          placeholder="请输入密码"
          type="password"
        />
      </el-form-item>
      <el-button type="primary" @click="onLogin">登录</el-button>
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
  width: 300px;
  margin: 0 auto;
  padding: 50px 100px 100px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
}
.title {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-weight: bold;
}
.el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>