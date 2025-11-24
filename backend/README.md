# Backend

## Ambiente
- Copie `.env.example` para `.env`.
- Defina `PORT` se quiser trocar a porta (padrão `3001`).
- Defina `DATABASE_URL` com a string do Postgres (ex.: string do Neon com `sslmode=require`).

## Scripts úteis
- `npm run dev`: modo desenvolvimento.
- `npm start`: modo produção simples.
- `npm run db:migrate`: aplica migrations usando `DATABASE_URL`.
- `npm run db:migrate:rollback`: desfaz a última migration.
- `npm test`: roda os testes uma vez (sem modo watch).
- `npm run test:watch`: modo watch do Vitest.

## Migrations
- Ferramenta: `node-pg-migrate` (migrations em `db/migrations`).
- Migration inicial cria a tabela `hello_messages` e insere `NRCruz app` como mensagem padrão.
- Endpoint `/api/hello` permanece sem dependência de banco; o banco só será usado quando o repositório for chamado em futuras etapas.
