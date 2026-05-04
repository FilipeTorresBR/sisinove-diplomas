FROM node:20-alpine

# Instalamos as dependências que o Prisma precisa para rodar no Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./

# Forçamos o registro oficial para evitar os timeouts que tivemos antes
RUN npm config set registry https://registry.npmjs.org/
RUN npm install

COPY . .

# O Prisma precisa gerar o cliente compatível com o Alpine (linux-musl)
RUN npx prisma generate

EXPOSE 4001

# Mantemos o comando original
CMD ["sh", "-c", "npx prisma db push && npm run seed && npm run start"]