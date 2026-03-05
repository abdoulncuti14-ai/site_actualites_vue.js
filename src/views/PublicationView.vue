<template>
  <div class="detail-page" v-if="article">
    <header class="top-nav">
      <button @click="$router.push('/flux')" class="back-link">‹ Retour</button>
      <span class="center-title">Détails de l'article</span>
    </header>

    <img :src="article.image" class="full-img" v-if="article.image">
    
    <div class="article-body">
      <p class="author-tag">Par {{ article.auteur }}</p>
      <h1>{{ article.titre }}</h1>
      <p class="main-text">{{ article.comment }}</p>
    </div>

    <div class="comment-section">
      <h3>Commentaires ({{ article.commentaires?.length || 0 }})</h3>
      
      <div v-for="c in article.commentaires" :key="c.id" class="comment-box">
        <p class="com-user">{{ c.user_nom }} <span class="com-date">{{ c.date_pub }}</span></p>
        <p class="com-content">{{ c.contenu }}</p>
      </div>

      <div class="input-area">
        <input v-model="txtCommentaire" placeholder="Écrire un commentaire..." @keyup.enter="submitComment">
        <button @click="submitComment" class="send-button">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const article = ref(null)
const txtCommentaire = ref('')

const loadData = async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/articles/${id}/`)
    article.value = res.data
  } catch (e) { console.error("Erreur API") }
}

const submitComment = async () => {
  if (!txtCommentaire.value) return
  try {
    await axios.post('http://127.0.0.1:8000/api/commentaires/', {
      contenu: txtCommentaire.value,
      article: article.value.id // ICI : On lie le commentaire à l'article
    })
    txtCommentaire.value = ''
    loadData() // Recharge pour voir le nouveau commentaire
  } catch (err) {
    alert("Erreur d'envoi : Vérifiez que vous êtes connecté.")
  }
}

onMounted(loadData)
</script>

<style scoped>
.comment-section { padding: 20px; background: #f9f9f9; border-top: 1px solid #eee; }
.comment-box { background: white; padding: 12px; border-radius: 10px; margin-bottom: 10px; border: 1px solid #eee; }
.com-user { font-weight: bold; color: #104171; font-size: 13px; margin-bottom: 5px; }
.input-area { display: flex; gap: 10px; margin-top: 20px; }
input { flex: 1; padding: 12px; border-radius: 25px; border: 1px solid #ddd; }
.send-button { background: #1EB53A; color: white; border: none; padding: 0 20px; border-radius: 25px; font-weight: bold; }
</style>