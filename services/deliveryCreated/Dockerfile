FROM mhart/alpine-node:16.4.2

WORKDIR /srv
ADD . .
RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]
