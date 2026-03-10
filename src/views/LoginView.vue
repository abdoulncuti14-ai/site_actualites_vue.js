<template>
  <div class="mobile-container">
    <div class="header-image">
      <div class="header-overlay">
        <div class="header-logo">
          <span class="logo-red">BURUNDI</span>
          <span class="logo-green"> NEWS</span>
        </div>
        <p class="header-sub">Kaze — Bienvenue sur votre flux</p>
      </div>
    </div>

    <div class="login-card">
      <!-- Tabs Login / Register -->
      <div class="auth-tabs">
        <button :class="['tab-btn', { active: mode === 'login' }]" @click="mode = 'login'; error = ''">
          Connexion
        </button>
        <button :class="['tab-btn', { active: mode === 'register' }]" @click="mode = 'register'; error = ''">
          Inscription
        </button>
      </div>

      <!-- Formulaire Connexion -->
      <div v-if="mode === 'login'">
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" v-model="username" placeholder="Entrez votre nom..." @keyup.enter="handleLogin">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <div class="password-wrap">
            <input :type="showPass ? 'text' : 'password'" v-model="password" placeholder="••••••••" @keyup.enter="handleLogin">
            <button class="eye-btn" @click="showPass = !showPass" type="button">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <button class="btn-login" @click="handleLogin" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </div>

      <!-- Formulaire Inscription -->
      <div v-if="mode === 'register'">
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" v-model="username" placeholder="Choisissez un pseudo...">
        </div>
        <div class="form-group">
          <label>Email (optionnel)</label>
          <input type="email" v-model="email" placeholder="votre@email.com">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <div class="password-wrap">
            <input :type="showPass ? 'text' : 'password'" v-model="password" placeholder="Min. 6 caractères">
            <button class="eye-btn" @click="showPass = !showPass" type="button">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Confirmer le mot de passe</label>
          <input type="password" v-model="password2" placeholder="Répétez le mot de passe">
        </div>
        <button class="btn-login" @click="handleRegister" :disabled="loading">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>
      </div>

      <!-- Message d'erreur / succès -->
      <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
      <p v-if="success" class="success-msg">✅ {{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const mode = ref('login')
const username = ref('')
const password = ref('')
const password2 = ref('')
const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const showPass = ref(false)

// ─────────────────────────────────────────────
// ✅ CORRIGÉ : Sauvegarde les infos user dans localStorage
// Permet au router de vérifier le rôle (admin/user)
// ─────────────────────────────────────────────
const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await axios.post('/api/token/', {
      username: username.value,
      password: password.value
    })

    // ✅ Sauvegarde des tokens ET des infos utilisateur
    localStorage.setItem('access', response.data.access)
    localStorage.setItem('refresh', response.data.refresh)
    localStorage.setItem('user', JSON.stringify({
      id: response.data.user_id,
      username: response.data.username,
      is_staff: response.data.is_staff
    }))

    // ✅ Redirection selon le rôle
    if (response.data.is_staff) {
      router.push('/dashboard')
    } else {
      router.push('/flux')
    }
  } catch (err) {
    error.value = 'Nom d\'utilisateur ou mot de passe incorrect.'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!username.value || !password.value) {
    error.value = 'Nom d\'utilisateur et mot de passe obligatoires.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }
  if (password.value !== password2.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await axios.post('/api/register/', {
      username: username.value,
      password: password.value,
      email: email.value
    })
    success.value = 'Compte créé ! Connectez-vous maintenant.'
    mode.value = 'login'
    password.value = ''
    password2.value = ''
    email.value = ''
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la création du compte.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mobile-container {
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-image {
  height: 220px;
  background: linear-gradient(135deg, #CE1126 0%, #8B0000 50%, #104171 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.header-logo {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
}
.logo-red { color: white; }
.logo-green { color: #1EB53A; }
.header-sub { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 8px; }

.login-card {
  background: white;
  margin-top: -30px;
  border-radius: 30px 30px 0 0;
  padding: 30px;
  flex: 1;
  box-shadow: 0 -10px 20px rgba(0,0,0,0.1);
}

.auth-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}
.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #94a3b8;
  transition: all .2s;
}
.tab-btn.active {
  background: #104171;
  color: white;
}

.form-group { margin-bottom: 16px; }
.form-group label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: .4px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  box-sizing: border-box;
  font-size: 15px;
  transition: border-color .2s;
}
input:focus {
  outline: none;
  border-color: #104171;
  background: white;
}

.password-wrap { position: relative; }
.password-wrap input { padding-right: 48px; }
.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-login {
  width: 100%;
  padding: 15px;
  background: #104171;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity .2s;
}
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-login:active { opacity: .85; }

.error-msg { color: #CE1126; text-align: center; margin-top: 12px; font-size: 13px; }
.success-msg { color: #1EB53A; text-align: center; margin-top: 12px; font-size: 13px; }
</style>