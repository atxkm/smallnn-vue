<template>
  <div class="title">请选择设备</div>
  <el-table ref="tableRef" :data="devices" highlight-current-row>
    <el-table-column width="80">
      <template #default="scope">
        <el-radio :value="scope.row.num" name="radio" v-model="phone" />
      </template>
    </el-table-column>
    <el-table-column prop="num" label="序列号" />
    <el-table-column prop="state" label="状态" />
  </el-table>
  <div class="btn-wrap">
    <el-button @click="onCancel">取消</el-button>
    <el-button v-if="phone" type="primary" @click="onSubmit">确定</el-button>
    <el-button v-if="!phone" @click="phone = '1234'">模拟</el-button>
  </div>
</template>
<script setup>
import { ref, toRefs } from "vue";
import axios from "axios";

const emit = defineEmits(["update:modelValue", "choice"]);

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
});

const tableRef = ref();

const { row } = toRefs(props);

const devices = ref([]);

const phone = ref(null);

function onCancel() {
  emit("update:modelValue", false);
}

function onSubmit() {
  emit("choice", phone.value);
}

function getDevices() {
  axios.get("/backend/getdevices").then(({ data }) => {
    if (Array.isArray(data?.devices)) {
      devices.value = data?.devices;
    }
  });
}

getDevices();
</script>
<style scoped lang="less">
.title {
  margin-bottom: 20px;
  font-size: 16x;
  font-weight: bold;
}
.btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>