# Sisinove Diplomas — Sistema de Registro de Diplomas Sisinove

Sistema completo para registrar diplomas emitidos, controlar envio aos polos, anexar comprovantes, gerar relatórios por polo/cidade e exportar PDF/CSV.

## Stack

- Front-end: React + Vite + React Router + Recharts
- Back-end: Node.js + Express + Prisma ORM
- Banco: PostgreSQL
- Armazenamento de anexos: diretório local (`backend/uploads`)
- Deploy local/servidor: Docker Compose

## Módulos

- Autenticação com JWT
- Perfis: admin, secretaria, polo
- Cadastro de polos/cidades
- Cadastro, edição, exclusão e consulta de diplomas
- Filtros por polo, cidade, curso, status e período
- Relatórios consolidados por polo/cidade/geral
- Dashboard com indicadores e gráficos
- Upload de anexos do diploma/AR/comprovantes
- Exportação CSV e PDF
- Impressão de comprovante de registro

## Acesso inicial

- E-mail: `admin@sisinove.com.br`
- Senha: `123456`

## Como executar

```bash
docker compose up --build
```

- Front-end: http://localhost:8080
- API: http://localhost:4000/api/health
