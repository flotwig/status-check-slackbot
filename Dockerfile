FROM node:14.9.0

COPY ./ /app

WORKDIR /app

RUN npm install && npm run build

CMD npm run start
