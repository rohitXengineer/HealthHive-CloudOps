# HealthHive CloudOps - Deployment Guide

## 📋 Overview

This guide covers all deployment methods for HealthHive Frontend:
1. **Docker Compose** (easiest for local/dev)
2. **PowerShell Script** (Windows-friendly automation)
3. **Kubernetes** (already deployed ✓)
4. **Ansible** (remote server deployment)

---

## 🐳 Option 1: Docker Compose (Recommended for Local)

### Prerequisites
- Docker Desktop installed and running

### Deploy
```powershell
cd D:\HealthHive-CloudOps
docker-compose up -d
```

### Access
- Frontend: `http://localhost:3000`

### Monitor
```powershell
# View logs
docker-compose logs -f healthhive-frontend

# Check status
docker-compose ps

# Stop
docker-compose down
```

---

## 🔧 Option 2: PowerShell Script (Windows Automation)

### Deploy (Local)
```powershell
cd D:\HealthHive-CloudOps
.\deploy-frontend.ps1
```

### Deploy (Remote with credentials)
```powershell
.\deploy-frontend.ps1 `
  -ServerIP 192.168.1.100 `
  -DockerUsername rohitkumar02 `
  -DockerPassword your_docker_token
```

### What it does
- ✓ Checks Docker installation
- ✓ Logs in to Docker Hub
- ✓ Pulls latest image
- ✓ Stops old container
- ✓ Deploys new container
- ✓ Performs health checks
- ✓ Shows container logs

---

## ☸️ Option 3: Kubernetes (Already Running ✓)

### Check Status
```powershell
kubectl get deployment healthhive-frontend
kubectl get pods -l app=healthhive-frontend
kubectl get svc healthhive-frontend-service
```

### Access
- External IP: `http://localhost:80`
- NodePort: `http://localhost:31372`
- Port Forward: 
  ```powershell
  kubectl port-forward svc/healthhive-frontend-service 3000:80
  # Then: http://localhost:3000
  ```

### Scale
```powershell
kubectl scale deployment healthhive-frontend --replicas=5
```

### View Logs
```powershell
kubectl logs -l app=healthhive-frontend -f
```

### Delete
```powershell
kubectl delete deployment healthhive-frontend
kubectl delete svc healthhive-frontend-service
```

---

## 🔌 Option 4: Ansible (Remote Servers)

### Prerequisites (on Linux/WSL)
```bash
# Install Ansible
pip install ansible
ansible-galaxy collection install community.docker

# Configure SSH keys
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.100
```

### Configure Inventory
Edit `ansible-inventory.ini`:
```ini
[webservers]
healthhive-prod-01 ansible_host=192.168.1.100 ansible_user=ubuntu
healthhive-prod-02 ansible_host=192.168.1.101 ansible_user=ubuntu
```

### Deploy
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml
```

### Health Check & Rollback
```bash
ansible-playbook -i ansible-inventory.ini ansible-health-check.yml
```

### View Details
See `ANSIBLE-GUIDE.md` for full documentation.

---

## 🚀 Deployment Comparison

| Method | Local | Remote | Easy | Prod |
|--------|-------|--------|------|------|
| **Docker Compose** | ✓ | ✗ | ✓✓✓ | ✗ |
| **PowerShell** | ✓ | ~ | ✓✓ | ✓ |
| **Kubernetes** | ✓ | ✓ | ✓ | ✓✓✓ |
| **Ansible** | ✗ | ✓ | ✓ | ✓✓ |

---

## 📊 Monitoring & Logs

### Docker Compose
```powershell
docker-compose logs -f healthhive-frontend
```

### PowerShell/Docker
```powershell
docker logs -f healthhive-frontend
```

### Kubernetes
```powershell
kubectl logs -l app=healthhive-frontend -f
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automatic)
✓ On every push to `main`:
1. Builds Docker image
2. Pushes to Docker Hub
3. Tags with commit SHA

### Configure Secrets
1. Go to GitHub repo → Settings → Secrets
2. Add:
   - `DOCKERHUB_USERNAME` = rohitkumar02
   - `DOCKERHUB_TOKEN` = your_docker_token

---

## 🆘 Troubleshooting

### Container won't start
```powershell
# Check logs
docker logs healthhive-frontend

# Inspect image
docker inspect rohitkumar02/healthhive-cloudops-frontend:latest

# Test image locally
docker run -p 3000:3000 rohitkumar02/healthhive-cloudops-frontend:latest
```

### Port already in use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID 12345 /F
```

### Docker Hub auth failed
```powershell
# Test credentials
docker login -u rohitkumar02

# Check stored credentials
cat %APPDATA%\.docker\config.json
```

### Kubernetes pod stuck
```powershell
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl delete pod <pod-name>  # Will restart
```

---

## ✅ Checklist

- [ ] Docker Desktop running
- [ ] Frontend image pushed to Docker Hub
- [ ] GitHub Actions secrets configured
- [ ] Kubernetes cluster running
- [ ] Ansible installed (optional, for remote)
- [ ] Production server SSH access ready

---

## 🎯 Next Steps

1. **Local Testing**: `docker-compose up -d`
2. **Monitor**: `docker-compose logs -f`
3. **Push to Git**: `git push origin main` (triggers GitHub Actions)
4. **Deploy to Prod**: Choose Kubernetes, Ansible, or PowerShell script
5. **Monitor Health**: Logs, health checks, metrics

---

**Need help?** Check specific option documentation or run deployment scripts with `-Verbose` flag.
