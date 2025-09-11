FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install ts-node

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["npm", "run", "start"]