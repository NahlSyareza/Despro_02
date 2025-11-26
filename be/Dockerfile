FROM node:alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
EXPOSE 2001
CMD ["node", "index.js"]