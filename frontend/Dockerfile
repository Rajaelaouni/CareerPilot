FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install          # ← cette ligne est obligatoire

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]