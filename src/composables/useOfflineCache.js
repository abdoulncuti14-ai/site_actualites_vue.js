/**
 * useOfflineCache.js
 * ─────────────────────────────────────────────
 * Service réutilisable pour la gestion du cache offline
 * Utilise localStorage pour stocker :
 *   - 10 articles maximum
 *   - 3 commentaires par article maximum
 *
 * Usage dans un composant Vue :
 *   import { useOfflineCache } from '@/composables/useOfflineCache'
 *   const cache = useOfflineCache()
 */

import { ref } from 'vue'

// ── Constantes de configuration ──
const MAX_ARTICLES   = 10
const MAX_COMMENTS   = 3
const KEY_ARTICLES   = 'cache_articles'
const KEY_COMMENTS   = 'cache_comments'   // objet { articleId: [commentaires] }
const KEY_TIMESTAMP  = 'cache_timestamp'

export function useOfflineCache() {

  // ── État réactif de la connectivité ──
  const isOnline = ref(navigator.onLine)

  // Écoute les changements de connectivité
  window.addEventListener('online',  () => { isOnline.value = true  })
  window.addEventListener('offline', () => { isOnline.value = false })

  // ─────────────────────────────────────────────
  // ARTICLES
  // ─────────────────────────────────────────────

  /**
   * Sauvegarde les articles en cache (max 10)
   * Garde toujours les plus récents
   */
  const saveArticles = (articles) => {
    try {
      const limited = articles.slice(0, MAX_ARTICLES)
      localStorage.setItem(KEY_ARTICLES, JSON.stringify(limited))
      localStorage.setItem(KEY_TIMESTAMP, new Date().toISOString())
    } catch (e) {
      console.warn('Cache articles : erreur localStorage', e)
    }
  }

  /**
   * Lit les articles depuis le cache
   * Retourne [] si aucun cache disponible
   */
  const getArticles = () => {
    try {
      const raw = localStorage.getItem(KEY_ARTICLES)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  }

  // ─────────────────────────────────────────────
  // COMMENTAIRES
  // ─────────────────────────────────────────────

  /**
   * Sauvegarde les commentaires d'un article (max 3)
   * @param {number} articleId
   * @param {Array}  commentaires
   */
  const saveCommentaires = (articleId, commentaires) => {
    try {
      const raw  = localStorage.getItem(KEY_COMMENTS)
      const all  = raw ? JSON.parse(raw) : {}
      all[articleId] = commentaires.slice(0, MAX_COMMENTS)
      localStorage.setItem(KEY_COMMENTS, JSON.stringify(all))
    } catch (e) {
      console.warn('Cache commentaires : erreur localStorage', e)
    }
  }

  /**
   * Lit les commentaires d'un article depuis le cache
   * @param {number} articleId
   * @returns {Array}
   */
  const getCommentaires = (articleId) => {
    try {
      const raw = localStorage.getItem(KEY_COMMENTS)
      if (!raw) return []
      const all = JSON.parse(raw)
      return all[articleId] || []
    } catch (e) {
      return []
    }
  }

  // ─────────────────────────────────────────────
  // UTILITAIRES
  // ─────────────────────────────────────────────

  /**
   * Retourne la date/heure de la dernière mise à jour du cache
   */
  const getLastSync = () => {
    const ts = localStorage.getItem(KEY_TIMESTAMP)
    if (!ts) return null
    return new Date(ts).toLocaleString('fr-FR', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    })
  }

  /**
   * Vide tout le cache offline
   */
  const clearCache = () => {
    localStorage.removeItem(KEY_ARTICLES)
    localStorage.removeItem(KEY_COMMENTS)
    localStorage.removeItem(KEY_TIMESTAMP)
  }

  /**
   * Vérifie si un cache articles existe
   */
  const hasCache = () => {
    return !!localStorage.getItem(KEY_ARTICLES)
  }

  return {
    isOnline,
    // Articles
    saveArticles,
    getArticles,
    // Commentaires
    saveCommentaires,
    getCommentaires,
    // Utilitaires
    getLastSync,
    clearCache,
    hasCache,
    // Constantes exposées
    MAX_ARTICLES,
    MAX_COMMENTS,
  }
}