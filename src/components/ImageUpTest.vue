<template>
  <div>
    <!-- 图片上传按钮 -->
    <input type="file" @change="handleFileUpload" style="display: none;" ref="fileInput" accept=".tif,.jpg,.png">
    <el-button type="primary" class="custom-button" @click="$refs.fileInput.click()">选择图片</el-button>

    <!-- 显示上传的图片或占位符 -->
    <div class="image-container" style="margin-top: 30px;">
      <img v-if="imageSrc" :src="imageSrc" alt="上传的图片" class="uploaded-image">
      <div v-else class="placeholder">
        等待图片上传
      </div>
    </div>
  </div>
</template>

<script>

import Tiff from 'tiff.js';
export default {
  data() {
    return {
      imageSrc: '' // 存储图片的Base64编码
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        // 使用tif.js来处理tif文件
        const tiff = new Tiff({ buffer: e.target.result });
        const canvas = tiff.toCanvas();
        if (canvas) {
          this.imageSrc = canvas.toDataURL('image/png');
          console.log('Image Base64:', this.imageSrc);
          this.$emit('image-uploaded', this.imageSrc); // 发射事件，通知父组件图片已上传
        } else {
          console.error('无法加载图片，请尝试其他图片或格式。');
          alert('无法加载图片，请尝试其他图片或格式。'); // 提示用户
        }
      };
      reader.onerror = (error) => {
        console.error('文件读取失败:', error);
        alert('文件读取失败，请重试。'); // 提示用户
      };
      reader.readAsArrayBuffer(file); // 读取为ArrayBuffer以供tif.js处理
    },
    getUploadedImage() {
      return this.imageSrc; // 返回上传的图片的Base64编码
    }
  }
};
</script>

<style>
.image-container {
  width: 300px; /* 设置图片容器的宽度 */
  height: 200px; /* 设置图片容器的高度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border: 1px dashed #ccc; /* 可选，为容器添加边框 */
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 完整显示图片，可能会有空白 */
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em; /* 根据需要调整字体大小 */
  color: #666; /* 根据需要调整字体颜色 */
  text-align: center;
}

.custom-button {
  background-color: #235f9a !important;
}
</style>
