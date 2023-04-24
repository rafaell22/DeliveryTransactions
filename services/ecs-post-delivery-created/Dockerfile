FROM node:18.16-alpine

WORKDIR /srv
ADD . .
RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]
