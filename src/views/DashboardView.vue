<template>
  <div class="dashboard-wrapper">
    <div class="top-bar">
        <span>Admin Dashboard</span>
        <router-link to="/" class="logout-link">Déconnexion</router-link>
    </div>

    <div class="sidebar-content">
        <div class="stat-card">
            <h2 style="margin:0;">10 Articles</h2>
            <p style="margin:5px 0 0; opacity: 0.9;">Actifs sur la plateforme</p>
        </div>

        <h3>Liste des Utilisateurs</h3>
        
        <div class="table-admin">
            <div class="row">
                <span class="user-name">Abdoul</span>
                <span class="badge badge-admin">ADMIN</span>
            </div>
            <div class="row">
                <span class="user-name">Jean de Dieu</span>
                <span class="badge badge-user">LECTEUR</span>
            </div>
            <div class="row">
                <span class="user-name">Sarah N.</span>
                <span class="badge badge-user">LECTEUR</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView'
}
</script>

<style scoped>

.dashboard-wrapper {
    min-height: 100vh;
    background: #f4f7f6;
}

.top-bar { 
    background: #333; 
    color: white; 
    padding: 15px 30px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
}

.logout-link {
    font-size: 12px; 
    color: white;
    text-decoration: none;
    opacity: 0.8;
}

.logout-link:hover {
    opacity: 1;
}

.sidebar-content { 
    padding: 30px; 
}

.stat-card { 
    background: #1EB53A; 
    color: white; 
    padding: 20px; 
    border-radius: 15px; 
    margin-bottom: 30px; 
}

.table-admin { 
    background: white; 
    border-radius: 15px; 
    overflow: hidden; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
}

.row { 
    display: flex; 
    justify-content: space-between; 
    padding: 15px 20px; 
    border-bottom: 1px solid #eee; 
    align-items: center; 
}

.row:last-child { 
    border-bottom: none; 
}

.user-name { 
    font-weight: bold; 
    color: #333; 
}

.badge { 
    padding: 5px 12px; 
    border-radius: 20px; 
    font-size: 12px; 
    font-weight: bold; 
}

.badge-admin { 
    background: #CE1126; 
    color: white; 
}

.badge-user { 
    background: #eee; 
    color: #666; 
}
</style>