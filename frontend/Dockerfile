FROM node:lts
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"] 