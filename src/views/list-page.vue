<template>
  <div class="wrap" v-loading="loading">
    <div class="tool">
      <input ref="fileInput" type="file" @change="onUpload" />
      <el-button type="primary" @click="openUpload">上传</el-button>
    </div>
    <el-table :data="taskList">
      <el-table-column prop="name" label="app名称" />
      <el-table-column prop="version" label="版本号" />
      <el-table-column prop="package_name" label="包名" />
      <el-table-column label="脱壳进度" width="200">
        <template #default="scope">
          <el-progress :percentage="scope.row.process" />
        </template>
      </el-table-column>
      <el-table-column label="选择设备" width="150">
        <el-button @click="openChoice">选择设备</el-button>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button type="primary">开始</el-button>
          <el-button @click="onDownload">下载</el-button>
          <el-button @click="onCancel(scope)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogVisible">
    <DeviceDialog
      v-model="dialogVisible"
      :data="deviceData"
      @choice="onChoice"
    />
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import DeviceDialog from "../components/device-dialog.vue";
// import CryptoJS from "crypto-js";
import BMF from "browser-md5-file";
import router from "@/router";

if (!sessionStorage.getItem("login")) {
  router.push("login");
}

const fileInput = ref();
const dialogVisible = ref(false);
const taskList = ref([]);
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
      taskList.value = data;
    }
  });
}

getList();

function openChoice() {
  dialogVisible.value = true;
}

function onChoice(data) {}

function onDownload() {
  ElNotification({ message: "下载开始..." });
}

function onCancel(scope) {
  ElMessageBox.confirm("确认取消吗?", "确认", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    const { row } = scope;
    cancelTask(row);
  });
}

function cancelTask(row) {
  axios.get("/backend/clear", { package: row.package }).then(({ data }) => {
    if (data?.status === 1) {
      getList();
      ElMessage({
        type: "info",
        message: data.msg,
        showClose: true,
      });
    }
  });
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
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #dcdfe6;
}
</style>