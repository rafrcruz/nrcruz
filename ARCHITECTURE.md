# Project structure and feature modules

This repository is organized as a backend/frontend monorepo. Both sides now follow a light "feature module" convention so that new domain areas can grow without forcing everything into flat directories.

## Backend (Express)
- Feature code lives under `backend/src/modules/<feature>/`.
- Inside each module you can place `*.controller.js`, `*.service.js`, `*.repository.js`, `*.validation.js` and a `*.routes.js` that wires the module into Express.
- Cross-cutting concerns (e.g., `config/`, `middlewares/`, `utils/`, `docs/`) stay in their existing top-level folders.

### Adding a new feature (example: patients)
1. Create a folder `backend/src/modules/patients/` with files such as:
   - `patients.controller.js` for HTTP handlers.
   - `patients.service.js` for business logic.
   - `patients.repository.js` for data access.
   - `patients.validation.js` for Joi schemas.
   - `patients.routes.js` exporting an Express router (e.g., `router.get('/', validateRequest(patientValidation), patientsController.list);`).
2. Register the module routes in `backend/src/routes/index.js`:
   ```js
   const patientRoutes = require('../modules/patients/patients.routes');
   router.use('/api/patients', patientRoutes);
   ```
3. Keep tests in `backend/tests/`, mirroring the module names (e.g., `patientsController.test.js`).

## Frontend (React + Vite)
- Feature-specific UI code lives under `frontend/src/features/<feature>/`.
- Organize by concern inside the feature: `pages/`, `hooks/`, `services/`, and optionally `components/` or `validation/` for feature-only utilities.
- Shared cross-feature utilities remain in their existing roots such as `frontend/src/services/`, `frontend/src/components/`, `frontend/src/context/`, and `frontend/src/styles/`.

### Adding a new feature (example: agenda)
1. Create `frontend/src/features/agenda/` and add:
   - `pages/AgendaPage.jsx` (lazy-load it in `App.jsx`).
   - `hooks/useAgenda.js` for feature state/data fetching.
   - `services/agendaService.js` that consumes shared clients from `src/services/`.
   - Optional `components/` for agenda-specific UI pieces.
2. Import the new page in `frontend/src/app/App.jsx` using `lazy(() => import('../features/agenda/pages/AgendaPage'))`.
3. Co-locate unit tests next to the files they cover (e.g., `pages/AgendaPage.test.jsx`, `services/agendaService.test.js`).

Following this layout keeps domain code together, while shared infrastructure remains stable. New modules can be added incrementally without changing existing APIs or behavior.
