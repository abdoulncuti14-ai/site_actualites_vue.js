<template>
  <div class="login-container">
    <div class="card">
        <div class="logo">BURUNDI NEWS</div>
        <div class="subtitle">Kaze - Bienvenue</div>
        <input type="text" placeholder="Nom d'utilisateur">
        <input type="password" placeholder="Mot de passe">
        <router-link to="/flux">
          <button>SE CONNECTER</button>
        </router-link>
        <div class="link">Mot de passe oublié ? | Créer un compte</div>
    </div>
  </div>
</template>

<style scoped>
/* Le mot "scoped" permet de garder ces styles uniquement pour cette page */
.login-container {
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh;
}
.card { 
    background: white; 
    padding: 40px; 
    border-radius: 20px; 
    box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
    width: 350px; 
    text-align: center; 
    border-top: 6px solid #CE1126; 
}
.logo { font-size: 26px; font-weight: bold; color: #1EB53A; margin-bottom: 5px; }
.subtitle { color: #CE1126; font-size: 14px; margin-bottom: 30px; letter-spacing: 2px; }
input { 
    width: 100%; padding: 12px; margin: 10px 0; 
    border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; 
}
button { 
    width: 100%; padding: 12px; background: #1EB53A; color: white; 
    border: none; border-radius: 10px; font-weight: bold; cursor: pointer; 
}
.link { font-size: 12px; color: #666; margin-top: 20px; }
</style>