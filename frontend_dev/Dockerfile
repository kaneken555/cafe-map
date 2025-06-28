FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
# COPY package.json ./


RUN npm install

COPY . .


# ポート公開（Vite）
EXPOSE 5173

CMD ["npm", "run", "dev"]
