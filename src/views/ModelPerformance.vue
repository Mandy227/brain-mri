<template>
  <div>
    <h1>模型性能视图</h1>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplayPerformanceComparison">多模型性能对比</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col style="margin-top: 20px;">
            <div class="image-containers">
              <img v-if="displayPerformance" :src="displayPerformance" alt="Converted Image" />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="9">
            <model-selection ref="modelSelection"/>
          </el-col>
          <el-col :span="9">
            <parameter-selection ref="parameterSelection"/>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="custom-button" @click="modelstartTraining">开始训练</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" >
          <el-col style="margin-top: 20px;">
            <div class="image-containerh">
              <img v-if="currentModelTrainImage" :src="currentModelTrainImage" alt="Converted Image" />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <h2>不同方法对比</h2>
    <el-row :gutter="20">
        <image-up-test @image-uploaded="handleImageUploaded"></image-up-test>
    </el-row>
    <echarts-dis-play />
  </div>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import axios from 'axios';
import ImageUpTest from '@/components/ImageUpTest.vue';

export default {
  components: {
    ModelSelection,
    ParameterSelection,
    ImageUpTest,
  },
  data() {
    return {
      modelsId:'',
      model:'',
      comparisonImage1: '',
      comparisonImage2: '',
      comparisonImage3: '',
      comparisonImageArray:[],
      comparisonImageArray1:[],
      uploadedImage: '',
      displayPerformance: '',
      modeltrainFiles:[],
      currentModelTrainImage: '',
    };
  },
  methods: {
    openDirectory() {
      this.$refs.fileInput.click();
    },
    handleImageUploaded(imageSrc) {
      this.uploadedImage = imageSrc; // 存储上传的图片数据
    },
    fetchAndDisplayPerformanceComparison() {
      const localImagePath = 'Figure_1.png';
      this.displayPerformance = localImagePath;
    },
    modelstartTraining() {
      // 检查模型和参数选择组件是否存在
      if (!this.$refs.modelSelection || !this.$refs.parameterSelection) {
        console.error('ModelSelection or ParameterSelection component is not defined.');
        return;
      }
      const modelSelection = this.$refs.modelSelection.selectedModel;
      const parameterSelection = this.$refs.parameterSelection.selectedModel;
      if (!modelSelection || !parameterSelection) {
        console.error('Model or parameter has not been selected.');
        return;
      }
      // 根据模型和参数选择创建图片路径
      // 假设图片存储在public/images目录下，文件名为模型名-参数名.png
      const imagePath = `/images/${modelSelection}_${parameterSelection}.png`;
      this.currentModelTrainImage = imagePath;
    },
    fetchAndDisplayComparisonImages() {
      const url = '/train';
      console.log("url", url);
      axios.post(url)
        .then(response => {
          // 处理响应数据
          console.log("这是imageFiles", response.data.pred_image);
          // 修改
          this.preimageFiles = response.data.pred_image;
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

  },
  computed: {
    displayModelTrain() {
      return this.modeltrainFiles.map(file => this.getPngUrl(this.model, file));
    },
    displayPreImages() {
      return this.preimageFiles.map(file => this.getPngUrl(this.patientId, file));
    },
  },
};
</script>

<style scoped>
h1, h2 {
  font-size: 22px;
  margin-bottom: 30px;
}
h2 {
  margin-top: 60px;
}
.custom-button {
  background-color: #235f9a;
}
.image-container {
  width: 300px;
  max-height: 500px;
  overflow-y: auto;
  text-align: center;
}
.image-container img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.image-containers {
  width: 530px;
  margin-left: -20px;
}
.image-containers img {
  width: 100%;
  height: auto;
}
.image-containerh {
  width: 600px;
  margin-left: -40px;
}
.image-containerh img {
  width: 100%;
  height: auto;
}
</style>