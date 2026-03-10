/**
 * router/index.js
 * ✅ CORRIGÉ : Protection des routes par rôle (admin vs utilisateur normal)
 * ✅ CORRIGÉ : Vérification du token + redirection intelligente
 * ✅ CORRIGÉ : Import FormulaireView remplacé par LoginView (fichier manquant)
 * ✅ AJOUTÉ  : Route 404 pour les pages inexistantes
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PublicationView from '../views/PublicationView.vue'
import DashboardView from '../views/DashboardView.vue'
import AddArticleView from '../views/AddArticleView.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  // ─── Routes publiques ───
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { public: true }  // Accessible sans connexion
  },

  // ─── Routes authentifiées ───
  {
    path: '/flux',
    name: 'flux',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/publication/:id',
    name: 'publication',
    component: PublicationView,
    props: true,
    meta: { requiresAuth: true }
  },

  // ─── Routes Admin uniquement ───
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }  // ✅ Réservé aux admins
  },
  {
    path: '/add-article',
    name: 'add-article',
    component: AddArticleView,
    meta: { requiresAuth: true, requiresAdmin: true }  // ✅ Réservé aux admins
  },

  // ─── Route 404 ───
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ─────────────────────────────────────────────
// ✅ CORRIGÉ : Guard de navigation amélioré
// Vérifie : connexion + rôle admin si nécessaire
// ─────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access')
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  // Si la route est publique → accès libre
  if (to.meta.public) {
    // Si déjà connecté et on va sur login → rediriger vers flux
    if (accessToken && to.name === 'login') {
      const isAdmin = user?.is_staff || false
      return next(isAdmin ? '/dashboard' : '/flux')
    }
    return next()
  }

  // Si la route nécessite une authentification
  if (to.meta.requiresAuth && !accessToken) {
    return next('/')  // Pas connecté → page de login
  }

  // ✅ Si la route nécessite un rôle admin
  if (to.meta.requiresAdmin) {
    const isAdmin = user?.is_staff || false
    if (!isAdmin) {
      return next('/flux')  // Pas admin → redirection vers flux
    }
  }

  next()
})

export default router