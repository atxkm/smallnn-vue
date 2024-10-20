<template>
  <div class="bg"></div>
  <div class="exit" @click="logout">退出登录</div>
  <div class="wrap" v-loading="loading">
    <div class="tool">
      <input ref="fileInput" type="file" @change="onUpload" />
      <el-button type="primary" @click="openUpload">上传</el-button>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="未扫描" name="unScanList">
        <Table :table-data="unScanList" @refresh="onRefresh" />
      </el-tab-pane>
      <el-tab-pane label="已扫描" name="scanList">
        <Table :table-data="scanList" @refresh="onRefresh" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import BMF from "browser-md5-file";
import router from "@/router";

import Table from "../components/table.vue";

const activeName = ref("unScanList");

const fileInput = ref();
const scanList = ref([]);
const unScanList = ref([]);
const loading = ref(false);
const bmf = new BMF();

function openUpload() {
  fileInput.value.click();
}

function onUpload(e) {
  const formData = new FormData();
  const file = e.currentTarget.files[0];
  formData.append("apkFile", file);

  loading.value = true;
  bmf.md5(
    file,
    (err, md5) => {
      formData.append("md5", md5);
      axios
        .post("/backend/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          loading.value = false;
          fileInput.value.value = "";
          let type = "error";
          if (data.status === 1) {
            type = "success";
            getList();
          }
          ElMessage({
            type: type,
            message: data?.msg || "上传失败",
            showClose: true,
          });
        });
    },
    (progress) => {
      console.log("progress number:", progress);
    }
  );
}

function getList() {
  axios.get("/backend/apklist").then(({ data }) => {
    if (Array.isArray(data?.scanList)) {
      scanList.value = data?.scanList;
      unScanList.value = data?.unScanList;

      scanList.value.map((row) => {
        row.progress = getProcess(row);
      });
    }
  });
}

getList();

function onRefresh() {
  getList();
}

function getProcess(row) {
  axios
    .get(`/backend/progress?package=${row.package}&flag=tk`)
    .then(({ data }) => {
      if (data?.process && data.progress > 0) {
        row.progress = data.process;
      }
    });
}

function logout() {
  sessionStorage.clear("login");
  router.push("login");
}
</script>
<style scoped lang="less">
.tool {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;

  input {
    display: none;
  }
}

.wrap {
  max-width: 1366px;
  min-height: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  background-color: #ffffff;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background: url(../assets/images/lg.jpg) no-repeat center center / cover;
}

.exit {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #ffffff;
  cursor: pointer;
}
</style>