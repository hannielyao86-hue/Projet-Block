TaskManager DApp
Application décentralisée de gestion de tâches sur Ethereum (réseau local Hardhat).

Prérequis

Node.js v16+
MetaMask (extension navigateur)


Installation
bashgit clone https://github.com/hannielyao86-hue/Projet-Block.git
cd taskmanager-dapp
npm install

Utilisation
1. Lancer le nœud local (terminal 1)
bashnpm run node
2. Déployer le contrat (terminal 2)
bashnpm run deploy:local
→ Copier l'adresse affichée dans frontend/app.js
3. Lancer le frontend (terminal 2)
bashnpm run front
→ Ouvrir http://localhost:3000

Configurer MetaMask
ChampValeurRéseauLocalhost 8545URL RPChttp://127.0.0.1:8545Chain ID31337

Importer un compte de test avec une clé privée affichée par npm run node.


Scripts disponibles
CommandeActionnpm run compileCompile le contratnpm run testLance les testsnpm run nodeDémarre le nœud localnpm run deploy:localDéploie le contratnpm run frontLance le frontend

Structure
contracts/          → Smart contract Solidity
scripts/            → Script de déploiement
test/               → Tests unitaires
frontend/           → Interface utilisateur
hardhat.config.js   → Configuration réseau
