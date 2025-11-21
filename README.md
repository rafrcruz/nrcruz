# NRCruz Monorepo (React + Express)

## Estrutura
- `backend/` — API Express com endpoint `GET /api/hello`.
- `frontend/` — App React (Vite) que consome o endpoint e exibe a mensagem.
- `.gitignore` — ignora builds, `node_modules` e arquivos `.env`.

## Pré-requisitos
- Node.js (npm incluso).

## Backend (Express)
1) Entre na pasta:
```bash
cd backend
```
2) Instale as dependências:
```bash
npm install
```
3) Configure o ambiente:
- Copie `.env.example` para `.env` e ajuste se necessário (porta padrão `3001`).
4) Rode em desenvolvimento (hot-reload com nodemon):
```bash
npm run dev
```
Ou produçao simples:
```bash
npm start
```
5) Endpoint disponível: `GET http://localhost:3001/api/hello` (responde `NRCruz app`).

## Frontend (React + Vite)
1) Entre na pasta:
```bash
cd frontend
```
2) Instale as dependências:
```bash
npm install
```
3) Configure o ambiente:
- Copie `.env.example` para `.env` e ajuste `VITE_API_BASE_URL` (padrão `http://localhost:3001`).
4) Rode em desenvolvimento:
```bash
npm run dev
```
5) Acesse a URL mostrada pelo Vite (ex.: `http://localhost:5173`). A página inicial busca o endpoint `/api/hello`, espera `NRCruz app` e exibe `Hello NRCruz app`.

## Ordem sugerida para levantar
1) Inicie o backend (`npm run dev` em `backend/`).
2) Depois o frontend (`npm run dev` em `frontend/`).

## Scripts de conveniência na raiz (opcional)
- `npm run dev:backend` — roda o backend em modo dev.
- `npm run dev:frontend` — roda o frontend em modo dev.
- `npm run install:all` — instala dependências de backend e frontend.
