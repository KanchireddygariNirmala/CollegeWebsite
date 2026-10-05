
# College Admissions App

A simple student-application app: a React frontend and an Express + PostgreSQL backend.

```
college-admissions-app/
├── client/   React frontend (Create React App)
├── server/   Express API + PostgreSQL
└── render.yaml   Render Blueprint for deploying both services
```

## Local development

### 1. Database

Create a local Postgres database, then run the schema:

```bash
psql -U <your_user> -d <your_db> -f server/schema.sql
```

### 2. Backend

```bash
cd server
cp .env.example .env   # fill in your local DB credentials
npm install
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd client
cp .env.example .env   # defaults to http://localhost:5000
npm install
npm start                # starts on http://localhost:3000
```

## Deploying to Render

This repo includes a `render.yaml` Blueprint that provisions both services.

1. Push this repo to GitHub.
2. In the Render dashboard: **New → Blueprint**, select this repo.
3. Render reads `render.yaml` and creates two services:
   - `college-admissions-server` — Node web service (API)
   - `college-admissions-client` — static site (React build)
4. You'll be prompted to fill in the env vars marked `sync: false`:
   - Server: `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_DATABASE`, `ALLOWED_ORIGINS` (your client's Render URL)
   - Client: `REACT_APP_API_URL` (your server's Render URL)
5. Use a managed Postgres instance (Render Postgres or any external provider) and point the server env vars at it. Run `server/schema.sql` against it once.
6. Once both services are live, add your custom domain under each service's **Settings → Custom Domain** and point your DNS (CNAME) at the Render-provided target.

### Deploying manually (without the Blueprint)

- **Backend**: New → Web Service → root directory `server`, build command `npm install`, start command `npm start`. Add the same env vars as above.
- **Frontend**: New → Static Site → root directory `client`, build command `npm install && npm run build`, publish directory `build`. Add `REACT_APP_API_URL` pointing at the backend's Render URL.
