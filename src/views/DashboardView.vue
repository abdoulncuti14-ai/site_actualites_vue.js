<template>
  <div class="admin-container">
    <header class="admin-header">
      <div class="header-content">
        <div>
          <h1>Dashboard <span class="red-text">Admin</span></h1>
          <p class="admin-name">👤 {{ currentUser?.username }}</p>
        </div>
        <button class="logout-btn" @click="handleLogout">Déconnexion</button>
      </div>
    </header>

    <!-- Stats rapides -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-val">{{ articles.length }}</div>
        <div class="stat-lbl">Articles</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">{{ totalCommentaires }}</div>
        <div class="stat-lbl">Commentaires</div>
      </div>
    </div>

    <main class="admin-list">
      <div v-if="loading" class="loading">Chargement...</div>

      <div v-for="article in articles" :key="article.id" class="list-item">
        <div class="item-icon">📰</div>
        <div class="item-info">
          <span class="item-author">{{ article.auteur_nom }}</span>
          <h3 class="item-title">{{ article.titre }}</h3>
          <span class="item-date">{{ article.date_published }} · {{ article.nb_commentaires }} commentaires</span>
        </div>
        <button class="delete-btn" @click="deleteArticle(article.id)" title="Supprimer">🗑️</button>
      </div>

      <div v-if="!loading && articles.length === 0" class="empty-state">
        <p>Aucun article pour le moment.</p>
      </div>
    </main>

    <!-- Bouton flottant pour ajouter un article -->
    <button class="fab-button" @click="$router.push('/add-article')" title="Nouvel article">+</button>

    <nav class="bottom-nav">
      <router-link to="/flux" class="nav-item" title="Flux">🏠</router-link>
      <div class="nav-item active" title="Dashboard">📊</div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const articles = ref([])
const loading = ref(false)

// ✅ Récupération de l'utilisateur connecté
const userJson = localStorage.getItem('user')
const currentUser = userJson ? JSON.parse(userJson) : null

// ✅ Guard : si pas admin → redirection (double sécurité côté frontend)
if (!currentUser?.is_staff) {
  router.push('/flux')
}

const totalCommentaires = computed(() =>
  articles.value.reduce((sum, a) => sum + (a.nb_commentaires || 0), 0)
)

const loadArticles = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/articles/')
    articles.value = response.data.results || response.data
  } catch (err) {
    console.error('Erreur de chargement', err)
    if (err.response?.status === 401) router.push('/')
  } finally {
    loading.value = false
  }
}

const deleteArticle = async (id) => {
  if (confirm('Supprimer cet article ? Tous ses commentaires seront également supprimés.')) {
    try {
      await axios.delete(`/api/articles/${id}/`)
      loadArticles()
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Vous n\'avez pas la permission de supprimer cet article.')
      } else {
        alert('Erreur lors de la suppression.')
      }
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(loadArticles)
</script>

<style scoped>
.admin-container { background-color: #f8fafc; min-height: 100vh; padding-bottom: 80px; }

.admin-header { padding: 20px; background: white; border-bottom: 1px solid #f1f5f9; }
.header-content { display: flex; align-items: center; justify-content: space-between; }
h1 { font-size: 20px; color: #1e293b; margin: 0; }
.admin-name { font-size: 12px; color: #64748b; margin-top: 2px; }
.red-text { color: #CE1126; }

.logout-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  color: #CE1126;
  cursor: pointer;
  font-weight: 600;
}

.stats-row {
  display: flex;
  gap: 12px;
  padding: 16px;
}
.stat-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid #f1f5f9;
}
.stat-val { font-size: 24px; font-weight: 800; color: #104171; }
.stat-lbl { font-size: 12px; color: #64748b; margin-top: 4px; }

.loading { text-align: center; padding: 30px; color: #999; }
.empty-state { text-align: center; padding: 40px; color: #94a3b8; }

.list-item {
  background: white;
  margin: 8px 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border: 1px solid #f1f5f9;
}
.item-icon { font-size: 28px; margin-right: 14px; }
.item-info { flex: 1; }
.item-author { font-size: 11px; font-weight: bold; color: #1EB53A; text-transform: uppercase; }
.item-title { font-size: 14px; color: #1e293b; margin: 3px 0; font-weight: 600; }
.item-date { font-size: 11px; color: #94a3b8; }
.delete-btn { background: none; border: none; font-size: 20px; cursor: pointer; padding: 6px; opacity: 0.6; transition: opacity .2s; }
.delete-btn:hover { opacity: 1; }

.fab-button {
  position: fixed;
  right: 20px;
  bottom: 90px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #104171;
  color: white;
  font-size: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(16,65,113,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: transform .2s;
}
.fab-button:active { transform: scale(.95); }

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 15px 0;
  border-top: 1px solid #f1f5f9;
}
.nav-item { text-decoration: none; font-size: 22px; color: #94a3b8; }
.nav-item.active { color: #104171; }
</style>