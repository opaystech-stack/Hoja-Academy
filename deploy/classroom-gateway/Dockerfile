FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js identity-api.js modules.registry.json ./
ENV PORT=9001
EXPOSE 9001
CMD ["node", "server.js"]
