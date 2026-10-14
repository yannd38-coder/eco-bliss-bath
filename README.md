<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Eco Bliss Bath — Application & Tests automatisés (Cypress)

Ce projet contient l'application e-commerce **Eco Bliss Bath** ainsi que sa suite de tests automatisés développée avec **Cypress**.

---

## 1. Lancement du back end et de l'application

### Préréquis
- **Node.js** (version 16 ou supérieure)
- **Docker**

### Démarrer le serveur de développement
### Démarrage
1. À la racine du projet (`Eco-Bliss-Bath-V2-main`), lancez le backend et la base de données :
   ```bash
   docker compose up -d
   ```
2. Ouvrez un terminal dans le dossier `frontend`.
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Lancez l'application avec Angular CLI :
   ```bash
   npm start
   ```
5. Ouvrez votre navigateur sur `http://localhost:8080/`.

---

## 2. Procédure de lancement des tests Cypress

Assurez-vous que l'application et le backend sont bien en cours d'exécution avant de lancer les tests.
Placez-vous dans le dossier `frontend`

### Mode interactif (avec interface graphique)
Pour ouvrir la fenêtre Cypress et choisir les tests à exécuter visuellement :
```bash
npx cypress open
```

### Mode automatique (en ligne de commande)
Pour lancer tous les tests automatiquement en arrière-plan :
```bash
npx cypress run
```

---

## 3. Génération des rapports de test

Lors de l'exécution automatique (`npx cypress run`) :
- Le bilan de chaque fichier de test s'affiche directement dans le terminal à la fin de l'exécution.
- En cas d'échec d'un test, Cypress génère automatiquement :
  - Une capture d'écran dans le dossier `cypress/screenshots`.
  - Une vidéo de l'exécution dans le dossier `cypress/videos`.

---

##  4. Organisation des fichiers de tests

Les tests sont classés dans le dossier `cypress/e2e` :

- `api/api.cy.ts` : Tests des requêtes API (authentifié, refus hors connexion avec garantie d'absence de session, produits, avis, limites panier).
- `functional/smoke.cy.ts` : Smoke tests (boutons de navigation et affichage du stock en mode connecté et déconnecté).
- `functional/connexion.cy.ts` : Tests du formulaire de connexion (identifiants valides, mot de passe incorrect, compte inexistant).
- `functional/panier.cy.ts` : Tests du panier (limites de quantité, suppression) avec nettoyage en fin de suite (after).
- `functional/commande_complete.cy.ts` : Test du tunnel d'achat complet, vérification de décrémentation du stock en BDD et nettoyage (after).
- `functional/xss_review.cy.ts` : Test de sécurité contre les failles XSS dans les avis (création, persistance BDD, réaffichage et non-exécution JS).
```

