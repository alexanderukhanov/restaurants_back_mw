FROM node:16.7.0

WORKDIR /app

COPY package.json ./app

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

# если так, для кеширования - то все горит

#COPY package.json ./app
#
#RUN npm install
#
#COPY . .

# контейнер бекенда не видит порт контейнера БД, разве что использовать --net host
