<template>
  <el-container>
    <el-header>
      <h1 class="title">Brain MRI segmentation脑肿瘤检测系统</h1>
    </el-header>
    <el-container> 
      <el-aside width="150px">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" router>
          <el-menu-item index="1" :route="{ path: '/' }">肿瘤检测</el-menu-item>
          <el-menu-item index="2" :route="{ path: '/model-performance' }">模型性能</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <input type="file" ref="fileInput" style="display: none;" />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  computed: {
    activeIndex() {
      return this.$route.path === '/' ? '1' : '2';
    }
  },
  methods: {
    navigateTo(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style>
.el-menu-vertical-demo {
  height: 100%;
  border-right: 0;
}

.el-header {
  background-color: #0f4174; 
  color: white; 
  text-align: center; 
  line-height: 60px; 
  font-size: 16px; 
}

.title {
  margin: 0; 
}
</style>

