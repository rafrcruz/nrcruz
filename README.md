# NRCruz Monorepo (React + Express)

## Estrutura
- `backend/` — API Express com endpoint `GET /api/hello`.
- `frontend/` — app React (Vite) que consome o endpoint e exibe a mensagem.
- `.gitignore` — ignora builds, `node_modules` e arquivos `.env`.

## Pré-requisitos
- Node.js (npm incluso).

## Backend (Express)
1. Entre na pasta:
```bash
cd backend
```
2. Instale as dependências:
```bash
npm install
```
3. Configure o ambiente:
   - Copie `.env.example` para `.env` e ajuste se necessário (porta padrão `3001`).
4. Rode em desenvolvimento (hot-reload com nodemon):
```bash
npm run dev
```
   - Produção simples:
```bash
npm start
```
5. Endpoint disponível: `GET http://localhost:3001/api/hello` (responde `NRCruz app`).
6. Documentação da API:
   - UI Swagger: `http://localhost:3001/docs`
   - JSON: `http://localhost:3001/docs.json`
   - Para novos endpoints, edite `backend/src/docs/openapi.js` seguindo OpenAPI 3.0.

## Frontend (React + Vite)
1. Entre na pasta:
```bash
cd frontend
```
2. Instale as dependências:
```bash
npm install
```
3. Configure o ambiente:
   - Copie `.env.example` para `.env` e ajuste `VITE_API_BASE_URL` (padrão `http://localhost:3001`).
4. Rode em desenvolvimento:
```bash
npm run dev
```
5. Acesse a URL mostrada pelo Vite (ex.: `http://localhost:5173`). A página inicial chama `/api/hello`, espera `NRCruz app` e exibe `Hello NRCruz app`.

### Análise opcional do bundle
- Gere um relatório visual do bundle executando `npm run analyze` dentro de `frontend/`.
- O arquivo `bundle-report.html` será criado na raiz de `frontend/`; abra-o no navegador para ver a composição do bundle.

## Ordem sugerida para levantar
1. Inicie o backend (`npm run dev` em `backend/`).
2. Depois o frontend (`npm run dev` em `frontend/`).

## Scripts de conveniência na raiz (opcional)
- `npm run dev:backend` — roda o backend em modo dev.
- `npm run dev:frontend` — roda o frontend em modo dev.
- `npm run install:all` — instala dependências de backend e frontend.

## Qualidade de Código / SonarCloud
- Integração com o SonarCloud na organização `rafrcruz`, projeto `rafrcruz_nrcruz`.
- Cada push ou pull request para a branch `main` dispara análise automática via GitHub Actions.
- Mantenha o secret `SONAR_TOKEN` configurado no repositório para que a análise funcione.
- Para disparar a primeira análise, faça um commit em `main` ou abra um pull request apontando para `main`.
