<template>
  <el-upload
    class="upload-demo"
    drag
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-success="handleSuccess"
    :file-list="fileList"
    :before-upload="beforeUpload">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleSuccess(response, file) {
      this.$emit('uploaded', URL.createObjectURL(file.raw));
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件');
      }
      return isImage;
    }
  }
};
</script>

<style scoped>
.upload-demo {
  width: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fff;
  text-align: center;
  padding: 20px;
}
.el-upload__text {
  margin-top: 16px;
}
</style>
