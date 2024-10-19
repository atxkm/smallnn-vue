<template>
  <el-table ref="tableRef" border :data="data">
    <el-table-column type="selection" />
    <el-table-column prop="date" label="序列号" />
    <el-table-column prop="date" label="状态" />
  </el-table>
  <div class="btn-wrap">
    <el-button @click="onCancel">取消</el-button>
    <el-button type="primary" @click="onSubmit">确定</el-button>
  </div>
</template>
<script setup>
import { ref, toRefs } from "vue";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const tableRef = ref();

const { data } = toRefs(props);

function onCancel() {
  emits("update:modelValue", false);
}

function onSubmit() {
  const selection = tableRef.value.getSelectionRows();
  
}
</script>
<style scoped lang="less">
.btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>