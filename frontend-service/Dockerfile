FROM node:20-alpine AS build
WORKDIR /app
COPY frontend-service/package.json package.json
RUN npm install
COPY frontend-service .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY frontend-service/package.json package.json
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY frontend-service/server.js ./server.js
EXPOSE 3000
CMD ["npm", "run", "start"]

