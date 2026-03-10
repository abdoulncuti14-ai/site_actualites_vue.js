<template>
  <div class="feed-container">

    <!-- ── Bandeau Offline ── -->
    <div v-if="!isOnline" class="offline-banner">
      <span>📵 Mode hors-ligne</span>
      <span class="offline-sub">
        {{ lastSync ? 'Sync : ' + lastSync : 'Pas de sync' }}
        · {{ articles.length }} article{{ articles.length > 1 ? 's' : '' }} en cache
      </span>
    </div>

    <header class="red-header">
      <h1 class="logo-title">BURUNDI NEWS</h1>
      <button class="logout-btn" @click="handleLogout">Déconnexion</button>
    </header>

    <!-- Chargement -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <main class="content-area" v-else>

      <!-- Aucun cache disponible en offline -->
      <div v-if="!isOnline && articles.length === 0" class="empty-offline">
        <div class="empty-icon">📡</div>
        <p>Aucun article en cache.</p>
        <p class="empty-sub">Connectez-vous à Internet pour charger les articles.</p>
      </div>

      <div v-for="article in articles" :key="article.id" class="article-card">
        <div class="card-user-header">
          <div class="avatar-circle"></div>
          <span class="user-display-name">{{ article.auteur_nom }}</span>
          <span class="article-date">{{ article.date_published }}</span>
        </div>

        <div class="card-main-content">
          <h2 class="article-title">{{ article.titre }}</h2>
          <p class="article-snippet">{{ article.comment }}</p>
        </div>

        <div class="card-footer-actions">
          <button
            @click="toggleLocalLike(article.id)"
            :class="['footer-btn', { 'is-liked': likedIds.has(article.id) }]"
          >
            {{ likedIds.has(article.id) ? '❤️ Aimé' : '🤍 J\'aime' }}
          </button>

          <router-link :to="'/publication/' + article.id" class="footer-btn border-x">
            💬 {{ article.nb_commentaires }}
          </router-link>

          <!-- Supprimer : admin + online uniquement -->
          <button
            v-if="isAdmin && isOnline"
            @click="confirmDelete(article.id)"
            class="footer-btn delete-text"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- Pagination (online seulement) -->
      <div class="pagination" v-if="isOnline && totalPages > 1">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">‹</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
      </div>

      <!-- Info cache -->
      <div v-if="!isOnline && articles.length > 0" class="cache-info">
        📦 {{ articles.length }} article{{ articles.length > 1 ? 's' : '' }} depuis le cache local
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useOfflineCache } from '@/composables/useOfflineCache'

const router = useRouter()
const { isOnline, saveArticles, getArticles, getLastSync } = useOfflineCache()

const articles    = ref([])
const likedIds    = ref(new Set())
const loading     = ref(false)
const currentPage = ref(1)
const totalPages  = ref(1)
const lastSync    = ref(getLastSync())

const userJson = localStorage.getItem('user')
const user     = userJson ? JSON.parse(userJson) : null
const isAdmin  = computed(() => user?.is_staff || false)

const loadArticles = async (page = 1) => {
  loading.value = true

  if (isOnline.value) {
    try {
      const res = await axios.get(`/api/articles/?page=${page}`)
      articles.value   = res.data.results || []
      totalPages.value = Math.ceil((res.data.count || 0) / 10)
      currentPage.value = page
      // ✅ Mise en cache de la première page (articles les plus récents)
      if (page === 1) {
        saveArticles(articles.value)
        lastSync.value = getLastSync()
      }
    } catch (err) {
      // API inaccessible → fallback cache
      articles.value = getArticles()
    }
  } else {
    // ✅ Mode offline → lecture du cache
    articles.value = getArticles()
  }

  loading.value = false
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) loadArticles(page)
}

const toggleLocalLike = (id) => {
  const s = new Set(likedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  likedIds.value = s
}

const confirmDelete = async (id) => {
  if (!isAdmin.value || !isOnline.value) return
  if (confirm('Supprimer cet article et tous ses commentaires ?')) {
    try {
      await axios.delete(`/api/articles/${id}/`)
      loadArticles(currentPage.value)
    } catch (err) {
      alert('Erreur lors de la suppression.')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  localStorage.removeItem('user')
  router.push('/')
}

// Recharge automatiquement quand on revient en ligne
window.addEventListener('online', () => loadArticles())

onMounted(() => loadArticles())
</script>

<style scoped>
.feed-container { background-color: #f4f4f4; min-height: 100vh; }

.offline-banner {
  background: #1e293b; color: white;
  padding: 10px 16px;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; font-weight: 600;
  position: sticky; top: 0; z-index: 99;
}
.offline-sub { font-size: 11px; font-weight: 400; color: #94a3b8; }

.red-header {
  background-color: #CE1126; padding: 15px 20px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 50;
}
.logo-title { font-weight: 900; font-size: 20px; color: white; margin: 0; }
.logout-btn {
  background: rgba(255,255,255,.2); color: white;
  border: 1px solid rgba(255,255,255,.4);
  padding: 6px 14px; border-radius: 20px;
  font-size: 12px; cursor: pointer; font-weight: 600;
}

.loading-state { text-align: center; padding: 50px 20px; color: #666; }
.spinner {
  width: 32px; height: 32px; margin: 0 auto 12px;
  border: 3px solid #eee; border-top-color: #CE1126;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-offline { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-offline p { color: #64748b; font-size: 15px; }
.empty-sub { font-size: 13px !important; color: #94a3b8 !important; margin-top: 6px; }

.article-card {
  background: white; border-radius: 15px;
  margin: 16px auto; width: 90%; max-width: 500px;
  border: 1px solid #eee; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.card-user-header { display: flex; align-items: center; padding: 14px 16px; }
.avatar-circle {
  width: 38px; height: 38px; border-radius: 50%; margin-right: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #1EB53A, #0d8a2b);
}
.user-display-name { font-weight: bold; color: #333; flex: 1; font-size: 14px; }
.article-date { font-size: 11px; color: #aaa; }
.card-main-content { padding: 0 16px 14px; }
.article-title { font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 6px; }
.article-snippet { font-size: 13px; color: #666; line-height: 1.55; }
.card-footer-actions { display: flex; border-top: 1px solid #f1f5f9; background: #fafafa; }
.footer-btn {
  flex: 1; border: none; background: none; padding: 12px 0;
  cursor: pointer; color: #666; font-weight: 600; font-size: 13px;
  text-decoration: none; text-align: center; transition: background .15s;
}
.footer-btn:active { background: #f0f0f0; }
.border-x { border-left: 1px solid #eee; border-right: 1px solid #eee; }
.is-liked { color: #CE1126; }
.delete-text { color: #CE1126; }

.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; padding: 16px;
}
.pagination button {
  background: #104171; color: white; border: none;
  border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 15px;
}
.pagination button:disabled { opacity: .4; cursor: not-allowed; }
.pagination span { font-size: 13px; color: #666; }

.cache-info {
  text-align: center; padding: 12px 20px; font-size: 12px; color: #94a3b8;
  background: white; margin: 0 auto 20px; width: 90%; max-width: 500px;
  border-radius: 10px; border: 1px dashed #e2e8f0;
}
</style>