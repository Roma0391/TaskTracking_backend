FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install ts-node

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/package.json /app/prisma /app/package-lock.json ./
RUN npm install --production

COPY --from=build /app/dist ./dist

RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "run", "start"]