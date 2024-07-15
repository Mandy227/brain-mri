<template>
  <div class="image-display">
    <div v-if="base64Images && base64Images.length > 0" class="image-gallery">
      <div v-for="(base64Image, index) in base64Images" :key="index" class="gallery-image-container">
        <img :src="base64Image" alt="Uploaded Image" class="gallery-image" />
      </div>
    </div>
    <div v-else>等待图片上传</div>
  </div>
</template>

<script>
export default {
  props: {
    base64Images: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    console.log('ImageDisplay base64Images:', this.base64Images);
  },
  updated() {
    console.log('ImageDisplay base64Images updated:', this.base64Images);
  },
};
</script>

<style scoped>
.image-display {
  width: 100%;
  height: 300px; 
  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #f5f5f5;
  overflow-y: auto; 
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
}

.gallery-image-container {
  flex: 0 0 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-image {
  max-width: 90%; 
  max-height: 200px;
  margin: 5px; 
  display: block;
}
</style>