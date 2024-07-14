<template>
  <div>
    <h1>模型性能视图</h1>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="10">
        <el-row :gutter="20">
          <el-col :span="12">
            <model-list-selection ref="modelListSelection"/>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" class="custom-button" @click="fetchAndDisplayPerformanceComparison">多模型性能对比</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" >
          <el-col :span="20">
            <image-displaynew :imageUrls="comparisonImage1" style="margin-top: 20px;"/>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row :gutter="20">
          <el-col :span="6">
            <model-selection ref="modelSelection"/>
          </el-col>
          <el-col :span="6">
            <parameter-selection ref="parameterSelection"/>
          </el-col>
          <el-col :span="6">
            <index-selection ref="indexSelection"/>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="custom-button" @click="modelstartTraining">开始训练</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" >
          <el-col :span="20">
            <image-displaynew :imageUrls="comparisonImage2" style="margin-left: 40px;margin-top:20px;" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <h2>不同方法对比</h2>
    <el-row :gutter="20">
      <el-col :span="4">
        <image-up-test />
        <!-- <el-button type="primary" class="custom-button" @click="openDirectory">选择图片</el-button>
        <input type="file" ref="fileInput" style="display: none;" @change="uploadImage" multiple accept=".tif,.jpg,.png"> -->
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="custom-button" @click="fetchAndDisplayComparisonImage">对比展示</el-button>
      </el-col>
      <el-col :span="16">
        <iamge-displays :imageUrls="comparisonImageArray"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import IndexSelection from '@/components/IndexSelection.vue';
import ModelListSelection from '@/components/ModelListSelection.vue';
import IamgeDisplays from '@/components/IamgeDisplays.vue';
import ImageDisplaynew from '@/components/ImageDisplaynew.vue';
import axios from 'axios';
import ImageUpTest from '@/components/ImageUpTest.vue';

export default {
  components: {
    ModelSelection,
    ModelListSelection,
    ParameterSelection,
    IndexSelection,
    IamgeDisplays,
    ImageDisplaynew,
    ImageUpTest
  },
  data() {
    return {
      comparisonImage1: '',
      comparisonImage2: '',
      comparisonImage3: '',
      comparisonImageArray:[],
      comparisonImageArray1:[],
    };
  },
  methods: {
    openDirectory() {
      this.$refs.fileInput.click();
    },
    // async uploadImage(event) {
    //   const files = event.target.files;
    //   if (files.length === 0) return;

    //   const formData = new FormData();
    //   for (let i = 0; i < files.length; i++) {
    //     formData.append('images[]', files[i]);
    //   }

    //   try {
    //     const response = await axios.post('/upload-images', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });

    //     this.comparisonImageArray1 = response.data.imageUrls;
    //   } catch (error) {
    //     console.error('图片上传失败:', error);
    //   }
    // },
    uploadImage(event) {
      const files = event.target.files;
      if (files.length === 0) return;

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images[]', files[i]);
      }
      axios.post("/upload-images", formData)
        .then(response => {
          console.log("图片上传成功", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray1 = response.data.imageUrls;
          } else if (response.data.code == "-1") {
            console.log(response.data.message);
          } else {
            console.log("未处理的响应代码", response.data.code);
          }
        })
        .catch(error => {
          if (error.response) {
            // 根据错误响应状态码进行处理
            console.error("图片上传失败，服务器返回错误:", error.response.data);
            console.error("状态码:", error.response.status);
            console.error("响应头部:", error.response.headers);
          } else if (error.request) {
            // 处理没有收到响应的情况
            console.error("图片上传失败，没有收到响应:", error.request);
          } else {
            // 处理其他错误情况
            console.error("图片上传失败，发生其他错误:", error.message);
          }
          console.error("请求配置:", error.config);
        });
    },
    // async fetchAndDisplayComparisonImages() {
    //   try {
    //     const response = await fetch('/comparison-images', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ imageUrl: imageUrl })
    //     });
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //     this.comparisonImageArray = data.urls;
    //   } catch (error) {
    //     console.error('There has been a problem with your fetch operation:', error);
    //   }
    // },
    fetchAndDisplayComparisonImages() {
      const requestData = {
        images: this.comparisonImageArray1
      };
      axios.post("/comparison-images", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImageArray = response.data.result_image_url;
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
    // async fetchAndDisplayPerformanceComparison() {
    //   const selectedModels = this.$refs.modelListSelection.selectedModels;
    //   try {
    //     const response = await fetch('/performance-comparison', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ models: selectedModels })
    //     });
    //     if (!response.ok) {
    //       throw new Error('网络响应不正确');
    //     }
    //     const data = await response.json();
    //     this.comparisonImage1 = data.url;
    //   } catch (error) {
    //     console.error('获取多模型性能对比图像时出现错误:', error);
    //   }
    // },
    fetchAndDisplayPerformanceComparison() {
      const selectedModels = this.$refs.modelListSelection.selectedModels;
      const requestData = {
        model: selectedModels,
      };
      axios.post("/performance-comparison", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImage1 = response.data.result_image_url;
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
    // async modelstartTraining() {
    //   const modelSelection = this.$refs.modelSelection.selectedModel;
    //   const parameterSelection = this.$refs.parameterSelection.selectedModel;
    //   const indexSelection = this.$refs.indexSelection.selectedModels;
    //   const payload = {
    //     model: modelSelection,
    //     parameters: parameterSelection,
    //     index: indexSelection
    //   };
    //   try {
    //     const response = await fetch('/model-train', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(payload)
    //     });
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //     this.comparisonImage2 = data.url;
    //   } catch (error) {
    //     console.error('训练过程中出现错误:', error);
    //   }
    // },
    modelstartTraining() {
      const modelSelection = this.$refs.modelSelection.selectedModel;
      const parameterSelection = this.$refs.parameterSelection.selectedModel;
      const indexSelection = this.$refs.indexSelection.selectedModels;
      const requestData = {
        model: modelSelection,
        parameters: parameterSelection,
        index: indexSelection
      };
      axios.post("/train", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.comparisonImage2 = response.data.result_image_url;
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

  }
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
</style>