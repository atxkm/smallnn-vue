<template>
  <el-table :data="tableData" fit="true">
    <el-table-column label="app图标">
      <template #default="scope">
        <el-image
          class="icon"
          :src="`data:image/png;base64,${scope.row.icon}`"
        />
      </template>
    </el-table-column>
    <el-table-column prop="name" label="app名称" />
    <el-table-column label="包名/版本号">
      <template #default="scope">
        <div>{{ scope.row.package }}</div>
        <div>{{ scope.row.version }}</div>
      </template>
    </el-table-column>
    <el-table-column label="脱壳进度">
      <template #default="scope">
        <el-progress :percentage="scope.row.process" />
      </template>
    </el-table-column>
    <el-table-column label="选择设备">
      <template #default="scope">
        <el-button v-if="!scope.row.phone" @click="openChoice(scope)">
          选择设备
        </el-button>
        <span v-else>{{ scope.row.phone }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="260">
      <template #default="scope">
        <el-button
          v-if="scope.row.phone"
          type="primary"
          @click="startScan(scope)"
        >
          开始
        </el-button>
        <a
          v-if="scope.row.process >= 100"
          class="el-button"
          :href="`http://127。0.0.1:8090/download?package=${scope.row.package}`"
          target="_blank"
        >
          下载
        </a>
        <el-button @click="onCancel(scope)">取消</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" width="500">
    <DeviceDialog v-model="dialogVisible" @choice="onChoice" />
  </el-dialog>
</template>
<script setup>
import { ref, defineProps, toRefs, defineEmits } from "vue";
import axios from "axios";

import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import DeviceDialog from "../components/device-dialog.vue";

const emit = defineEmits(["refresh"]);

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
});

const { tableData } = toRefs(props);

const dialogVisible = ref(false);

const curRow = ref();

function openChoice(scope) {
  dialogVisible.value = true;
  curRow.value = scope.row;
}

function onChoice(phone) {
  dialogVisible.value = false;
  curRow.value.phone = phone;
}

function onDownload(scope) {
  const { row } = scope;
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
  axios.get(`/backend/clear?package=${row.package}`).then(({ data }) => {
    if (data?.status === 1) {
      emit("refresh");
      ElMessage({
        type: "success",
        message: data.msg,
        showClose: true,
      });
    }
  });
}

function startScan(scope) {
  const { row } = scope;
  axios
    .get(`/backend/scan?package=${row.package}&phone=${row.phone}`)
    .then(({ data }) => {
      if (data?.status === 1) {
        tk(scope);
      } else {
        ElMessage({
          type: "error",
          message: data.msg,
          showClose: true,
        });
      }
    });
}

function tk(scope) {
  const { row } = scope;
  axios
    .get(`/backend/tk?package=${row.package}&phone=${row.phone}`)
    .then(({ data }) => {
      if (data?.status === 1) {
      }
    });
}
</script>
<style scoped lang="less">
.icon {
  width: 50px;
  height: 50px;
}
</style>