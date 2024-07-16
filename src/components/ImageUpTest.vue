<template>
  <div>
    <el-row gutter="10" style="margin-top: 20px;">
      <el-col :span="4">
        <input type="file" @change="handleFileUpload" style="display: none;" ref="fileInput" accept=".tif,.jpg,.png">
        <el-button type="primary" class="custom-button" @click="$refs.fileInput.click()">选择图片</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" class="custom-button" @click="sendImageNameToBackend">对比展示</el-button>
      </el-col>
    </el-row>
    <div v-if="patientId" class="image-name patient-id-font" style="margin-top: 30px;">
      选择的图片：{{ patientId }}
    </div>
    <!-- 显示上传的图片或占位符 -->
    <el-row gutter="20" style="margin-top: 30px;">
      <el-col :span="8">
        <div class="image-container">
          <img v-if="imageSrc" :src="imageSrc" alt="上传的图片" class="uploaded-image">
          <div v-else class="placeholder">
            等待图片上传
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="image-containers">
          <div v-if="sortedPreimageFiles.length === 0" class="placeholder-container">
            预测图像
          </div>
          <div v-for="(image, index) in sortedPreimageFiles" :key="index">
            <img :src="'/compareimg/' + patientId + '/'+image" alt="Image">
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Tiff from 'tiff.js';
import axios from 'axios';

export default {
  data() {
    return {
      patientId:"",
      imageSrc: '', // 存储图片的Base64编码
      imageName: '', // 存储图片的名称
      sortedPreimageFiles:[],
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      // let originalImageName = file.name;
      // this.imageName = originalImageName.replace(/\.tif$/, '');
      this.imageName = file.name;
      this.patientId=file.name.replace(/\.tif$/, '');
      const reader = new FileReader();
      reader.onload = (e) => {
        // 使用tif.js来处理tif文件
        const tiff = new Tiff({ buffer: e.target.result });
        const canvas = tiff.toCanvas();
        if (canvas) {
          this.imageSrc = canvas.toDataURL('image/png');
          console.log('Image Base64:', this.imageSrc);
          this.$emit('image-uploaded', { base64: this.imageSrc, name: this.imageName });
        } else {
          console.error('无法加载图片，请尝试其他图片或格式。');
          alert('无法加载图片，请尝试其他图片或格式。'); 
        }
      };
      reader.onerror = (error) => {
        console.error('文件读取失败:', error);
        alert('文件读取失败，请重试。'); // 提示用户
      };
      reader.readAsArrayBuffer(file); 
    },
    sendImageNameToBackend() {
      const backendUrl = '/comparison-images'; 
      const imageNameData = { imageName: this.imageName };
      axios.post(backendUrl,imageNameData)
        .then(response => {
          // 处理响应数据
          console.log("这是imageFiles", response.data.pred_list);
          this.sortedPreimageFiles = response.data.pred_list;
        })
        .catch(err => {
          // 处理错误情况
          console.error(err);
          this.error = err.message;
        })
        .finally(() => {
          this.loading = false;
        });

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

.image-containers {
  width: 700px;
  max-height: 500px;
  overflow-y: auto;
  text-align: center;
}
.image-containers img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.placeholder-container {
  width: 680px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  color: #666;
  text-align: center;
}
.patient-id-font {
  font-size: 14px; 
  color: #1f1d1d;
  margin-left: 20px;
}
</style>
