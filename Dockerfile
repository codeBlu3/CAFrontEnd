FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm cache clear --force && npm install
RUN npm install -g expo-cli

COPY app.json ./
#ENTRYPOINT ["npm", "start", "--web"]
#ENTRYPOINT ["npm", "start"]
#ENTRYPOINT ["npx", "expo", "start"]
ENTRYPOINT [ "expo", "start", "--web"]
#CMD ["web"]


