<template>
    <div>
        <div class="field">
            <label for="name">NOM</label> 
           <input type="text" required  placeholder="votre nom" id="name" v-model.lazy="name"/>
        </div>
        <div class="field">

            <label for="postname">Prenom</label>
            <input type="text" required placeholder="votre prenom" id="postname" v-model.lazy="postname"/>
        </div>
        <div class="field">
            <label for="email">E-mail</label>
            <input type="email" required placeholder="votre email" id="email" v-model="email"/>

        </div>
        <div class="field">
            <label for="password">mot de passe</label>
            <input type="number" required placeholder="mot de passe" id="password" v-model.number="password"/>
        </div>
     
     
     <div class="field">
        <label for="pays">nationalite</label>
        <select v-model="pays" id="pays">
            <option value="Burundi">Burundi</option>
            <option value="Rwanda">Rwanda</option>
            <option value="congo">RDC</option>
        </select>
     </div>
     <div class="field">
        <label for="niveau_etude">niveau d'etude</label>
        <label for="Bacalaureat">
            <input value="Bacalaureat"  type="radio" v-model="niveau_etude"/>Bacalaureat
        </label>
        <label for="master">
            <input value="master" type="radio" v-model="niveau_etude"/>master
        </label>
         <label for="professorant">
            <input value="professorant" type="radio" v-model="niveau_etude"/>professorant
        </label>
        
        
    </div>
   </div>
<button @click="gute">Enregistrer</button>
<button @click="yoo">Supprimer</button>
<hr>
<table>
    <tr>
        <td>Nom</td>
        <td>{{name}}</td>
    </tr>
    <tr>
        <td>Prenom</td>
        <td>{{ postname }}</td>
    </tr>
    <tr>
        <td>email</td>
        <td>{{ email }}</td>
    </tr>
    <tr>
        <td>password</td>
        <td>{{ password }}</td>
    </tr>
    <tr>
        <td>pays</td>
        <td>{{ pays }}</td>
    </tr>
    <tr>
        <td>niveau_etude</td>
        <td>{{ niveau_etude }}</td>
    </tr>
</table>
  

   
</template>
<style>
.field{
    display: flex;
    flex-direction: column;

}

</style>
<script setup>
import { ref } from 'vue'

// 1. Définition des variables avec des chaînes vides propres
const name = ref("")
const postname = ref("")
const email = ref("")
const password = ref("")
const pays = ref("")
const niveau_etude = ref("")


const STORAGE_KEY = "kivuko_data"


const hano = JSON.parse(localStorage.getItem(STORAGE_KEY))

if (hano) {
    name.value = hano.name || ""
    postname.value = hano.postname || ""
    email.value = hano.email || ""
    password.value = hano.password || ""
    pays.value = hano.pays || ""
    niveau_etude.value = hano.niveau_etude || ""
}


function gute() {
    const data = {
        name: name.value,
        postname: postname.value,
        email: email.value,
        password: password.value,
        pays: pays.value,
        niveau_etude: niveau_etude.value 
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    alert("Données enregistrées ! ")
}


function yoo() {
    localStorage.removeItem(STORAGE_KEY)
    
   
    name.value = ""
    postname.value = ""
    email.value = ""
    password.value = ""
    pays.value = ""
    niveau_etude.value = ""
    
    alert("Données supprimées !")
}
</script>