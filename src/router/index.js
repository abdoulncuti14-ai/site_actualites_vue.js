import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PublicationView from '../views/PublicationView.vue'
import DashboardView from '../views/DashboardView.vue'
import AddArticleView from '../views/AddArticleView.vue' // Import du nouveau composant
import FormulaireView from '@/views/FormulaireView.vue'

const routes = [
  {
    path: '/',
    name: 'formulaire',
    component: FormulaireView
  },
  {
    path: '/flux', 
    name: 'flux', 
    component: HomeView 
  },
  { 
    // Route dynamique : le ':id' permet de charger un article spécifique
    path: '/publication/:id', 
    name: 'publication', 
    component: PublicationView,
    props: true // Permet de passer l'ID directement aux composants
  },
  {
    path: '/dashboard', 
    name: 'dashboard', 
    component: DashboardView
  },
  {
    // Nouvelle route pour le bouton "+" du dashboard
    path: '/add-article',
    name: 'add-article',
    component: AddArticleView
  }
]

const router = createRouter({
  // Utilise l'historique de navigation standard du navigateur
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Protection des routes (Optionnel mais recommandé)
// Vérifie si l'utilisateur est connecté avant d'accéder au dashboard
router.beforeEach((to, from, next) => {
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('access');

  if (authRequired && !loggedIn) {
    return next('/');
  }
  next();
});

export default router