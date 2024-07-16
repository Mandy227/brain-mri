<template>
  <div ref="stlContainer" class="stl-container"></div>
</template>

<script>
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default {
  name: 'StlViewer',
  mounted() {
    this.initThree();
  },
  methods: {
    initThree() {
      const container = this.$refs.stlContainer;

      // 创建场景
      const scene = new THREE.Scene();

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0xdddddd, 1); // 设置背景颜色为浅灰色
      container.appendChild(renderer.domElement);

      // 添加灯光
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(1, 1, 1).normalize();
      scene.add(light);

      // 加载STL模型
      const loader = new STLLoader();
      loader.load('/3D_model.stl', (geometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0x156289,
          specular: 0x111111,
          side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 计算模型的边界框并居中
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        boundingBox.getCenter(mesh.position).multiplyScalar(-1);

        // 根据模型大小调整相机位置
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 3;

        // 初始化旋转角度
        let angle = 0;

        // 动画渲染函数
        const animate = () => {
          requestAnimationFrame(animate);

          // 更新旋转角度
          angle += 0.005; // 控制旋转速度

          // 应用旋转到模型
          mesh.rotation.y = angle;

          // 渲染场景和相机
          renderer.render(scene, camera);
        };

        // 开始动画
        animate();
      });
    }
  }
}
</script>

<style>
.stl-container {
  width: 70%;
  height: 60vh;
  overflow: hidden; /* 防止容器内容溢出 */
  margin-left: 40px;
}
</style>
