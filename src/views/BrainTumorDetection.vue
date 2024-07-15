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
        <image-displays :base64Images="comparisonImageArray" style="margin-top: 20px;"/>
      </el-col>
      <el-col :span="8">
        <div style="text-align: center; margin-top: 10px;">mask图像</div>
        <image-displays :base64Images="comparisonImageArray4" style="margin-top: 20px;"/>
      </el-col>
      <el-col :span="8">
        <div style="text-align: center; margin-top: 10px;">预测图像</div>
        <image-displays :base64Images="comparisonImageArray5" style="margin-top: 20px;" />
      </el-col>
    </el-row>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplayWholeBrainTumorImage" style="margin-top:40px;">全脑空间肿瘤</el-button>
          </el-col>
        </el-row>
        <image-displays :base64Images="comparisonImageArray2" style="margin-top: 20px;"/>
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
          <image-displays :base64Images="comparisonImageArray1" style="margin-top: 20px;"/>
      </el-col>
    </el-row>
    <el-row >
      <TiffImageDisplay style="margin-top: 20px;"/>
    </el-row>
  </div>
  <image-displays :base64Images="base64ImagesArray" />
  <test-try @images-fetched="handleImagesFetched"></test-try>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import ImageDisplays from '../components/ImageDisplays.vue';
import axios from 'axios';
import PatientSelection from '../components/PatientSelection.vue';
// import ImageDisplay from '@/components/ImageDisplay.vue';
// import VtkView from '@/components/VtkView.vue';
import TestTry from '@/components/TestTry.vue';
import TiffImageDisplay from '../components/TiffImageDisplay.vue';

export default {
  components: {
    ModelSelection,
    ParameterSelection,
    ImageDisplays,
    PatientSelection,
    TestTry,
    TiffImageDisplay
    // ImageDisplay,
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
      base64ImagesArray: [
        'data:image/tiff;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        'data:image/tiff;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        'data:image/tiff;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        'data:image/tiff;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        'data:image/tiff;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        "data:image/png;base64,R0lGODlhHAAmAKIHAKqqqsvLy0hISObm5vf394uLiwAAAP///yH5B…EoqQqJKAIBaQOVKHAXr3t7txgBjboSvB8EpLoFZywOAo3LFE5lYs/QW9LT1TRk1V7S2xYJADs="
        // 更多Base64编码的图片
      ],
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
      const patientSelection = this.$refs.patientSelection.selectedModel;
      const requestData = {
        patient: patientSelection
      };
      console.log(requestData);
      axios.post("/datadisplay", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            // 将Base64编码的图片数组赋值给组件的props
            this.comparisonImageArray = response.data[1][0];//response.data.result_image1返回Base64编码的字符串数组
            this.comparisonImageArray4 = response.data[0];
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
