<template>
  <div>
    <h1>数据展示</h1>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="11">
        <el-row :gutter="20">
          <el-col :span="14">
            <patient-selection ref="patientSelection"/>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="fetchData">数据展示</el-button>  
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="13">
        <el-row :gutter="20">
          <el-col :span="8">
            <model-selection ref="modelSelection"/>
          </el-col>
          <el-col :span="7">
            <parameter-selection ref="parameterSelection"/>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="startTraining">开始训练</el-button>    
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8" style="margin-top: 20px;">
        <div class="image-container">
          <div v-if="displayImages.length === 0">
            原始图像
          </div>
          <div v-for="(pngUrl, index) in displayImages" :key="`image-${index}`">
            <img :src="pngUrl" alt="Converted Image" />
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="margin-top: 20px;">
        <div class="image-container">
          <div v-if="displayMasks.length === 0">
            mask图像
          </div>
          <div v-for="(pngUrl, index) in displayMasks" :key="`mask-${index}`">
            <img :src="pngUrl" alt="Converted Mask" />
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="margin-top: 20px;">
        <div class="image-container">
          <div v-if="sortedPreimageFiles.length === 0">
            预测图像
          </div>
          <div v-for="(image, index) in sortedPreimageFiles" :key="index">
             <img :src="'/predimage/' + model + '/' + parameters + '/'+ patientId + '/' + image" alt="Image">
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplay3DTumorImage" style="margin-top:40px;">三维肿瘤</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="70" style="margin-top: 20px;">
      <stl-viewer ref="stlViewer" />
    </el-row>
    
  </div>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import axios from 'axios';
import PatientSelection from '../components/PatientSelection.vue';
import StlViewer from '../components/StlViewer.vue';

export default {
  components: {
    ModelSelection,
    ParameterSelection,
    PatientSelection,
    StlViewer,
  },
  data() {
    return {
      patientId: '',
      model:'',
      parameters:'',
      comparisonImageArray2:[],
      imageFiles: [],
      maskFiles: [],
      preimageFiles:[],
    };
  },
  mounted() {
    if (this.$refs.fileInput1 && this.$refs.fileInput2 && this.$refs.fileInput3) {
      console.log('All file input refs are available.');
    } else {
      console.error('One or more file input refs are not available.');
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
    startTraining() {
      this.loading = true;
      this.error = null;
      this.patientId = this.$refs.patientSelection.selectedModel;
      this.model=this.$refs.modelSelection.selectedModel;
      this.parameters = this.$refs.parameterSelection.selectedModel;
      const patientSelection = this.$refs.patientSelection.selectedModel;
      const modelSelection = this.$refs.modelSelection.selectedModel;
      const parameterSelection = this.$refs.parameterSelection.selectedModel;
      const url = '/train';
      const requestData={
        patient: patientSelection,
        model: modelSelection,
        parameters: parameterSelection
      }
      console.log("url", url);
      axios.post(url,requestData)
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
    fetchAndDisplay3DTumorImage() {
      axios.post("/3d-tumor-image", {})
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray1 = response.data.result_image_url;
          } else if (response.data.code == "-1") {
            console.log(response.data.message);
          } else {
            console.log("unhandled code, ", response.data.code);
          }
        })
        .catch(error => {
          if (error.response) {
            // 根据错误响应状态码进行处理
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // 处理没有收到响应的情况
            console.log(error.request);
          } else {
            // 处理其他错误情况
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
    },
    fetchAndDisplayWholeBrainTumorImage() {
      axios.post("/whole-brain-tumor-image", {})
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray2 = response.data.result_image_urls;
          } else if (response.data.code == "-1") {
            console.log(response.data.message);
          } else {
            console.log("unhandled code, ", response.data.code);
          }
        })
        .catch(error => {
          if (error.response) {
            // 根据错误响应状态码进行处理
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // 处理没有收到响应的情况
            console.log(error.request);
          } else {
            // 处理其他错误情况
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
    },
  },
  computed: {
    // displayImages() {
    //   let images = this.imageFiles.map(file => this.getPngUrl(this.patientId, file));
    //   return images.sort((a, b) => a.localeCompare(b));
    // },
    // displayMasks() {
    //   let images = this.maskFiles.map(file => this.getPngUrl(this.patientId, file));
    //   return images.sort((a, b) => a.localeCompare(b));
    // },
    displayImages() {
      let images = this.imageFiles.map(file => this.getPngUrl(this.patientId, file));
      return images.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0], 10);
        const numB = parseInt(b.match(/\d+/)[0], 10);
        return numA - numB;
      });
    },
    displayMasks() {
      let images = this.maskFiles.map(file => this.getPngUrl(this.patientId, file));
      return images.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0], 10);
        const numB = parseInt(b.match(/\d+/)[0], 10);
        return numA - numB;
      });
    },
    sortedPreimageFiles() {
      return [...this.preimageFiles].sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)[0], 10);
        const numB = parseInt(b.match(/\d+/)[0], 10);
        return numA - numB;
      });
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 22px;
  margin-bottom: 30px;
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
  margin-bottom: 10px;
}
</style>
