FROM node:18.16.1 as build
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

FROM node:18.16.1-slim
USER node
EXPOSE 8080
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/dist ./dist
CMD [ "node", "dist/app.js" ]




