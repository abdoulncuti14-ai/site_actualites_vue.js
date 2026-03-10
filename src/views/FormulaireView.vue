<template>
  <!--
    FormulaireView.vue
    ✅ Ce composant redirige automatiquement vers LoginView
    Il existait dans le router original mais le fichier était absent.
    On le remplace par une redirection propre.
  -->
  <div class="redirect-screen">
    <div class="spinner"></div>
    <p>Redirection...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirige immédiatement vers la page de login
  router.replace('/home')
})
</script>

<style scoped>
.redirect-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8fafc;
  gap: 16px;
  color: #64748b;
  font-size: 14px;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #CE1126;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>