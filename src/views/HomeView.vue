<template>
  <div class="feed-container">
    <header class="red-header">
      <h1 class="logo-title">BURUNDI NEWS</h1>
    </header>

    <main class="content-area">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="card-user-header">
          <div class="avatar-circle"></div>
          <span class="user-display-name">{{ article.auteur }}</span>
        </div>

        <div class="card-main-content">
          <h2 class="article-title">{{ article.titre }}</h2>
          <p class="article-snippet">{{ article.comment }}</p>
          <img v-if="article.image" :src="article.image" class="article-preview-img">
        </div>

        <div class="card-footer-actions">
          <button 
            @click="toggleLocalLike(article.id)" 
            :class="['footer-btn', { 'is-liked': likedIds.has(article.id) }]"
          >
            {{ likedIds.has(article.id) ? '❤️ Aimé' : 'J\'aime' }}
          </button>
          
          <router-link :to="'/publication/' + article.id" class="footer-btn border-x">
            Commenter ({{ article.nb_commentaires }})
          </router-link>

          <button @click="confirmDelete(article.id)" class="footer-btn delete-text">
            Supprimer
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const articles = ref([])
const likedIds = ref(new Set())

const loadAllArticles = async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/articles/")
    articles.value = res.data.results
  } catch (err) {
    console.error("Erreur de chargement du flux")
  }
}

const toggleLocalLike = (id) => {
  if (likedIds.value.has(id)) likedIds.value.delete(id)
  else likedIds.value.add(id)
}

const confirmDelete = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer cette publication ?")) {
    try {
      // Appel à l'API Django pour supprimer
      await axios.delete(`http://127.0.0.1:8000/api/articles/${id}/`)
      loadAllArticles() // Rafraîchir la liste
    } catch (err) {
      alert("Erreur : Action non autorisée.")
    }
  }
}

onMounted(loadAllArticles)
</script>

<style scoped>
.feed-container { background-color: #f4f4f4; min-height: 100vh; }
.red-header { background-color: #CE1126; padding: 15px; text-align: center; color: white; }
.logo-title { font-weight: 900; font-size: 20px; }

.article-card { background: white; border-radius: 15px; margin: 20px auto; width: 90%; max-width: 500px; border: 1px solid #ddd; overflow: hidden; }
.card-user-header { display: flex; align-items: center; padding: 15px; }
.avatar-circle { width: 45px; height: 45px; background-color: #1EB53A; border-radius: 50%; margin-right: 12px; }
.user-display-name { font-weight: bold; color: #333; }

.card-footer-actions { display: flex; border-top: 1px solid #eee; background: #fafafa; }
.footer-btn { flex: 1; border: none; background: none; padding: 15px 0; cursor: pointer; color: #666; font-weight: 600; text-decoration: none; text-align: center; }
.border-x { border-left: 1px solid #eee; border-right: 1px solid #eee; }
.is-liked { color: #CE1126; }
.delete-text { color: #CE1126; } /* Couleur rouge pour supprimer */
</style>