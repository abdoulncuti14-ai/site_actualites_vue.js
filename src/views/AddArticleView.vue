<template>
  <div class="add-container">
    <header class="add-header">
      <router-link to="/dashboard" class="close-btn">✕</router-link>
      <h2>Nouvelle Publication</h2>
    </header>

    <main class="form-wrapper">
      <div class="form-group">
        <label>Titre de l'article</label>
        <input v-model="titre" type="text" placeholder="Entrez un titre accrocheur...">
      </div>

      <div class="form-group">
        <label>Contenu / Commentaire</label>
        <textarea v-model="comment" rows="10" placeholder="Écrivez votre contenu ici..."></textarea>
      </div>

      <button class="save-btn" @click="publishArticle" :disabled="loading">
        {{ loading ? 'Publication en cours...' : 'Publier maintenant' }}
      </button>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const titre = ref('')
const comment = ref('') // Correspond au champ 'comment' de ton modèle Django
const loading = ref(false)

const publishArticle = async () => {
  if (!titre.value || !comment.value) {
    alert("Veuillez remplir tous les champs")
    return
  }

  loading.value = true
  try {
    // Envoi des données vers ton ViewSet Django
    await axios.post('http://127.0.0.1:8000/api/articles/', {
      titre: titre.value,
      comment: comment.value
    })
    
    alert("Article publié avec succès !")
    router.push('/dashboard') // Retour au dashboard après succès
  } catch (error) {
    console.error("Erreur de publication:", error)
    alert("Erreur lors de la publication. Vérifiez votre connexion.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-container { background: white; min-height: 100vh; font-family: sans-serif; }
.add-header { display: flex; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
.close-btn { text-decoration: none; font-size: 24px; color: #333; margin-right: 20px; }
.form-wrapper { padding: 20px; }
.form-group { margin-bottom: 25px; }
.form-group label { display: block; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
input, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; box-sizing: border-box; font-size: 16px; }
.save-btn { width: 100%; padding: 15px; background: #104171; color: white; border: none; border-radius: 25px; font-weight: bold; font-size: 16px; cursor: pointer; }
.save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
</style>