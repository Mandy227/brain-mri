<template>
  <div>
    <h1>BrainMRI segmentation脑肿瘤检测系统</h1>
    <el-row :gutter="70" style="margin-top: 20px;">
      <el-col :span="12">
        <el-row :gutter="200">
          <el-col :span="4">
            <el-button type="primary" @click="openDirectory1">打开目录</el-button>
            <input type="file" ref="fileInput1" style="display: none;" @change="uploadImages1" multiple accept=".tif,.jpg,.png">
          </el-col>
        </el-row>
        <iamge-displays :imageUrls="comparisonImageArray" style="margin-top: 20px;"/>
        <iamge-displays :imageUrls="comparisonImageArray4" style="margin-top: 20px;"/>
        <el-row :gutter="200">
          <el-col :span="4">
            <el-button type="primary" @click="fetchAndDisplayWholeBrainTumorImage" style="margin-top:40px;">全脑空间肿瘤</el-button>
          </el-col>
        </el-row>
        <iamge-displays :imageUrls="comparisonImageArray2" style="margin-top: 20px;"/>
        <image-displaynew :imageUrls="imageUrl5" style="margin-bottom: 60px;margin-top: 20px;"/>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="7">
            <model-selection ref="modelSelection"/>
          </el-col>
          <el-col :span="7">
            <parameter-selection ref="parameterSelection"/>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="startTraining">开始训练</el-button>    
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <image-displaynew :imageUrls="comparisonImageArray3" style="margin-left: 20px;" />
          </el-col>
          <el-col :span="12">
            <image-displaynew :imageUrls="imageUrl4" style="margin-left: 20px;" />
          </el-col>
        </el-row>
        <el-row :gutter="200">
          <el-col :span="4">
            <el-button type="primary" @click="fetchAndDisplay3DTumorImage" style="margin-top:40px;">三维肿瘤</el-button>
          </el-col>
        </el-row>
        <iamge-displays :imageUrls="comparisonImageArray1" style="margin-top: 20px;"/>
        <image-displaynew :imageUrls="imageUrl2" style="margin-top: 20px;"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ModelSelection from '../components/ModelSelection.vue';
import ParameterSelection from '../components/ParameterSelection.vue';
import IamgeDisplays from '../components/IamgeDisplays.vue';
import ImageDisplaynew from '../components/ImageDisplaynew.vue';
import axios from 'axios';

export default {
  components: {
    ModelSelection,
    ParameterSelection,
    IamgeDisplays,
    ImageDisplaynew,
  },
  data() {
    return {
      imageUrl1: [],
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
      comparisonImageArray:[],
      comparisonImageArray1:[],
      comparisonImageArray2:[],
      comparisonImageArray3:[],
      comparisonImageArray4:[],
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
    openDirectory2() {
      this.$refs.fileInput2.click();
    },
    openDirectory3() {
      this.$refs.fileInput3.click();
    },
    openDirectory4() {
      this.$refs.fileInput4.click();
    },
    nextPage() {
      this.$router.push('/model-performance');
    },
    // async uploadImages1(event) {
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

    //     this.comparisonImageArray = response.data.imageUrls;
    //   } catch (error) {
    //     console.error('图片上传失败:', error);
    //   }
    // },
    uploadImages1(event) {
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
            this.comparisonImageArray = response.data.imageUrls;
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
    // async uploadImages2(event) {
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
    uploadImages2(event) {
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
    // async uploadImages3(event) {
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

    //     this.comparisonImageArray2 = response.data.imageUrls;
    //   } catch (error) {
    //     console.error('图片上传失败:', error);
    //   }
    // },
    uploadImages3(event) {
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
            this.comparisonImageArray2 = response.data.imageUrls;
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
    // async uploadImages4(event) {
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
    //     this.comparisonImageArray3 = response.data.imageUrls;
    //   } catch (error) {
    //     console.error('图片上传失败:', error);
    //   }
    // },
    uploadImages4(event) {
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
            this.comparisonImageArray3 = response.data.imageUrls;
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
    // async fetchAndDisplay3DTumorImage() {
    //   if (this.comparisonImageArray1.length === 0) {
    //     console.error('没有可用的图片用于生成三维肿瘤图像');
    //     return;
    //   }
    //   try {
    //     const requestData = {
    //       images: this.comparisonImageArray1
    //     };
    //     const response = await fetch('/3d-tumor-image', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     });
    //     if (!response.ok) {
    //       throw new Error('网络响应不正确');
    //     }
    //     const data = await response.json();
    //     this.imageUrl2 = data.imageUrl;
    //   } catch (error) {
    //     console.error('生成三维肿瘤图像时出现错误:', error);
    //   }
    // },
    fetchAndDisplay3DTumorImage() {
      const requestData = {
        images: this.comparisonImageArray1
      };
      axios.post("/3d-tumor-image", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.imageUrl2 = response.data.result_image_url;
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
    // async fetchAndDisplayWholeBrainTumorImage() {
    //   if (this.comparisonImageArray2.length === 0) {
    //     console.error('没有可用的图片用于生成全脑空间肿瘤图像');
    //     return;
    //   }
    //   try {
    //     const requestData = {
    //       images: this.comparisonImageArray2
    //     };
    //     const response = await fetch('/whole-brain-tumor-image', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify(requestData)
    //     });
    //     if (!response.ok) {
    //       throw new Error('网络响应不正确');
    //     }
    //     const data = await response.json();
    //     this.imageUrl5 = data.imageUrl;
    //   } catch (error) {
    //     console.error('生成全脑空间肿瘤图像时出现错误:', error);
    //   }
    // },
    fetchAndDisplayWholeBrainTumorImage() {
      const requestData = {
        images: this.comparisonImageArray2
      };
      axios.post("/whole-brain-tumor-image", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.imageUrl5 = response.data.result_image_url;
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
      const imageUrl3 = this.imageUrl3;
      const requestData = {
        model: modelSelection,
        parameters: parameterSelection,
        image_url: imageUrl3
      };
      axios.post("/train", requestData)
        .then(response => {
          console.log("得到回应", response.data);
          if (response.data.code == "1") {
            this.imageUrl4 = response.data.result_image_url;
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
  text-align: center;
  margin-bottom: 20px;
}
</style>
