<template>
  <div>
    <el-select v-model="selectedModel" placeholder="模型选择" style="width: 100%;">
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
        { value: 'model1', label: 'deeplabv3' },
        { value: 'model2', label: 'deeplabv3_plus' },
        { value: 'model3', label: 'unet' },
        { value: 'model4', label: 'unet_plus' },
        { value: 'model5', label: 'unet_raw' }
      ]
    };
  }
};
</script>
