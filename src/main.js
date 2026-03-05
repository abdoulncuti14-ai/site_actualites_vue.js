import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

/**
 * CONFIGURATION AXIOS (INTERCEPTEUR)
 * Ce bloc permet d'ajouter automatiquement ton Token JWT 
 * à chaque requête envoyée vers ton backend Django.
 */
axios.interceptors.request.use((config) => {
  // Récupération du token stocké lors de la connexion
  const token = localStorage.getItem('access')
  
  if (token) {
    // Ajout du header Authorization formaté pour SimpleJWT
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  // Gestion des erreurs de requête
  return Promise.reject(error)
})

/**
 * GESTION DES ERREURS DE RÉPONSE
 * Si le token expire (Erreur 401), on redirige vers le Login
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access')
      router.push('/')
    }
    return Promise.reject(error)
  }
)

// Initialisation de l'application Vue
const app = createApp(App)

// Injection du routeur et montage sur l'élément #app
app.use(router)
app.mount('#app')