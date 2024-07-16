<template>
  <div>
    <el-select v-model="selectedModels" multiple placeholder="模型选择" style="width: 100%;">
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
      // 将 selectedModel 改为数组类型
      selectedModels: [],
      models: [
        { value: 'deeplabv3', label: 'deeplabv3' },
        { value: 'deeplabv3_plus', label: 'deeplabv3_plus' },
        { value: 'model3', label: 'unet' },
        { value: 'model4', label: 'unet_plus' },
        { value: 'model5', label: 'unet_raw' }
      ]
    };
  }
};
</script>
