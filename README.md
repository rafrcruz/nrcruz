# NRCruz Monorepo (React + Express)

## Estrutura
- `backend/` â€” API Express com endpoint `GET /api/hello`.
- `frontend/` â€” App React (Vite) que consome o endpoint e exibe a mensagem.
- `.gitignore` â€” ignora builds, `node_modules` e arquivos `.env`.

## PrÃ©-requisitos
- Node.js (npm incluso).

## Backend (Express)
1) Entre na pasta:
```bash
cd backend
```
2) Instale as dependÃªncias:
```bash
npm install
```
3) Configure o ambiente:
- Copie `.env.example` para `.env` e ajuste se necessÃ¡rio (porta padrÃ£o `3001`).
4) Rode em desenvolvimento (hot-reload com nodemon):
```bash
npm run dev
```
Ou produÃ§ao simples:
```bash
npm start
```
5) Endpoint disponÃ­vel: `GET http://localhost:3001/api/hello` (responde `NRCruz app`).

## Frontend (React + Vite)
1) Entre na pasta:
```bash
cd frontend
```
2) Instale as dependÃªncias:
```bash
npm install
```
3) Configure o ambiente:

## Documentação da API
- UI Swagger: `http://localhost:3001/docs`
- Especificação em JSON: `http://localhost:3001/docs.json`
- Para adicionar novos endpoints, edite `backend/src/docs/openapi.js` seguindo o formato OpenAPI 3.0.
- Copie `.env.example` para `.env` e ajuste `VITE_API_BASE_URL` (padrÃ£o `http://localhost:3001`).
4) Rode em desenvolvimento:
```bash
npm run dev
```
5) Acesse a URL mostrada pelo Vite (ex.: `http://localhost:5173`). A pÃ¡gina inicial busca o endpoint `/api/hello`, espera `NRCruz app` e exibe `Hello NRCruz app`.

### AnÃ¡lise opcional do bundle
- Gere um relatÃ³rio visual do bundle executando `npm run analyze` dentro de `frontend/`.
- O arquivo `bundle-report.html` serÃ¡ criado na raiz de `frontend/`; abra-o no navegador para ver a composiÃ§Ã£o do bundle.

## Ordem sugerida para levantar
1) Inicie o backend (`npm run dev` em `backend/`).
2) Depois o frontend (`npm run dev` em `frontend/`).

## Scripts de conveniÃªncia na raiz (opcional)
- `npm run dev:backend` â€” roda o backend em modo dev.
- `npm run dev:frontend` â€” roda o frontend em modo dev.
- `npm run install:all` â€” instala dependÃªncias de backend e frontend.

## Qualidade de Código / SonarCloud
- Integração com o SonarCloud na organização `rafrcruz`, projeto `rafrcruz_nrcruz`.
- Cada push ou pull request para a branch `main` dispara análise automática via GitHub Actions.
- Mantenha o secret `SONAR_TOKEN` configurado no repositório para que a análise funcione.
- Para disparar a primeira análise, faça um commit em `main` ou abra um pull request apontando para `main`.
