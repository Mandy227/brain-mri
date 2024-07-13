<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" router>
        <el-menu-item index="1" :route="{ path: '/' }">肿瘤检测</el-menu-item>
        <el-menu-item index="2" :route="{ path: '/model-performance' }">模型性能</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
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
</style>
