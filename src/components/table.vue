<template>
  <el-table :data="tableData" :fit="true">
    <el-table-column label="app图标" width="80">
      <template #default="scope">
        <el-image
          class="icon"
          :src="`data:image/png;base64,${scope.row.icon}`"
        />
      </template>
    </el-table-column>
    <el-table-column prop="name" label="app名称" sortable />
    <el-table-column label="包名/版本号">
      <template #default="scope">
        <div>{{ scope.row.package }}</div>
        <div>{{ scope.row.version }}</div>
      </template>
    </el-table-column>
    <el-table-column label="是否脱壳" width="80">
      <template #default="scope">
        <el-tooltip :content="scope.row.isTK ? '是': '否'" placement="top">
          <el-icon>
            <Unlock v-if="isTk(scope.row)"  color="#67c23a" />
            <Lock v-else />
          </el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="脱壳进度">
      <template #default="scope">
        <el-progress :percentage="scope.row.progress" :stroke-width="20" text-inside :color="colors" />
      </template>
    </el-table-column>
    <el-table-column label="选择设备">
      <template #default="scope">
        <el-button v-if="!scope.row.phone" @click="openChoice(scope)" :disabled="scope.row.progress > 0">
          选择设备
        </el-button>
        <span v-else>{{ scope.row.phone }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="260">
      <template #default="scope">
        <el-button
          v-if="scope.row.phone && (!scope.row.progress || scope.row.progress <= 0)"
          type="primary"
          @click="startScan(scope)"
        >
          开始
        </el-button>
        <a
          v-if="isTk(scope.row)"
          class="el-button el-button--primary"
          :href="`http://127.0.0.1:8090/download?package=${scope.row.package}`"
          :download="scope.row.packge"
          target="_blank"
        >
          下载
        </a>
        <el-button v-if="!scope.row.isTK" @click="onCancel(scope)">取消</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogVisible" width="500">
    <DeviceDialog v-if="dialogVisible" v-model="dialogVisible" @choice="onChoice" />
  </el-dialog>
</template>
<script setup>
import { ref, defineProps, toRefs, defineEmits } from "vue";
import axios from "axios";
import { getProcess } from "@/mixins/progress";

import { ElMessage, ElMessageBox } from "element-plus";
import { Lock, Unlock } from "@element-plus/icons-vue";
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
  tk(scope);
  // const { row } = scope;
  // axios
  //   .get(`/backend/scan?package=${row.package}&phone=${row.phone}`)
  //   .then(({ data }) => {
  //     if (data?.status === 1) {
  //       ElMessage({
  //         type: "success",
  //         message: data.msg,
  //         showClose: true,
  //       });
  //     } else {
  //       ElMessage({
  //         type: "error",
  //         message: data.msg,
  //         showClose: true,
  //       });
  //     }
  //   });
}

function tk(scope) {
  const { row } = scope;
  axios
    .get(`/backend/tk?package=${row.package}&phone=${row.phone}`)
    .then(({ data }) => {
      if (data?.status === 1) {
        getProcess(row);
        ElMessage({
          type: "success",
          message: data.msg,
          showClose: true,
        });
      } else {
        ElMessage({
          type: "error",
          message: data.msg,
          showClose: true,
        });
      }
    });
}

const colors = [
  { color: '#f56c6c', percentage: 30 },
  { color: '#e6a23c', percentage: 70 },
  { color: '#67c23a', percentage: 100 },
];

function isTk(row) {
  return row.isTK && row.progress >= 100;
}
</script>
<style scoped lang="less">
.icon {
  width: 50px;
  height: 50px;
}

a.el-button {
  text-decoration: none;
}

.el-icon {
  font-size: 18px;
}
</style>