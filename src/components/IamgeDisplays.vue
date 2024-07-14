<template>
  <div class="image-display">
    <div v-if="imageUrls && imageUrls.length > 0" class="image-gallery">
      <div v-for="(url, index) in imageUrls" :key="index" class="gallery-image-container">
        <img :src="url" alt="Uploaded Image" class="gallery-image" />
      </div>
    </div>
    <div v-else>等待图片上传</div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrls: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    console.log('ImageDisplay imageUrls:', this.imageUrls);
  },
  updated() {
    console.log('ImageDisplay imageUrls updated:', this.imageUrls);
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

