<template>
  <div class="image-display">
    <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" />
    <div v-else>图片上传</div>
  </div>
</template>

<script>
export default {
  props: ['imageUrl'],
  mounted() {
    console.log('ImageDisplay imageUrl:', this.imageUrl);
  },
  updated() {
    console.log('ImageDisplay imageUrl updated:', this.imageUrl);
  },
};
</script>

<style scoped>
.image-display {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #f5f5f5;
}
img {
  max-width: 100%;
  max-height: 100%;
}
</style>
