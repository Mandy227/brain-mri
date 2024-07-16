<template>
  <div>
    <el-select v-model="selectedModel" placeholder="参数选择" style="width: 100%;">
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
      selectedModel: '',
      models: [
        { value: 'resnet50', label: 'resnet50' },
        { value: 'efficientnet-b2', label: 'efficientnet-b2' }
      ]
    };
  }
};
</script>
