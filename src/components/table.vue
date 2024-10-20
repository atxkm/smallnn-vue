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
      <el-button @click="openChoice">选择设备</el-button>
    </el-table-column>
    <el-table-column label="操作" width="260">
      <template #default="scope">
        <el-button type="primary">开始</el-button>
        <el-button @click="onDownload(scope)">下载</el-button>
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

function openChoice() {
  dialogVisible.value = true;
}

function onChoice() {}

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
</script>
<style scoped lang="less">
.icon {
  width: 50px;
  height: 50px;
}
</style>