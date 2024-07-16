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
        { value: 'deeplabv3', label: 'deeplabv3' },
        { value: 'deeplabv3_plus', label: 'deeplabv3_plus' },
        { value: 'unet_new', label: 'unet_new' },
        { value: 'unet_plus', label: 'unet_plus' },
      ]
    };
  }
};
</script>
