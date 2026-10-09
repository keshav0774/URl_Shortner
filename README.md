# URL Shortener — Full-Stack Link Management Platform

A full-stack URL shortening and link management application built with **React, Node.js, Express, MongoDB, and Redis**. Create and manage short links, monitor click activity, and explore URL analytics through a dedicated dashboard.

**[Live Demo](http://15.206.205.216/shortener/)** · **[GitHub Repository](https://github.com/keshav0774/URl_Shortner)**

> **Deployment note:** The live demo currently uses an EC2 public IP over HTTP. Its address may change if the instance is restarted without a static IP.

## Features

- **Short URL generation** — Turn long URLs into shorter, shareable links.
- **Custom aliases** — Create personalized short links.
- **URL redirection** — Redirect visitors from short URLs to their original destinations.
- **Authentication** — JWT-based user authentication and protected features.
- **Link management** — View and manage generated links in a user dashboard.
- **Click analytics** — Track URL clicks and visualize daily engagement trends.
- **Redis rate limiting** — Restrict excessive URL-generation requests using atomic counters and key expiration.
- **Automated deployment** — Deploy updates to AWS EC2 using GitHub Actions.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Caching / Rate limiting | Redis |
| Authentication | JSON Web Tokens (JWT) |
| Hosting | AWS EC2 (Linux) |
| Web server / Reverse proxy | Nginx |
| Process manager | PM2 |
| CI/CD | GitHub Actions, SSH |

## Architecture

```text
Browser
  |
  v
AWS EC2 :80
  |
  v
Nginx
  |-- /shortener/   --> React / Vite production build
  |
  |-- /api/short/  --> Express API (port 3000, managed by PM2)
                           |
                           |-- MongoDB (application data)
                           |-- Redis (rate limiting)
```

The application is hosted alongside another project on the same EC2 instance. Nginx routes the URL Shortener frontend and API traffic by path.

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── backend/
├── frontend/
└── README.md
```

## Run Locally

### Prerequisites

- Node.js and npm
- A MongoDB database
- A Redis instance or configured Redis service
- Any environment variables required by the backend

### 1. Clone the repository

```bash
git clone https://github.com/keshav0774/URl_Shortner.git
cd URl_Shortner
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure the backend environment variables required by the application (such as database connection, JWT secret, and Redis connection settings) in a local `.env` file. Refer to the backend source for the exact variable names; do not commit secrets.

Start the backend using the start script defined in `backend/package.json`, or run its entry point in your local development environment.

### 3. Install and run the frontend

```bash
cd ../frontend
npm install
npm run dev
```

For the deployed application, the frontend is built with a `/shortener/` base path and uses the Nginx-proxied API path `/api/short`. Local frontend API configuration may need to be adjusted for your development server.

## CI/CD with GitHub Actions

The repository includes a workflow at `.github/workflows/deploy.yml` that runs on pushes to `main` and supports manual execution.

**Deployment flow:**

1. GitHub Actions starts when code is pushed to `main`.
2. The workflow connects to the EC2 instance over SSH.
3. The server pulls the latest code from GitHub.
4. Backend and frontend dependencies are installed with `npm ci`.
5. The frontend production bundle is generated using `npm run build`.
6. PM2 restarts the URL Shortener backend process.

### Required GitHub Actions Secrets

| Secret | Purpose |
| --- | --- |
| `AWS_IP` | Public IP address or hostname of the EC2 instance |
| `AWS_USER` | SSH login username for EC2 |
| `AWS_SSH_KEY` | Private SSH key used by GitHub Actions to connect to EC2 |

Store these in **GitHub → Repository Settings → Secrets and variables → Actions**. Never commit private keys, credentials, or production `.env` files.

> **Operational note:** The EC2 server must also have non-interactive access to pull the repository. The workflow's configured Node.js path and PM2 process name are specific to the current EC2 deployment.

## Production Deployment

- **Platform:** AWS EC2
- **Frontend:** Static Vite build served through Nginx at `/shortener/`
- **Backend:** Express application running on port `3000`, managed by PM2
- **API proxy:** Nginx forwards `/api/short/` requests to the backend
- **Updates:** Automated through GitHub Actions after pushes to `main`

## Future Improvements

- Configure a custom domain and HTTPS certificate.
- Add automated tests and require them to pass before deployment.
- Add deployment health checks and rollback support.
- Expand analytics and operational monitoring.

## Author

**Keshav Mishra**

- GitHub: [@keshav0774](https://github.com/keshav0774)
- LinkedIn: [keshavmishra0774](https://linkedin.com/in/keshavmishra0774)

---

If you find this project useful, consider starring the repository!
