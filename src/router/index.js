import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue' 
import HomeView from '../views/HomeView.vue'
import PublicationView from '../views/PublicationView.vue'
import DashboardView from '../views/DashboardView.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/flux', 
    name: 'flux', 
    component: HomeView 
  },
  { 
    path: '/publication', 
    name: 'publication', 
    component: PublicationView
   },
  {
     path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView
  }
  
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router