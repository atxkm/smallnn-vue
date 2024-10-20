<template>
  <el-table ref="tableRef" :data="devices" highlight-current-row>
    <el-table-column width="80">
      <el-radio :value="num" name="radio" v-model="radio" />
    </el-table-column>
    <el-table-column prop="num" label="序列号" />
    <el-table-column prop="state" label="状态" />
  </el-table>
  <div class="btn-wrap">
    <el-button @click="onCancel">取消</el-button>
    <el-button type="primary" @click="onSubmit">确定</el-button>
  </div>
</template>
<script setup>
import { ref, toRefs } from "vue";
import axios from "axios";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  row: {
    type: Object,
    default: () => ({}),
  },
});

const tableRef = ref();

const { row } = toRefs(props);

const devices = ref([]);

const radio = ref(null);

function onCancel() {
  emits("update:modelValue", false);
}

function onSubmit() {}

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
.btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>