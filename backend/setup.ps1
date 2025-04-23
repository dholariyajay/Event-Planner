# Setup script for the Event Planner backend

# Create virtual environment if it doesn't exist
if (-not (Test-Path -Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Green
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Green
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
pip install -r requirements.txt

# Create instance directory if it doesn't exist
if (-not (Test-Path -Path "instance")) {
    Write-Host "Creating instance directory..." -ForegroundColor Green
    New-Item -ItemType Directory -Path "instance"
}

Write-Host "Setup complete! Run 'python run.py' to start the backend server." -ForegroundColor Green
