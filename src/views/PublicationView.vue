<template>
  <div class="detail-page" v-if="article">

    <!-- ── Bandeau Offline ── -->
    <div v-if="!isOnline" class="offline-banner">
      📵 Mode hors-ligne · Commentaires depuis le cache (max {{ MAX_COMMENTS }})
    </div>

    <header class="top-nav">
      <button @click="$router.push('/flux')" class="back-link">‹</button>
      <span class="center-title">Article</span>
    </header>

    <div class="article-body">
      <span class="article-tag">{{ article.date_published }}</span>
      <p class="author-tag">Par {{ article.auteur_nom }}</p>
      <h1>{{ article.titre }}</h1>
      <p class="main-text">{{ article.comment }}</p>
    </div>

    <!-- ── Section commentaires ── -->
    <div class="comment-section">
      <h3>💬 Commentaires ({{ totalCommentaires }})</h3>

      <div v-if="loadingComments" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- Liste commentaires -->
      <div v-for="c in commentaires" :key="c.id" class="comment-box">
        <div class="comment-header">
          <span class="com-user">{{ c.auteur_nom }}</span>
          <span class="com-date">{{ formatDate(c.date_published) }}</span>
        </div>
        <p class="com-content">{{ c.contenu }}</p>

        <!-- Bouton répondre (online uniquement) -->
        <button
          v-if="isOnline"
          class="reply-toggle"
          @click="toggleReply(c.id)"
        >
          ↩ Répondre {{ c.responses?.length ? `(${c.responses.length})` : '' }}
        </button>
        <span v-else class="reply-offline">↩ {{ c.responses?.length || 0 }} réponse(s)</span>

        <!-- Réponses imbriquées -->
        <div v-if="c.responses && c.responses.length" class="replies-list">
          <div v-for="r in c.responses" :key="r.id" class="reply-box">
            <div class="comment-header">
              <span class="com-user reply-user">↩ {{ r.auteur_nom }}</span>
              <span class="com-date">{{ formatDate(r.date_published) }}</span>
            </div>
            <p class="com-content">{{ r.contenu }}</p>
          </div>
        </div>

        <!-- Zone réponse inline (online uniquement) -->
        <div v-if="isOnline && replyingTo === c.id" class="reply-input-area">
          <input
            v-model="txtReponse"
            placeholder="Votre réponse..."
            @keyup.enter="submitReply(c.id)"
          >
          <div class="reply-btns">
            <button @click="submitReply(c.id)" class="send-button">Envoyer</button>
            <button @click="replyingTo = null" class="cancel-button">Annuler</button>
          </div>
        </div>
      </div>

      <!-- Message si pas de commentaires en cache -->
      <div v-if="!loadingComments && commentaires.length === 0" class="no-comments">
        <p>{{ isOnline ? 'Aucun commentaire. Soyez le premier !' : 'Aucun commentaire en cache.' }}</p>
      </div>

      <!-- Info cache offline -->
      <div v-if="!isOnline && commentaires.length > 0" class="cache-info">
        📦 {{ commentaires.length }} commentaire{{ commentaires.length > 1 ? 's' : '' }} depuis le cache
      </div>

      <!-- Zone nouveau commentaire (online uniquement) -->
      <div v-if="isOnline" class="input-area">
        <input
          v-model="txtCommentaire"
          placeholder="Écrire un commentaire..."
          @keyup.enter="submitComment"
        >
        <button
          @click="submitComment"
          class="send-button"
          :disabled="!txtCommentaire.trim()"
        >
          Envoyer
        </button>
      </div>

      <!-- Message offline pour zone de commentaire -->
      <div v-else class="offline-comment-msg">
        🔒 Commentaires désactivés en mode hors-ligne
      </div>

    </div>
  </div>

  <div v-else class="loading-full">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useOfflineCache } from '@/composables/useOfflineCache'

const route  = useRoute()
const router = useRouter()
const {
  isOnline,
  saveCommentaires,
  getCommentaires,
  MAX_COMMENTS
} = useOfflineCache()

const article        = ref(null)
const commentaires   = ref([])
const txtCommentaire = ref('')
const txtReponse     = ref('')
const replyingTo     = ref(null)
const loadingComments = ref(false)

const totalCommentaires = computed(() =>
  commentaires.value.reduce((sum, c) => sum + 1 + (c.responses?.length || 0), 0)
)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit'
  })
}

const loadData = async () => {
  const id = route.params.id
  loadingComments.value = true

  if (isOnline.value) {
    // ── Mode online : appel API ──
    try {
      const [artRes, comRes] = await Promise.all([
        axios.get(`/api/articles/${id}/`),
        axios.get(`/api/commentaires/?article=${id}`)
      ])
      article.value = artRes.data

      // Filtre les commentaires racines uniquement
      const rootComments = (comRes.data.results || comRes.data).filter(c => !c.parent)
      commentaires.value = rootComments

      // ✅ Mise en cache des MAX_COMMENTS premiers commentaires
      saveCommentaires(id, rootComments)

    } catch (e) {
      console.error('Erreur API', e)
      // Fallback : essaie de charger depuis le cache
      commentaires.value = getCommentaires(id)
      if (!article.value) router.push('/flux')
    }

  } else {
    // ── Mode offline : lecture du cache ──
    // L'article vient du cache des articles (HomeView l'a déjà mis en cache)
    const { getArticles } = useOfflineCache()
    const cachedArticles = getArticles()
    article.value = cachedArticles.find(a => a.id === parseInt(id)) || null

    // Commentaires depuis le cache
    commentaires.value = getCommentaires(id)

    if (!article.value) router.push('/flux')
  }

  loadingComments.value = false
}

const submitComment = async () => {
  if (!txtCommentaire.value.trim() || !isOnline.value) return
  try {
    await axios.post('/api/commentaires/', {
      contenu: txtCommentaire.value,
      article: article.value.id
    })
    txtCommentaire.value = ''
    loadData()
  } catch (err) {
    if (err.response?.status === 401) {
      alert('Vous devez être connecté pour commenter.')
      router.push('/')
    } else {
      alert('Erreur d\'envoi du commentaire.')
    }
  }
}

const submitReply = async (parentId) => {
  if (!txtReponse.value.trim() || !isOnline.value) return
  try {
    await axios.post('/api/commentaires/', {
      contenu: txtReponse.value,
      article: article.value.id,
      parent: parentId
    })
    txtReponse.value = ''
    replyingTo.value = null
    loadData()
  } catch (err) {
    alert('Erreur d\'envoi de la réponse.')
  }
}

const toggleReply = (id) => {
  replyingTo.value = replyingTo.value === id ? null : id
  txtReponse.value = ''
}

onMounted(loadData)
</script>

<style scoped>
.detail-page { background: #f9f9f9; min-height: 100vh; }

.offline-banner {
  background: #1e293b; color: #94a3b8;
  padding: 8px 16px; font-size: 12px; text-align: center;
}

.top-nav {
  display: flex; align-items: center;
  padding: 15px 20px; background: #CE1126; color: white;
  position: sticky; top: 0; z-index: 50;
}
.back-link {
  background: none; border: none; color: white;
  font-size: 24px; cursor: pointer; font-weight: bold; margin-right: 14px;
}
.center-title { font-weight: 700; font-size: 16px; }

.article-body { background: white; padding: 20px; margin-bottom: 8px; }
.article-tag { font-size: 11px; color: #aaa; display: block; margin-bottom: 4px; }
.author-tag { font-size: 13px; color: #1EB53A; font-weight: 600; margin-bottom: 8px; }
h1 { font-size: 20px; color: #1e293b; margin-bottom: 12px; line-height: 1.3; }
.main-text { font-size: 15px; color: #444; line-height: 1.7; }

.comment-section { padding: 20px; }
h3 { font-size: 15px; color: #1e293b; margin-bottom: 16px; }

.loading { text-align: center; padding: 20px; }
.loading-full { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.spinner {
  width: 28px; height: 28px; margin: 0 auto;
  border: 3px solid #eee; border-top-color: #CE1126;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.comment-box {
  background: white; padding: 14px; border-radius: 12px;
  margin-bottom: 12px; border: 1px solid #eee;
}
.comment-header {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 6px;
}
.com-user { font-weight: bold; color: #104171; font-size: 13px; }
.com-date { font-size: 11px; color: #aaa; }
.com-content { font-size: 14px; color: #444; line-height: 1.5; margin-bottom: 8px; }

.reply-toggle {
  background: none; border: none; color: #1EB53A;
  font-size: 12px; font-weight: 600; cursor: pointer; padding: 0;
}
.reply-offline { font-size: 12px; color: #94a3b8; }

.replies-list {
  margin-top: 10px; border-left: 3px solid #1EB53A; padding-left: 12px;
}
.reply-box {
  background: #f8fafc; padding: 10px;
  border-radius: 8px; margin-bottom: 8px;
}
.reply-user { color: #1EB53A; }

.reply-input-area { margin-top: 10px; }
.reply-input-area input {
  width: 100%; padding: 10px; box-sizing: border-box;
  border: 1.5px solid #1EB53A; border-radius: 10px;
  font-size: 14px; margin-bottom: 8px;
}
.reply-btns { display: flex; gap: 8px; }
.cancel-button {
  background: none; border: 1px solid #ddd;
  padding: 8px 16px; border-radius: 20px;
  cursor: pointer; font-size: 13px; color: #666;
}

.no-comments { text-align: center; padding: 20px; color: #94a3b8; font-size: 14px; }

.cache-info {
  text-align: center; padding: 10px; font-size: 12px; color: #94a3b8;
  background: white; border-radius: 10px;
  border: 1px dashed #e2e8f0; margin-bottom: 12px;
}

.input-area {
  display: flex; gap: 10px; margin-top: 16px;
  background: white; padding: 12px;
  border-radius: 12px; border: 1px solid #eee;
}
.input-area input {
  flex: 1; padding: 10px 16px;
  border-radius: 25px; border: 1px solid #ddd; font-size: 14px;
}
.input-area input:focus { outline: none; border-color: #104171; }
.send-button {
  background: #1EB53A; color: white; border: none;
  padding: 0 20px; border-radius: 25px;
  font-weight: bold; cursor: pointer; font-size: 14px; white-space: nowrap;
}
.send-button:disabled { opacity: .5; cursor: not-allowed; }

.offline-comment-msg {
  text-align: center; padding: 14px; margin-top: 16px;
  background: #f1f5f9; border-radius: 12px;
  font-size: 13px; color: #64748b;
}
</style>