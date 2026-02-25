<template>
  <div class="publication-container">
    <router-link to="/flux" class="btn-back">← Retour au flux</router-link>
    <div class="main-article">
      <h1>Développement au Burundi</h1>
      <p>viva communication.</p>
    </div>
    <div class="comment-section">
      <h3>Commentaires</h3>
      <div class="comment"><strong>Alice M.</strong>: Très fier de notre pays !</div>
      <div class="comment"><strong>Marc O.</strong>: Merci pour ces informations.</div>
      <textarea placeholder="Exprimez-vous ici..."></textarea>
      <router-link to="/flux">
        <button class="btn-send">PUBLIER</button>
      </router-link>
      <div style="clear:both;"></div>
    </div>
  </div>
</template>

<style scoped>
.publication-container { padding: 20px; background: white; min-height: 100vh; }
.btn-back { display: inline-block; color: #CE1126; text-decoration: none; margin-bottom: 20px; font-weight: bold; }
.main-article { border-left: 6px solid #1EB53A; padding-left: 20px; margin-bottom: 40px; }
.comment-section { background: #f9f9f9; padding: 20px; border-radius: 15px; }
.comment { background: white; padding: 15px; border-radius: 10px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.comment strong { color: #1EB53A; }
textarea { width: 100%; height: 80px; padding: 10px; border-radius: 10px; border: 1px solid #ddd; margin-top: 20px; box-sizing: border-box; }
.btn-send { background: #CE1126; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; margin-top: 10px; font-weight: bold; float: right; }
</style>