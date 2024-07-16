<template>
  <div class="image-gallery" ref="imageGallery">
    <div v-if="imageFiles.length === 0 && maskFiles.length === 0" class="empty-gallery">
      等待上传
    </div>
    <img v-for="(imageUrl, index) in displayImages" :key="index" :src="imageUrl" alt="Image" />
    <img v-for="(maskUrl, index) in displayMasks" :key="`mask-${index}`" :src="maskUrl" alt="Mask" />
  </div>
  <el-button type="primary" class="custom-button" @click="fetchData">数据展示</el-button>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loading: false,
      error: null,
      patientId: null,
      imageFiles: [],
      maskFiles: []
    };
  },
  computed: {
    displayImages() {
      return this.imageFiles.map(file => this.getPngUrl(this.patientId, file));
    },
    displayMasks() {
      return this.maskFiles.map(file => this.getPngUrl(this.patientId, file));
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.error = null;
      this.patientId = this.$refs.patientSelection.selectedModel;
      const patientSelection = this.$refs.patientSelection.selectedModel;
      const url = `/datadisplay?patient=${encodeURIComponent(patientSelection)}`;
      console.log("url", url);
      axios.get(url)
        .then(response => {
          // 处理响应数据
          console.log("这是imageFiles", response.data.images);
          // 假设后端返回的数据格式是 { data: 'some data' }
          // 这里根据实际返回的数据格式来更新状态
          this.imageFiles = response.data.images;
          this.maskFiles = response.data.mask_images;
        })
        .catch(err => {
          // 处理错误情况
          console.error(err);
          this.error = err.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getPngUrl(patientId, image) {
      // 构造转换 URL
      return `/convert-tiff-to-png/${patientId}/${image}`;
    },
  }
};
</script>

<style>
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 图片之间的间隔 */
  max-height: 500px; /* 设置固定高度 */
  overflow-y: auto; /* 如果内容超出，添加竖直滚动条 */
}

.image-gallery img {
  max-width: 100%; /* 确保图片不会超出容器宽度 */
  height: auto; /* 保持图片的宽高比 */
  border: 1px solid #ccc; /* 可选：为图片添加边框 */
}

.empty-gallery {
  width: 100%;
  text-align: center;
  padding: 20px; /* 添加一些内边距 */
}
</style>
