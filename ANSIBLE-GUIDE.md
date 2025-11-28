# Ansible Deployment Guide

## Installation

### On Linux/Mac:
```bash
pip install ansible
ansible-galaxy collection install community.docker
```

### On Windows (WSL2 recommended):
```bash
wsl
sudo apt update
sudo apt install python3-pip
pip3 install ansible
ansible-galaxy collection install community.docker
```

## Setup

### 1. Configure Inventory

Edit `ansible-inventory.ini` and add your server details:

```ini
[webservers]
healthhive-prod-01 ansible_host=192.168.1.100 ansible_user=ubuntu
healthhive-prod-02 ansible_host=192.168.1.101 ansible_user=ubuntu
```

### 2. Set SSH Keys

Ensure your SSH public key is on the target servers:
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub ubuntu@192.168.1.100
```

### 3. Set Docker Hub Credentials

Create a secure vault file:
```bash
ansible-vault create group_vars/all/vault.yml
```

Add to the vault file:
```yaml
docker_password: your_docker_hub_token
```

Or pass credentials at runtime:
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml -e "docker_password=YOUR_TOKEN"
```

## Usage

### Deploy Frontend to All Servers:
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml
```

### Deploy to Specific Server:
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml -l healthhive-prod-01
```

### Run Health Check and Rollback if Needed:
```bash
ansible-playbook -i ansible-inventory.ini ansible-health-check.yml
```

### Deploy with Verbose Output:
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml -vvv
```

### Dry Run (Check Mode):
```bash
ansible-playbook -i ansible-inventory.ini ansible-deploy-frontend.yml --check
```

## Playbook Details

### `ansible-deploy-frontend.yml`
- Installs Docker on target servers
- Starts Docker service
- Logs in to Docker Hub
- Pulls latest frontend image
- Stops and removes old container
- Deploys new container with port mapping
- Verifies deployment

### `ansible-health-check.yml`
- Checks if container is running
- Performs HTTP health check on the frontend
- Automatically rolls back to stable version if health check fails
- Displays diagnostics and logs

## Common Issues

### SSH Connection Refused
```bash
# Test SSH connection
ssh -i ~/.ssh/id_rsa ubuntu@192.168.1.100

# Check if SSH keys are properly added
ssh-keyscan 192.168.1.100 >> ~/.ssh/known_hosts
```

### Docker Permission Denied
Ensure the ansible_user is in the docker group:
```bash
ansible webservers -i ansible-inventory.ini -m shell -a "id"
```

### Docker Hub Authentication Failed
Verify credentials:
```bash
docker login -u rohitkumar02 -p YOUR_TOKEN
```

## Next Steps

1. Update `ansible-inventory.ini` with your server IPs
2. Test SSH connection to all servers
3. Create vault file with Docker credentials
4. Run deployment playbook
5. Monitor health checks

## Troubleshooting

View all Ansible hosts:
```bash
ansible-inventory -i ansible-inventory.ini --list
```

Test connectivity:
```bash
ansible all -i ansible-inventory.ini -m ping
```

Get facts from servers:
```bash
ansible all -i ansible-inventory.ini -m setup
```
