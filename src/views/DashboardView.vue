<template>
  <div class="admin-container">
    <header class="admin-header">
      <div class="header-content">
        <h1>Admin <span class="red-text">BV</span></h1>
        <div class="search-icon">🔍</div>
      </div>
    </header>

    <main class="admin-list">
      <div v-for="article in articles" :key="article.id" class="list-item">
        <div class="item-thumb">
          <img :src="article.image || 'https://via.placeholder.com/60'" alt="Thumbnail">
        </div>
        
        <div class="item-info">
          <span class="item-category">{{ article.auteur}}</span>
          <h3 class="item-title">{{ article.titre }}</h3>
        </div>
        
        <button class="delete-btn" @click="deleteArticle(article.id)">🗑️</button>
      </div>
    </main>

    <button class="fab-button" @click="$router.push('/add-article')">+</button>

    <nav class="bottom-nav">
      <router-link to="/flux" class="nav-item">🏠</router-link>
      <div class="nav-item active">📊</div>
      <router-link to="/" class="nav-item">👤</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const articles = ref([])

const loadArticles = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/articles/")
    articles.value = response.data.results
  } catch (err) {
    console.error("Erreur de chargement", err)
  }
}

const deleteArticle = async (id) => {
  if(confirm("Supprimer cet article ?")) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/articles/${id}/`)
      loadArticles() 
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
  }
}

onMounted(loadArticles)
</script>

<style scoped>
.admin-container { background-color: #f8fafc; min-height: 100vh; padding-bottom: 80px; }
.admin-header { padding: 20px; background: white; }
.list-item { background: white; margin: 10px; padding: 12px; display: flex; align-items: center; border-radius: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.item-thumb { width: 50px; height: 50px; border-radius: 10px; overflow: hidden; margin-right: 15px; }
.item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.item-info { flex: 1; }
.item-title { font-size: 14px; color: #1e293b; margin: 4px 0; }
.item-category { font-size: 10px; font-weight: bold; color: #1EB53A; text-transform: uppercase; }
.delete-btn { background: none; border: none; font-size: 18px; cursor: pointer; padding: 5px; }

/* STYLE DU BOUTON FLOTTANT (FAB) */
.fab-button {
  position: fixed;
  right: 20px;
  bottom: 90px; /* Juste au-dessus de la barre de navigation */
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #104171; /* Bleu Burundi News */
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16,65,113,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.bottom-nav { position: fixed; bottom: 0; width: 100%; background: white; display: flex; justify-content: space-around; padding: 15px 0; border-top: 1px solid #f1f5f9; }
.nav-item { text-decoration: none; font-size: 20px; color: #94a3b8; }
.nav-item.active { color: #104171; }
.red-text { color: #CE1126; }
</style>