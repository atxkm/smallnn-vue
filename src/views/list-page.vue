<template>
  <div class="bg"></div>
  <el-popconfirm title="退出将无法下载脱壳的APK，确认退出?" @confirm="logout" confirm-button-text="是"
  cancel-button-text="否" width="200">
    <template #reference>
      <div class="exit">退出登录</div>
    </template>
  </el-popconfirm>
  <div class="wrap" v-loading.fullscreen="loading">
    <div class="tool">
      <input ref="fileInput" type="file" @change="onUpload" />
      <el-button type="primary" @click="openUpload">上传</el-button>
    </div>
    <Table :table-data="scanList" @refresh="onRefresh" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import BMF from "browser-md5-file";
import router from "@/router";
import { getProcess } from "@/mixins/progress";

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
      // console.log("progress number:", progress);
    }
  );
}

function getList() {
  axios.get("/backend/apklist").then(({ data }) => {
    if (Array.isArray(data?.scanList)) {
      let list = data?.scanList || [];
      let uList = data?.unScanList || [];

      scanList.value = uList.concat(list);

      scanList.value.map((row) => {
        row.progress = getProcess(row);
      });

      // unScanList.value.map((row) => {
      //   row.progress = getProcess(row);
      // });
    }
  });
}

getList();

function onRefresh() {
  getList();
}

function logout() {
  router.push("login");
  sessionStorage.clear("login");
}

window.onbeforeunload = function () {
  return '退出将无法下载脱壳的APK，确认退出？';
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