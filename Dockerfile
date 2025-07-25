FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY signaling-server.js ./

EXPOSE 3000

CMD ["npm", "start"]