/**
 * main.js
 * ✅ CORRIGÉ : Gestion du refresh token automatique (plus de déconnexion brutale)
 * ✅ CORRIGÉ : Centralisation de l'URL de base dans une constante
 * ✅ AJOUTÉ  : Intercepteur de réponse avec tentative de refresh avant déconnexion
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// ─────────────────────────────────────────────
// ✅ URL de base centralisée
// En développement : http://127.0.0.1:8000
// En production : changez cette valeur
// ─────────────────────────────────────────────
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// ─────────────────────────────────────────────
// Intercepteur de REQUÊTE
// Ajoute automatiquement le token JWT à chaque appel API
// ─────────────────────────────────────────────
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─────────────────────────────────────────────
// ✅ CORRIGÉ : Intercepteur de RÉPONSE amélioré
// Avant : déconnexion immédiate si 401
// Après : tentative de refresh du token d'abord
// ─────────────────────────────────────────────
let isRefreshing = false

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 ET qu'on n'a pas déjà essayé de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Évite les boucles de refresh simultanées
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        router.push('/')
        return Promise.reject(error)
      }

      isRefreshing = true
      const refreshToken = localStorage.getItem('refresh')

      if (refreshToken) {
        try {
          // Tentative de renouvellement du token
          const response = await axios.post('/api/token/refresh/', {
            refresh: refreshToken
          })
          const newAccessToken = response.data.access
          localStorage.setItem('access', newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          isRefreshing = false
          // Relance la requête originale avec le nouveau token
          return axios(originalRequest)
        } catch (refreshError) {
          // Le refresh a échoué → déconnexion
          isRefreshing = false
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          localStorage.removeItem('user')
          router.push('/')
          return Promise.reject(refreshError)
        }
      } else {
        // Pas de refresh token → déconnexion
        localStorage.removeItem('access')
        router.push('/')
      }
    }

    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)
app.mount('#app')