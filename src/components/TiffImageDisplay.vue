<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <patient-selection />
    </el-col>
    <el-col :span="12">
      <el-button type="primary" class="custom-button" @click="datadisplay">数据展示</el-button>
    </el-col>
  </el-row>
  <div class="image-display">
    <div v-if="base64Images && base64Images.length > 0" class="image-gallery">
      <div v-for="(base64Image, index) in base64Images" :key="index" class="gallery-image-container">
        <el-row>
          <el-col :span="24">
            <img :src="base64Image" alt="Uploaded Image" class="gallery-image" />
          </el-col>
          <el-col :span="24">
            <div class="image-name">{{ imageNames[index] }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>等待图片上传</div>
  </div>
</template>




<script>
import Tiff from 'tiff.js';
import PatientSelection from './PatientSelection.vue';

export default {
  components: {
    PatientSelection,
  },
  data() {
    return {
      base64Images: [],
      imagePaths: [  
        // ...可以添加更多图片路径
      ]
    };
  },
  computed: {
    imageNames() {
      return this.imagePaths.map(path => {
        const fileName = path.split('/').pop(); // 提取文件名
        return fileName;
      });
    }
  },
  mounted() {
    this.loadImages();
  },
  methods: {
    async loadImages() {
      for (const imagePath of this.imagePaths) {
        try {
          const response = await fetch(imagePath);
          if (!response.ok) throw new Error('Network response was not ok.');
          const arrayBuffer = await response.arrayBuffer();
          const tiff = new Tiff({ buffer: arrayBuffer });
          const canvas = tiff.toCanvas();
          if (canvas) {
            this.base64Images.push(canvas.toDataURL('image/png'));
          } else {
            console.error('无法加载图片，请尝试其他图片或格式。');
          }
        } catch (error) {
          console.error('加载图片出错:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.image-display {
  width: 50%;
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #f5f5f5;
  overflow: hidden; /* 隐藏滚动条 */
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
}

.gallery-image-container {
  flex: 0 0 25%; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* 添加顶部边距以避免重叠 */
}

.gallery-image {
  max-width: 90%; 
  max-height: 200px;
  margin: 5px; 
  display: block;
}

.image-name {
  /* 添加样式以确保图片名称正确显示在图片下方 */
  margin-top: 10px; /* 添加底部边距以避免重叠 */
  font-size: 6px;
  margin-left: 10px;
}
</style>

