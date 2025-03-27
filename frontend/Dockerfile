# frontend/Dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install && npm run build

EXPOSE 80

CMD ["npx", "serve", "dist", "-l", "80"]
