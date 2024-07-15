<template>
  <div>
    <!-- 多图片上传选框 -->
    <input type="file" @change="handleFilesUpload" multiple accept=".tif" style="display: none;" ref="fileInput">
    <div class="image-container" style="margin-top: 30px;">
      <!-- 循环展示上传的图片 -->
      <div v-for="(imageSrc, index) in imageSrcs" :key="index" class="uploaded-image-container">
        <img :src="imageSrc" alt="上传的图片" class="uploaded-image">
      </div>
    </div>
  </div>
</template>

<script>
import Tiff from 'tiff.js';

export default {
  data() {
    return {
      imageSrcs: [] // 存储多张图片的Base64编码
    };
  },
  methods: {
    handleFilesUpload(event) {
      const files = event.target.files;
      if (!files.length) {
        return;
      }
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const tiff = new Tiff({ buffer: e.target.result });
          const canvas = tiff.toCanvas();
          if (canvas) {
            const imageSrc = canvas.toDataURL('image/png');
            this.imageSrcs.push(imageSrc);
            this.$emit('images-uploaded', this.imageSrcs); // 发射事件，通知父组件图片已上传
          } else {
            console.error('无法加载图片，请尝试其他图片或格式。');
            alert('无法加载图片，请尝试其他图片或格式。');
          }
        };
        reader.onerror = (error) => {
          console.error('文件读取失败:', error);
          alert('文件读取失败，请重试。');
        };
        reader.readAsArrayBuffer(file);
      });
    }
  }
};
</script>

<style>
.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 图片之间的间隔 */
}

.uploaded-image-container {
  width: 600px; /* 设置图片容器的宽度 */
  height: 400px; /* 设置图片容器的高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc; /* 可选，为容器添加边框 */
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
