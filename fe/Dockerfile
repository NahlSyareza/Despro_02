FROM node:alpine
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
EXPOSE 2002
RUN npm run build
CMD ["npm", "run", "start"]
