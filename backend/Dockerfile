FROM node:18-bookworm-slim


# Met à jour la base Debian pour réduire les vulnérabilités système
RUN apt-get update && apt-get upgrade -y && apt-get clean

# Crée le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances Node.js
RUN npm install

# Copie le reste du code de l'application
COPY . .

# Expose le port utilisé par l'application
EXPOSE 3000

# Démarre l'application
CMD [ "node", "app.js" ]
