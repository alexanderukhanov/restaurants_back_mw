FROM node:16.7.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3001

CMD npm run build && npx sequelize-cli db:migrate --env production && npm run start

