# Utiliser Node.js
FROM node:18

# Créer le dossier de travail
WORKDIR /app

# Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5000

# Lancer le serveur
CMD ["npm", "start"]