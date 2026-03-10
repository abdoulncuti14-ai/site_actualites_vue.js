<template>
  <div id="app">
    <!--
      router-view affiche le composant correspondant à la route active.
      Toute la navigation est gérée dans router/index.js
    -->
    <router-view />
  </div>
</template>

<style>
/* ─────────────────────────────────────────────
   Styles globaux de l'application Burundi News
   ───────────────────────────────────────────── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #f4f4f4;
  color: #1e293b;
  /* ✅ Design mobile : largeur max centrée */
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scrollbar discrète */
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

/* Inputs globaux */
input, textarea, select, button {
  font-family: inherit;
}

/* Liens sans soulignement par défaut */
a {
  text-decoration: none;
  color: inherit;
}
</style>