<template>
  <div>
    <el-select v-model="selectedModels" multiple placeholder="曲线选择" style="width: 100%;">
      <el-option
        v-for="model in models"
        :key="model.value"
        :label="model.label"
        :value="model.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedModels: [], // 修改为数组，用于存储选中的模型
      models: [
        { value: 'model1', label: 'train loss' },
        { value: 'model2', label: 'eval dice' },
        { value: 'model3', label: 'eval iou' }
      ]
    };
  }
};
</script>
