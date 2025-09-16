# Utiliser Node.js 18 Alpine (léger)
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port 3001
EXPOSE 3001

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Changer le propriétaire des fichiers
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Commande de démarrage
CMD ["node", "server.js"]
