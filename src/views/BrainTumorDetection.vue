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
            <el-button type="primary" class="custom-button" @click="datadisplay">数据展示</el-button>  
            <!-- <el-button type="primary" class="custom-button" @click="openDirectory1">打开目录</el-button>
            <input type="file" ref="fileInput1" style="display: none;" @change="uploadImages1" multiple accept=".tif,.jpg,.png"> -->
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
      <el-col :span="8">
        <div style="text-align: center; margin-top: 10px;">原始图像</div>
        <iamge-displays :imageUrls="comparisonImageArray" style="margin-top: 20px;"/>
      </el-col>
      <el-col :span="8">
        <div style="text-align: center; margin-top: 10px;">mask图像</div>
        <iamge-displays :imageUrls="comparisonImageArray4" style="margin-top: 20px;"/>
      </el-col>
      <el-col :span="8">
        <div style="text-align: center; margin-top: 10px;">预测图像</div>
        <iamge-displays :imageUrls="comparisonImageArray5" style="margin-top: 20px;" />
      </el-col>
    </el-row>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplayWholeBrainTumorImage" style="margin-top:40px;">全脑空间肿瘤</el-button>
          </el-col>
        </el-row>
        <iamge-displays :imageUrls="comparisonImageArray2" style="margin-top: 20px;"/>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplay3DTumorImage" style="margin-top:40px;">三维肿瘤</el-button>
          </el-col>
        </el-row>
          <!-- <div>
            <vtk-view :modelUrl="'/path/to/your/model.vtk'"></vtk-view>
          </div> -->
          <iamge-displays :imageUrls="comparisonImageArray1" style="margin-top: 20px;"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import IamgeDisplays from '../components/IamgeDisplays.vue';
import axios from 'axios';
import PatientSelection from '../components/PatientSelection.vue';
// import VtkView from '@/components/VtkView.vue';
export default {
  components: {
    ModelSelection,
    ParameterSelection,
    IamgeDisplays,
    PatientSelection,
    // VtkView
  },
  data() {
    return {
      imageUrl1: [],
      imageUrl2: '',
      imageUrl3: '',
      imageUrl5: '',
      comparisonImageArray:[],
      comparisonImageArray1:[],
      comparisonImageArray2:[],
      comparisonImageArray3:[],
      comparisonImageArray4:[],
      comparisonImageArray5:[],
      // comparisonImageArray5:["https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","https://pic.quanjing.com/2x/8i/QJ9108260827.jpg@!350h","D:/Brain-MRI-segmentation/exercise3.jpg"],
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
    openDirectory1() {
      this.$refs.fileInput1.click();
    },
    // uploadImages1(event) {
    //   const files = event.target.files;
    //   if (files.length === 0) return;

    //   const formData = new FormData();
    //   for (let i = 0; i < files.length; i++) {
    //     formData.append('images[]', files[i]);
    //   }
    //   axios.post("/upload-images", formData)
    //     .then(response => {
    //       console.log("图片上传成功", response.data);
    //       if (response.data.code == "1") {
    //         this.comparisonImageArray = response.data.imageUrl;
    //       } else if (response.data.code == "-1") {
    //         console.log(response.data.message);
    //       } else {
    //         console.log("未处理的响应代码", response.data.code);
    //       }
    //     })
    //     .catch(error => {
    //       if (error.response) {
    //         // 根据错误响应状态码进行处理
    //         console.error("图片上传失败，服务器返回错误:", error.response.data);
    //         console.error("状态码:", error.response.status);
    //         console.error("响应头部:", error.response.headers);
    //       } else if (error.request) {
    //         // 处理没有收到响应的情况
    //         console.error("图片上传失败，没有收到响应:", error.request);
    //       } else {
    //         // 处理其他错误情况
    //         console.error("图片上传失败，发生其他错误:", error.message);
    //       }
    //       console.error("请求配置:", error.config);
    //     });
    // },
    datadisplay() {
      const patientSelection = this.patientSelection;
      const requestData = {
        patient: patientSelection
      };
      axios.post("/datadisplay", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray = response.data.result_image_urls1;
            this.comparisonImageArray4 = response.data.result_image_urls2;
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
    startTraining() {
      const modelSelection = this.$refs.modelSelection.selectedModel;
      const parameterSelection = this.$refs.parameterSelection.selectedModel;
      const requestData = {
        model: modelSelection,
        parameters: parameterSelection,
      };
      axios.post("/train", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray5 = response.data.result_image_urls;
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
    }
  }
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
</style>
