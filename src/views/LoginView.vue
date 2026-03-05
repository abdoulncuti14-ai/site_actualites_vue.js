<template>
  <div class="mobile-container">
    <div class="header-image">
      <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000" alt="Header">
    </div>

    <div class="login-card">
      <h1 class="logo-text">BURUNDI <span class="green-text">NEWS</span></h1>
      <p class="subtitle">Kaze - Bienvenue sur votre flux</p>

      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input type="text" v-model="username" placeholder="Entrez votre nom...">
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" v-model="password" placeholder="••••••••">
      </div>

      <button class="btn-login" @click="handleLogin">Login</button>

      <p v-if="error" class="error-msg">{{ error }}</p>
      <p class="forgot-link">Mot de passe oublié ?</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', {
      username: username.value,
      password: password.value
    })
    // Sauvegarde des tokens
    localStorage.setItem('access', response.data.access)
    localStorage.setItem('refresh', response.data.refresh)
    
    router.push('/flux')
  } catch (err) {
    error.value = "Utilisateur ou mot de passe incorrect."
  }
}
</script>

<style scoped>
.mobile-container { background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; }
.header-image { height: 250px; overflow: hidden; }
.header-image img { width: 100%; height: 100%; object-fit: cover; }
.login-card { background: white; margin-top: -30px; border-radius: 30px 30px 0 0; padding: 30px; flex: 1; box-shadow: 0 -10px 20px rgba(0,0,0,0.1); }
.logo-text { color: #CE1126; font-size: 28px; text-align: center; }
.green-text { color: #1EB53A; }
.subtitle { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 30px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 12px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f1f5f9; box-sizing: border-box; }
.btn-login { width: 100%; padding: 15px; background: #104171; color: white; border: none; border-radius: 25px; font-weight: bold; cursor: pointer; }
.error-msg { color: #CE1126; text-align: center; margin-top: 10px; font-size: 13px; }
</style>