<template>
  <div class="flux-page">
    <header>BURUNDI NEWS</header>
    <div class="container">
      <div class="post">
        <div class="post-header">
          <div class="avatar"></div>
          <div class="author">Jean-Marie N.</div>
        </div>
        <div class="post-content">
          Le Burundi est un pays magnifique avec des paysages incroyables. Voici une mise à jour sur les projets de développement à Bujumbura.
        </div>
        <div class="post-footer">
          <div class="action">J'aime</div>
          <router-link to="/publication" class="action-btn">
            <div class="action">Commenter (0)</div>
          </router-link>
          <div class="action admin-action">Supprimer</div>
        </div>
      </div>
      <div class="post">
        <div class="post-header">
          <div class="avatar"></div>
          <div class="author">Admin News</div>
        </div>
        <div class="post-content">
          Célébration de la fête nationale : les préparatifs avancent bien dans toutes les provinces du pays.
        </div>
        <div class="post-footer">
          <div class="action">J'aime</div>
          <router-link to="/publication" class="action-btn">
            <div class="action">Commenter (0)</div>
          </router-link>
          <div class="action admin-action">Supprimer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header { background: #CE1126; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 20px; border-bottom: 4px solid #1EB53A; position: sticky; top: 0; }
.container { max-width: 550px; margin: 20px auto; padding: 0 15px; }
.post { background: white; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 20px; overflow: hidden; }
.post-header { padding: 15px; display: flex; align-items: center; border-bottom: 1px solid #f0f0f0; }
.avatar { width: 40px; height: 40px; background: #1EB53A; border-radius: 50%; margin-right: 12px; }
.author { font-weight: bold; color: #333; }
.post-content { padding: 20px; color: #444; line-height: 1.5; }
.post-footer { display: flex; border-top: 1px solid #f0f0f0; background: #fafafa; }
.action { flex: 1; text-align: center; padding: 12px; color: #666; cursor: pointer; font-size: 14px; transition: 0.2s; }
.action:hover { color: #CE1126; background: #f0f0f0; }
.admin-action { color: #CE1126; font-weight: bold; }
.action-btn { flex: 1; text-decoration: none; display: flex; }
</style>