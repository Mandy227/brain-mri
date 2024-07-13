import { createRouter, createWebHistory } from 'vue-router';
import BrainTumorDetection from '../views/BrainTumorDetection.vue';
import ModelPerformance from '../views/ModelPerformance.vue';

const routes = [
  {
    path: '/',
    name: 'BrainTumorDetection',
    component: BrainTumorDetection
  },
  {
    path: '/model-performance',
    name: 'ModelPerformance',
    component: ModelPerformance
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
