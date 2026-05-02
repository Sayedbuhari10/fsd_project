# Smart Energy System

This project is a React + Node.js + Spring Boot microservices demo that now supports:

- React frontend with Node.js
- Spring Boot based microservices
- Login workflow backed by MySQL
- API Gateway based routing
- Loosely coupled REST services
- Docker containerization
- Kubernetes deployment

## Architecture

- `frontend-service` - React login page and dashboard UI served by Node.js
- `gateway-service` - API gateway for backend routes
- `auth-service` - login service with MySQL-backed users
- `dashboard-service` - dashboard overview and top-level metrics
- `consumption-service` - historic usage section
- `simulation-service` - home simulation section
- `realtime-service` - live consumption section

## Why It Is Loosely Coupled

- The React frontend talks to one API entry point through `/api`
- Each service has its own codebase and port
- The gateway only knows service URLs through environment variables
- The Node frontend proxies API calls to the gateway instead of calling internal services directly
- Each business capability can be changed independently

## Workflow

1. The user opens the React frontend on `http://localhost:3000`
2. `frontend-service/server.js` serves the React application
3. The user logs in through the React login page
4. The frontend posts credentials to `/api/auth/login`
5. The Node frontend proxies that request to `gateway-service`
6. `gateway-service` routes the request to `auth-service`
7. `auth-service` verifies the user against MySQL running in Laragon
8. After login, the React dashboard loads data from:
   `dashboard-service`, `consumption-service`, `simulation-service`, and `realtime-service`

## Run In VS Code

Open the folder in VS Code and use the integrated terminal.

## Use NPM Commands

This project now includes a Node.js + React frontend service. The root `npm` file is still a convenience layer so you can control Docker and Kubernetes using simple commands when Node is available.

First check Node.js and npm:

```powershell
node -v
npm -v
```

Then use:

```powershell
npm run docker:up
npm run docker:ps
npm run docker:logs
npm run docker:down
```

For Kubernetes:

```powershell
npm run k8s:apply
npm run k8s:pods
npm run k8s:services
npm run k8s:all
npm run k8s:forward
```

The Kubernetes frontend will then be available at:

`http://localhost:30082`

## Run With Docker Compose

```powershell
docker compose up --build
```

Open:

`http://localhost:3000`

Laragon MySQL defaults used by the auth service:

- host: `host.docker.internal`
- port: `3306`
- database: `smart_energy_demo`
- username: `root`
- password: empty string

## Run In Kubernetes

Build the images first:

```powershell
docker build -t smart-energy/frontend-service:1.0.0 -f frontend-service/Dockerfile .
docker build -t smart-energy/auth-service:1.0.0 -f auth-service/Dockerfile .
docker build -t smart-energy/dashboard-service:1.0.0 -f dashboard-service/Dockerfile .
docker build -t smart-energy/consumption-service:1.0.0 -f consumption-service/Dockerfile .
docker build -t smart-energy/simulation-service:1.0.0 -f simulation-service/Dockerfile .
docker build -t smart-energy/realtime-service:1.0.0 -f realtime-service/Dockerfile .
docker build -t smart-energy/gateway-service:1.0.0 -f gateway-service/Dockerfile .
```

Apply manifests:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/dashboard-service.yaml
kubectl apply -f k8s/consumption-service.yaml
kubectl apply -f k8s/simulation-service.yaml
kubectl apply -f k8s/realtime-service.yaml
kubectl apply -f k8s/gateway-service.yaml
```

Check the deployment:

```powershell
kubectl get all -n smart-energy-demo
```

Recommended local access for Docker Desktop Kubernetes:

```powershell
kubectl port-forward svc/frontend-service 30082:3000 -n smart-energy-demo
```

Then open:

`http://localhost:30082`

Alternative:

- The frontend service is exposed as a `NodePort` on `30082`
- The gateway service is still exposed as a `NodePort` on `30080`
- Depending on Docker Desktop networking, `NodePort` may not always be directly reachable in the browser
- `port-forward` is the most reliable demo method on a local machine

## Notes

- Local `npm` is not required if you use Docker to build the React frontend
- The project uses Java 11 compatible Spring Boot 2.7
- Login is backed by MySQL and the other services currently use demo data
- Maven is not installed locally on this machine, so Docker is the intended build path right now
