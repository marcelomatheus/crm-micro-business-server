FROM node:22

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]