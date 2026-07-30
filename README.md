# Auth Practice API

A secure REST API built with **Next.js/Express** and **Supabase Auth**, demonstrating user authentication (signup, login, logout) and protected route handling via JWT bearer tokens.

## What this project does

In earlier versions of this API, every route was open to anyone. This version adds a real authentication layer:

- Users sign up and log in through **Supabase Auth**, which issues a JWT access token.
- Protected routes require that token in the `Authorization: Bearer <token>` header.
- A reusable Express middleware (`requireAuth`) verifies the token against Supabase on every protected request before the route logic runs.
- Interactive API documentation is available via **Swagger UI**, with full Bearer token support.

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/lynngoh7/auth-practice.git
cd auth-practice/my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your Supabase project

- Go to [supabase.com](https://supabase.com) and create a new project.
- In your Supabase dashboard, go to **Project Settings → API** and copy your **Project URL** and **anon public key**.

### 4. Set environment variables

Create a `.env` file in the `my-app/` directory:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
PORT=3000
```

> ⚠️ Never commit `.env` — it's already excluded via `.gitignore`.

### 5. Disable email confirmation (recommended for local testing)

In your Supabase dashboard: **Authentication → Providers → Email → toggle off "Confirm email"**. This lets you sign up and log in immediately without needing to click a confirmation email link.

## Running it

```bash
npm run dev
```

You should see:
```
Server running and connected to Supabase
```

The API will be available at `http://localhost:3000`.

Interactive Swagger docs: `http://localhost:3000/docs`

## API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Create a new user account |
| POST | `/auth/login` | No | Authenticate user & return JWT access token |
| POST | `/auth/logout` | Yes (Bearer) | Terminate the user's session |
| GET | `/public/info` | No | Public, unprotected data |
| GET | `/protected/profile` | Yes (Bearer) | Read the authenticated user's private profile |
| GET | `/protected/dashboard` | Yes (Bearer) | Example of a second middleware-protected route |

### Status codes used

| Code | Meaning |
|---|---|
| 200 | Successful read/login |
| 201 | User created (signup) |
| 204 | Logout successful, no content |
| 400 | Missing or invalid input |
| 401 | Missing, malformed, invalid, or expired token |

## Example requests

**Sign up:**
```bash
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com", "password":"yourpassword"}'
```

**Log in:**
```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com", "password":"yourpassword"}'
```

**Access a protected route:**
```bash
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer <your_access_token>"
```

## Swagger UI

The `/docs` route exposes full interactive documentation. Protected routes are marked with a padlock icon, and requests can be authorized directly in the browser via the **Authorize** button.

![swagger-ui-screenshot]

## Tech stack

- Node.js + Express
- Supabase Auth (`@supabase/supabase-js`)
- `dotenv` for environment configuration
- `swagger-ui-express` for API documentation