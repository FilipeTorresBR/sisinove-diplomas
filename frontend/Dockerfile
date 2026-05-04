FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
COPY . .
# O pulo do gato: dar permissão manual para a pasta bin do node_modules
RUN chmod -R +x node_modules/.bin
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80