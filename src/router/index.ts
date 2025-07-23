import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Board from '../views/Boards.vue';
import Task from '../views/Tasks.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/boards', component: Board, meta: { requiresAuth: true } },
  { path: '/tasks', component: Task, meta: { requiresAuth: true } },
  { path: '/', redirect: '/dashboard' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    return next('/login');
  }
  if (to.meta.guest && auth.user) {
    return next('/dashboard');
  }
  next();
});

export default router;
