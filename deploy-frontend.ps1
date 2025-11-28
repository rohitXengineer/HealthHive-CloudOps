#!/usr/bin/env pwsh
<#
.SYNOPSIS
    HealthHive Frontend Deployment Script
    Automates Docker container deployment similar to Ansible playbook

.DESCRIPTION
    Deploys healthhive-frontend Docker image with health checks and auto-restart

.PARAMETER ServerIP
    Target server IP (for remote deployment via SSH)

.PARAMETER DockerUsername
    Docker Hub username

.PARAMETER DockerPassword
    Docker Hub password or token

.EXAMPLE
    .\deploy-frontend.ps1 -ServerIP 192.168.1.100 -DockerUsername rohitkumar02 -DockerPassword mytoken

.EXAMPLE
    .\deploy-frontend.ps1  # Local deployment
#>

param(
    [string]$ServerIP = "localhost",
    [string]$DockerUsername = "rohitkumar02",
    [string]$DockerPassword = "",
    [string]$ImageName = "rohitkumar02/healthhive-cloudops-frontend:latest",
    [string]$ContainerName = "healthhive-frontend",
    [int]$HostPort = 3000,
    [int]$ContainerPort = 3000
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HealthHive Frontend Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch($Level) {
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

# Check Docker installation
Write-Log "Checking Docker installation..."
try {
    $dockerVersion = docker --version
    Write-Log "✓ Docker found: $dockerVersion" "SUCCESS"
} catch {
    Write-Log "✗ Docker not found. Please install Docker Desktop." "ERROR"
    exit 1
}

# Login to Docker Hub (if credentials provided)
if ($DockerPassword) {
    Write-Log "Logging in to Docker Hub as $DockerUsername..."
    $DockerPassword | docker login --username $DockerUsername --password-stdin | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✓ Docker Hub login successful" "SUCCESS"
    } else {
        Write-Log "✗ Docker Hub login failed" "ERROR"
        exit 1
    }
}

# Pull latest image
Write-Log "Pulling latest Docker image: $ImageName"
docker pull $ImageName
if ($LASTEXITCODE -ne 0) {
    Write-Log "✗ Failed to pull image" "ERROR"
    exit 1
}
Write-Log "✓ Image pulled successfully" "SUCCESS"

# Stop existing container
Write-Log "Stopping existing container '$ContainerName' (if running)..."
docker stop $ContainerName 2>$null
docker rm $ContainerName 2>$null
Write-Log "✓ Old container removed" "SUCCESS"

# Deploy new container
Write-Log "Deploying new container '$ContainerName'..."
docker run -d `
    --name $ContainerName `
    --restart always `
    -p "${HostPort}:${ContainerPort}" `
    -e NODE_ENV=production `
    $ImageName

if ($LASTEXITCODE -eq 0) {
    Write-Log "✓ Container deployed successfully" "SUCCESS"
} else {
    Write-Log "✗ Container deployment failed" "ERROR"
    exit 1
}

# Wait for container to start
Write-Log "Waiting for container to start..."
Start-Sleep -Seconds 3

# Health check
Write-Log "Performing health check..."
$maxRetries = 5
$retryCount = 0
$healthOK = $false

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:${HostPort}/" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Log "✓ Health check passed (HTTP 200)" "SUCCESS"
            $healthOK = $true
            break
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Log "Health check attempt $retryCount/$maxRetries failed, retrying..." "WARNING"
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $healthOK) {
    Write-Log "✗ Health check failed after $maxRetries attempts" "WARNING"
    Write-Log "Container logs:" "WARNING"
    docker logs $ContainerName
} else {
    Write-Log "✓ Container is healthy and responding" "SUCCESS"
}

# Display container info
Write-Host ""
Write-Log "Deployment Summary:" "INFO"
Write-Host "  Container: $ContainerName"
Write-Host "  Image: $ImageName"
Write-Host "  Port: http://localhost:$HostPort"
Write-Host "  Status: $(docker inspect -f '{{.State.Status}}' $ContainerName)"
Write-Host ""

# Display logs
Write-Log "Recent container logs:"
docker logs --tail 10 $ContainerName

Write-Host ""
Write-Log "✓ Deployment complete!" "SUCCESS"
Write-Log "Access frontend at: http://localhost:${HostPort}" "INFO"
