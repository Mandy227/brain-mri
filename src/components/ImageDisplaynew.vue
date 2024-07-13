<template>
  <div class="image-display">
    <div v-if="imageUrls && imageUrls.length > 0" class="image-list">
      <div v-for="(url, index) in imageUrls" :key="index" class="list-image-container">
        <img :src="url" alt="Uploaded Image" class="list-image" />
      </div>
    </div>
    <div v-else class="empty-state">等待图片上传</div>
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
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #f5f5f5;
  overflow-y: auto;
  overflow-x: hidden; /* Hide horizontal scrollbar */
}

.image-list {
  width: 100%;
  overflow-x: hidden; /* Hide horizontal scrollbar */
}

.list-image-container {
  width: 100%;
  padding: 0; /* Remove any padding */
  margin: 0; /* Remove any margin */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.list-image {
  max-width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.empty-state {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #f5f5f5;
}
</style>

