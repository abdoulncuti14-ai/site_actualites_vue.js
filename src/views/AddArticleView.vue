<template>
  <div class="add-container">
    <header class="add-header">
      <router-link to="/dashboard" class="close-btn">✕</router-link>
      <h2>Nouvelle Publication</h2>
    </header>

    <main class="form-wrapper">
      <div class="form-group">
        <label>Titre de l'article <span class="required">*</span></label>
        <input
          v-model="titre"
          type="text"
          placeholder="Entrez un titre accrocheur..."
          :class="{ 'input-error': errors.titre }"
          @input="errors.titre = ''"
        >
        <span v-if="errors.titre" class="field-error">{{ errors.titre }}</span>
      </div>

      <div class="form-group">
        <label>Contenu <span class="required">*</span></label>
        <textarea
          v-model="comment"
          rows="10"
          placeholder="Écrivez votre contenu ici..."
          :class="{ 'input-error': errors.comment }"
          @input="errors.comment = ''"
        ></textarea>
        <span v-if="errors.comment" class="field-error">{{ errors.comment }}</span>
        <span class="char-count">{{ comment.length }} caractères</span>
      </div>

      <p v-if="apiError" class="api-error">⚠️ {{ apiError }}</p>

      <button class="save-btn" @click="publishArticle" :disabled="loading">
        {{ loading ? '⏳ Publication en cours...' : '✅ Publier maintenant' }}
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const titre = ref('')
const comment = ref('')
const loading = ref(false)
const apiError = ref('')

const errors = reactive({ titre: '', comment: '' })

const validate = () => {
  let valid = true
  if (!titre.value.trim()) {
    errors.titre = 'Le titre est obligatoire.'
    valid = false
  } else if (titre.value.trim().length < 5) {
    errors.titre = 'Le titre doit contenir au moins 5 caractères.'
    valid = false
  }
  if (!comment.value.trim()) {
    errors.comment = 'Le contenu est obligatoire.'
    valid = false
  } else if (comment.value.trim().length < 10) {
    errors.comment = 'Le contenu doit contenir au moins 10 caractères.'
    valid = false
  }
  return valid
}

const publishArticle = async () => {
  apiError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    // ✅ URL relative (gérée par axios.defaults.baseURL dans main.js)
    // ✅ auteur non envoyé → assigné automatiquement par Django (perform_create)
    await axios.post('/api/articles/', {
      titre: titre.value.trim(),
      comment: comment.value.trim()
    })
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.status === 401) {
      apiError.value = 'Session expirée. Veuillez vous reconnecter.'
      setTimeout(() => router.push('/'), 2000)
    } else if (error.response?.status === 403) {
      apiError.value = 'Vous n\'avez pas la permission de publier un article.'
    } else {
      apiError.value = 'Erreur lors de la publication. Réessayez.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-container { background: white; min-height: 100vh; }
.add-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  gap: 16px;
}
.close-btn { text-decoration: none; font-size: 22px; color: #333; }
h2 { font-size: 17px; color: #1e293b; margin: 0; }

.form-wrapper { padding: 24px 20px; }
.form-group { margin-bottom: 24px; }
.form-group label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .4px;
  margin-bottom: 8px;
}
.required { color: #CE1126; }

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  box-sizing: border-box;
  font-size: 15px;
  font-family: inherit;
  transition: border-color .2s;
}
input:focus, textarea:focus {
  outline: none;
  border-color: #104171;
  background: white;
}
.input-error { border-color: #CE1126 !important; }

.field-error { font-size: 12px; color: #CE1126; margin-top: 4px; display: block; }
.char-count { font-size: 11px; color: #94a3b8; display: block; text-align: right; margin-top: 4px; }

.api-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #CE1126;
  margin-bottom: 16px;
}

.save-btn {
  width: 100%;
  padding: 15px;
  background: #104171;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: opacity .2s;
}
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.save-btn:active { opacity: .85; }
</style>